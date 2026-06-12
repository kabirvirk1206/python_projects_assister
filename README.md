# python_projects_assister (Serialscope)

A small web dashboard that helps me while building hardware projects on a breadboard. Frontend is HTML/CSS/JS, backend is Python.

Boards i actually own and that this supports:

- Arduino Uno
- ESP32 (Elegoo dev kit, WROOM-32 module)
- STM32F401RE (Nucleo-64)

---

## What it does

| Feature | What it gives you |
|---|---|
| Live oscilloscope | Streams the voltage on the MCU's analog pin to a scrolling chart over a websocket. |
| Interactive pinout | Click any pin to see its alternate functions (GPIO, SPI, I2C, ADC, UART). Pins are colour-coded by protocol and dangerous pins show a warning. |
| I²C scanner | Sweeps the I²C bus and matches every address it finds against a list of common chips (MPU6050, BME280, SSD1306, etc). |
| Auto board detect | When you plug in a board the matching pinout is picked automatically based on the USB descriptor. |

---

## Folder layout

```
python_projects_assister/
├── README.md
├── run_dev.sh
│
├── firmware/
│   └── serialscope/          arduino sketch (works on uno and esp32)
│
├── backend/                  python (fastapi + pyserial + websockets)
│   ├── app.py
│   ├── serial_engine.py
│   ├── pin_data.py
│   └── requirements.txt
│
└── frontend/                 html / css / js
    ├── index.html
    ├── app.css
    └── app.js
```

---

## Running it

```bash
./run_dev.sh
```

This sets up a python venv, installs the backend deps, and then serves the frontend with `python3 -m http.server` so theres no npm build step.

- backend api: `http://localhost:8000`
- frontend ui: `http://localhost:3000`

Manual setup if you'd rather:

```bash

cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload

cd frontend
python3 -m http.server 3000
```

---

## Stack

- backend: python 3.10+, fastapi, uvicorn, pyserial
- frontend: html, css, js
- firmware: arduino c++ (works on the uno and the esp32)

---

&copy; Kabir Virk 2026
