import asyncio
import json
import math
import random
import time
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pin_data import BOARDS
from serial_engine import scan_ports, detect_board, run_i2c_scan, SerialReader


BOARD_META = {
    "arduino_uno":  "Arduino Uno",
    "esp32_elegoo": "ESP32 (Elegoo / WROOM-32)",
    "stm32f401re":  "STM32F401RE (Nucleo-64)",
}


app = FastAPI(title="Serialscope api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class I2CScanRequest(BaseModel):
    port: str
    baud: int = 115200


@app.get("/api/ports")
def get_ports():
    ports = scan_ports()
    for p in ports:
        p["detected_board"] = detect_board(p)
    return ports


@app.get("/api/boards")
def get_boards():
    out = []
    for key in BOARDS.keys():
        if key in BOARD_META:
            name = BOARD_META[key]
        else:
            name = key
        out.append({"id": key, "name": name})
    return out


@app.get("/api/pins/{board_id}")
def get_pins(board_id: str):
    if board_id not in BOARDS:
        raise HTTPException(status_code=404, detail=f"board '{board_id}' not found")
    if board_id in BOARD_META:
        name = BOARD_META[board_id]
    else:
        name = board_id
    return {"name": name, "pins": BOARDS[board_id]}


@app.post("/api/i2c-scan")
async def i2c_scan(req: I2CScanRequest):
    # demo mode short circuit so the ui works without hardware
    if req.port == "demo":
        return {"addresses": ["0x3C", "0x68", "0x76"]}
    try:
        addresses = await run_i2c_scan(req.port, req.baud)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    return {"addresses": addresses}


async def _check_stop(websocket: WebSocket) -> bool:
    try:
        msg = await asyncio.wait_for(websocket.receive_text(), timeout=0.001)
    except asyncio.TimeoutError:
        return False
    except Exception:
        return True
    try:
        data = json.loads(msg)
    except Exception:
        return False
    if data.get("cmd") == "stop":
        return True
    return False


@app.websocket("/ws/oscilloscope")
async def oscilloscope_ws(websocket: WebSocket):
    await websocket.accept()
    reader: Optional[SerialReader] = None

    try:
        config_text = await asyncio.wait_for(websocket.receive_text(), timeout=10.0)
        config = json.loads(config_text)

        port = config.get("port", "demo")
        baud = int(config.get("baud", 115200))
        sample_rate = int(config.get("sample_rate", 10))

        if sample_rate < 1:
            sample_rate = 1
        elif sample_rate > 100:
            sample_rate = 100

        interval = 1.0 / sample_rate
        demo_mode = port == "demo"

        if not demo_mode:
            try:
                import serial as _serial
                reader = SerialReader(port, baud)
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(
                    None,
                    lambda: setattr(
                        reader, "_serial", _serial.Serial(port, baud, timeout=1.0)
                    ),
                )
            except Exception:
                demo_mode = True

        t_start = time.time()
        phase = 0.0

        while True:
            should_stop = await _check_stop(websocket)
            if should_stop:
                break

            ts = (time.time() - t_start) * 1000.0  # ms

            if demo_mode:
                phase += 2.0 * math.pi * 1.0 * interval
                voltage = 1.65 + 1.5 * math.sin(phase) + 0.1 * (random.random() - 0.5)
                voltage = round(voltage, 4)
            else:
                voltage = None
                if reader is not None and reader._serial is not None:
                    if reader._serial.in_waiting > 0:
                        try:
                            raw = reader._serial.readline()
                            line = raw.decode("utf-8", errors="replace").strip()
                            voltage = float(line)
                        except ValueError:
                            voltage = None
                        except Exception:
                            voltage = None
                if voltage is None:
                    phase += 2.0 * math.pi * 1.0 * interval
                    voltage = round(
                        1.65 + 1.5 * math.sin(phase) + 0.05 * (random.random() - 0.5),
                        4,
                    )

            await websocket.send_json({"t": round(ts, 2), "v": voltage})
            await asyncio.sleep(interval)

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        if reader is not None:
            reader.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
