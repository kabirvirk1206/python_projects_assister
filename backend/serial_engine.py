import asyncio
import re
import time
from typing import List, Dict, Optional

import serial
import serial.tools.list_ports


def scan_ports() -> List[Dict[str, str]]:
    out = []
    for port in serial.tools.list_ports.comports():
        if port.description is not None:
            desc = port.description
        else:
            desc = "Unknown"
        if port.hwid is not None:
            hwid = port.hwid
        else:
            hwid = ""
        out.append({
            "port": port.device,
            "description": desc,
            "hwid": hwid,
        })
    return out


def detect_board(port_info: Dict[str, str]) -> str:
    # tries to guess the board from the usb descriptor strings
    combined = (
        port_info.get("description", "") + " " + port_info.get("hwid", "")
    ).lower()

    if "stlink" in combined or "st-link" in combined:
        return "stm32f401re"

    if "arduino" in combined:
        return "arduino_uno"

    if "ftdi" in combined or "ft232" in combined:
        return "arduino_uno"

    if "espressif" in combined:
        return "esp32_elegoo"

    if "cp210" in combined or "cp2102" in combined or "cp2104" in combined:
        return "esp32_elegoo"

    if "ch340" in combined or "ch341" in combined:
        return "esp32_elegoo"

    return "unknown"


class SerialReader:
    def __init__(self, port: str, baud_rate: int):
        self.port = port
        self.baud_rate = baud_rate
        self._serial: Optional[serial.Serial] = None
        self._running = False

    def close(self):
        self._running = False
        if self._serial is not None and self._serial.is_open:
            try:
                self._serial.close()
            except Exception:
                pass


async def run_i2c_scan(port: str, baud: int) -> List[str]:
    # sends I2C_SCAN to the firmware and collects the addresses it returns
    loop = asyncio.get_event_loop()

    def _blocking_scan() -> List[str]:
        addresses: List[str] = []
        try:
            with serial.Serial(port, baud, timeout=1.0) as ser:
                ser.reset_input_buffer()
                ser.write(b"I2C_SCAN\n")
                ser.flush()

                deadline = time.monotonic() + 3.0
                pattern = re.compile(r"FOUND:(0x[0-9A-Fa-f]{2})", re.IGNORECASE)

                while time.monotonic() < deadline:
                    raw = ser.readline()
                    if not raw:
                        continue
                    line = raw.decode("utf-8", errors="replace").strip()
                    match = pattern.search(line)
                    if match is not None:
                        addr = "0x" + match.group(1)[2:].upper().zfill(2)
                        if addr not in addresses:
                            addresses.append(addr)
                    if "SCAN_DONE" in line:
                        break
        except serial.SerialException as exc:
            raise RuntimeError(f"serial error during i2c scan: {exc}") from exc
        return addresses

    return await loop.run_in_executor(None, _blocking_scan)
