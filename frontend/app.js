// serialscope frontend
// talks to the python backend at localhost:8000 if its running
// otherwise falls back to baked in pin data so the page still renders

const API = "http://localhost:8000";

// used when backend isnt up, keeps the pinout working offline
const FALLBACK_BOARDS = [
  { id: "arduino_uno",  name: "Arduino Uno" },
  { id: "esp32_elegoo", name: "ESP32 (Elegoo / WROOM-32)" },
  { id: "stm32f401re",  name: "STM32F401RE (Nucleo-64)" },
];

const FALLBACK_PINS = {
  esp32_elegoo: {
    name: "ESP32 (Elegoo / WROOM-32)",
    pins: [
      { id: "3V3",    label: "3V3",    functions: ["POWER"],                       voltage: "3.3V" },
      { id: "GND",    label: "GND",    functions: ["GND"],                         voltage: "0V"   },
      { id: "GPIO36", label: "GPIO36", functions: ["GPIO", "ADC1_CH0"],            voltage: "3.3V", warning: "input only" },
      { id: "GPIO39", label: "GPIO39", functions: ["GPIO", "ADC1_CH3"],            voltage: "3.3V", warning: "input only" },
      { id: "GPIO34", label: "GPIO34", functions: ["GPIO", "ADC1_CH6"],            voltage: "3.3V", warning: "input only" },
      { id: "GPIO35", label: "GPIO35", functions: ["GPIO", "ADC1_CH7"],            voltage: "3.3V", warning: "input only" },
      { id: "GPIO32", label: "GPIO32", functions: ["GPIO", "ADC1_CH4", "TOUCH9"], voltage: "3.3V" },
      { id: "GPIO33", label: "GPIO33", functions: ["GPIO", "ADC1_CH5", "TOUCH8"], voltage: "3.3V" },
      { id: "GPIO25", label: "GPIO25", functions: ["GPIO", "DAC1"],                voltage: "3.3V" },
      { id: "GPIO26", label: "GPIO26", functions: ["GPIO", "DAC2"],                voltage: "3.3V" },
      { id: "GPIO27", label: "GPIO27", functions: ["GPIO", "TOUCH7"],              voltage: "3.3V" },
      { id: "GPIO14", label: "GPIO14", functions: ["GPIO", "SPI_CLK"],             voltage: "3.3V" },
      { id: "GPIO12", label: "GPIO12", functions: ["GPIO", "SPI_MISO"],            voltage: "3.3V" },
      { id: "GPIO13", label: "GPIO13", functions: ["GPIO", "SPI_MOSI"],            voltage: "3.3V" },
      { id: "GPIO9",  label: "GPIO9",  functions: ["GPIO", "U1_RX"],               voltage: "3.3V" },
      { id: "GPIO10", label: "GPIO10", functions: ["GPIO", "U1_TX"],               voltage: "3.3V" },
      { id: "GPIO16", label: "GPIO16", functions: ["GPIO", "U2_RX"],               voltage: "3.3V" },
      { id: "GPIO17", label: "GPIO17", functions: ["GPIO", "U2_TX"],               voltage: "3.3V" },
      { id: "GPIO5",  label: "GPIO5",  functions: ["GPIO", "SPI_SS"],              voltage: "3.3V" },
      { id: "GPIO18", label: "GPIO18", functions: ["GPIO", "SPI_CLK"],             voltage: "3.3V" },
      { id: "GPIO19", label: "GPIO19", functions: ["GPIO", "SPI_MISO"],            voltage: "3.3V" },
      { id: "GPIO23", label: "GPIO23", functions: ["GPIO", "SPI_MOSI"],            voltage: "3.3V" },
      { id: "GPIO21", label: "GPIO21", functions: ["GPIO", "I2C_SDA"],             voltage: "3.3V" },
      { id: "GPIO22", label: "GPIO22", functions: ["GPIO", "I2C_SCL"],             voltage: "3.3V" },
      { id: "VIN",    label: "VIN",    functions: ["POWER_IN"],                    voltage: "5V"   },
    ],
  },

  arduino_uno: {
    name: "Arduino Uno",
    pins: [
      { id: "5V",  label: "5V",  functions: ["POWER"],                   voltage: "5V" },
      { id: "3V3", label: "3V3", functions: ["POWER"],                   voltage: "3.3V" },
      { id: "GND", label: "GND", functions: ["GND"],                     voltage: "0V" },
      { id: "A0",  label: "A0",  functions: ["GPIO", "ADC"],             voltage: "5V" },
      { id: "A1",  label: "A1",  functions: ["GPIO", "ADC"],             voltage: "5V" },
      { id: "A2",  label: "A2",  functions: ["GPIO", "ADC"],             voltage: "5V" },
      { id: "A3",  label: "A3",  functions: ["GPIO", "ADC"],             voltage: "5V" },
      { id: "A4",  label: "A4",  functions: ["GPIO", "ADC", "I2C_SDA"], voltage: "5V" },
      { id: "A5",  label: "A5",  functions: ["GPIO", "ADC", "I2C_SCL"], voltage: "5V" },
      { id: "D13", label: "D13", functions: ["GPIO", "SPI_SCK", "LED"], voltage: "5V" },
      { id: "D12", label: "D12", functions: ["GPIO", "SPI_MISO"],       voltage: "5V" },
      { id: "D11", label: "D11", functions: ["GPIO", "SPI_MOSI", "PWM"],voltage: "5V" },
      { id: "D10", label: "D10", functions: ["GPIO", "SPI_SS", "PWM"],  voltage: "5V" },
      { id: "D9",  label: "D9",  functions: ["GPIO", "PWM"],             voltage: "5V" },
      { id: "D6",  label: "D6",  functions: ["GPIO", "PWM"],             voltage: "5V" },
      { id: "D5",  label: "D5",  functions: ["GPIO", "PWM"],             voltage: "5V" },
      { id: "D3",  label: "D3",  functions: ["GPIO", "PWM"],             voltage: "5V" },
      { id: "D2",  label: "D2",  functions: ["GPIO"],                    voltage: "5V" },
      { id: "D1",  label: "D1",  functions: ["GPIO", "UART_TX"],         voltage: "5V" },
      { id: "D0",  label: "D0",  functions: ["GPIO", "UART_RX"],         voltage: "5V" },
      { id: "VIN", label: "VIN", functions: ["POWER_IN"],                voltage: "7-12V" },
      { id: "RST", label: "RST", functions: ["RESET"],                   voltage: "5V" },
    ],
  },

  stm32f401re: {
    name: "STM32F401RE (Nucleo-64)",
    pins: [
      { id: "3V3",  label: "3V3",  functions: ["POWER"],                                  voltage: "3.3V" },
      { id: "GND",  label: "GND",  functions: ["GND"],                                    voltage: "0V"   },
      { id: "PA0",  label: "PA0",  functions: ["GPIO", "ADC1_IN0", "TIM2_CH1"],           voltage: "3.3V" },
      { id: "PA1",  label: "PA1",  functions: ["GPIO", "ADC1_IN1", "USART2_RTS"],         voltage: "3.3V" },
      { id: "PA2",  label: "PA2",  functions: ["GPIO", "ADC1_IN2", "USART2_TX"],          voltage: "3.3V", warning: "used by ST-LINK VCP" },
      { id: "PA3",  label: "PA3",  functions: ["GPIO", "ADC1_IN3", "USART2_RX"],          voltage: "3.3V", warning: "used by ST-LINK VCP" },
      { id: "PA4",  label: "PA4",  functions: ["GPIO", "ADC1_IN4", "SPI1_NSS", "DAC1"],   voltage: "3.3V" },
      { id: "PA5",  label: "PA5",  functions: ["GPIO", "ADC1_IN5", "SPI1_SCK", "LD2"],    voltage: "3.3V", warning: "onboard LD2 LED" },
      { id: "PA6",  label: "PA6",  functions: ["GPIO", "ADC1_IN6", "SPI1_MISO"],          voltage: "3.3V" },
      { id: "PA7",  label: "PA7",  functions: ["GPIO", "ADC1_IN7", "SPI1_MOSI"],          voltage: "3.3V" },
      { id: "PA8",  label: "PA8",  functions: ["GPIO", "I2C3_SCL", "TIM1_CH1"],           voltage: "3.3V" },
      { id: "PA9",  label: "PA9",  functions: ["GPIO", "USART1_TX", "TIM1_CH2"],          voltage: "3.3V" },
      { id: "PA10", label: "PA10", functions: ["GPIO", "USART1_RX", "TIM1_CH3"],          voltage: "3.3V" },
      { id: "PA13", label: "PA13", functions: ["GPIO", "SWDIO"],                          voltage: "3.3V", warning: "SWD debug pin" },
      { id: "PA14", label: "PA14", functions: ["GPIO", "SWCLK"],                          voltage: "3.3V", warning: "SWD debug pin" },
      { id: "PB3",  label: "PB3",  functions: ["GPIO", "SPI1_SCK_AF", "I2C2_SDA_AF"],     voltage: "3.3V" },
      { id: "PB4",  label: "PB4",  functions: ["GPIO", "SPI1_MISO_AF", "I2C3_SDA"],       voltage: "3.3V" },
      { id: "PB5",  label: "PB5",  functions: ["GPIO", "SPI1_MOSI_AF", "I2C1_SMBA"],      voltage: "3.3V" },
      { id: "PB6",  label: "PB6",  functions: ["GPIO", "I2C1_SCL", "USART1_TX_AF"],       voltage: "3.3V" },
      { id: "PB7",  label: "PB7",  functions: ["GPIO", "I2C1_SDA", "USART1_RX_AF"],       voltage: "3.3V" },
      { id: "PB8",  label: "PB8",  functions: ["GPIO", "I2C1_SCL_AF", "TIM4_CH3"],        voltage: "3.3V" },
      { id: "PB9",  label: "PB9",  functions: ["GPIO", "I2C1_SDA_AF", "TIM4_CH4"],        voltage: "3.3V" },
      { id: "PB10", label: "PB10", functions: ["GPIO", "I2C2_SCL", "SPI2_SCK"],           voltage: "3.3V" },
      { id: "PB13", label: "PB13", functions: ["GPIO", "SPI2_SCK_AF"],                    voltage: "3.3V" },
      { id: "PB14", label: "PB14", functions: ["GPIO", "SPI2_MISO"],                      voltage: "3.3V" },
      { id: "PB15", label: "PB15", functions: ["GPIO", "SPI2_MOSI"],                      voltage: "3.3V" },
      { id: "PC0",  label: "PC0",  functions: ["GPIO", "ADC1_IN10"],                      voltage: "3.3V" },
      { id: "PC1",  label: "PC1",  functions: ["GPIO", "ADC1_IN11"],                      voltage: "3.3V" },
      { id: "PC13", label: "PC13", functions: ["GPIO", "B1_USER"],                        voltage: "3.3V", warning: "onboard user button" },
      { id: "5V",   label: "5V",   functions: ["POWER_IN"],                               voltage: "5V"   },
      { id: "NRST", label: "NRST", functions: ["RESET"],                                  voltage: "3.3V" },
      { id: "VBAT", label: "VBAT", functions: ["POWER_BACKUP"],                           voltage: "3.3V" },
    ],
  },
};

// common i2c devices, used to label scan results
const KNOWN_I2C = {
  "0x1E": "HMC5883L Magnetometer",
  "0x20": "PCF8574 / MCP23017 I/O Expander",
  "0x27": "PCF8574 LCD Backpack",
  "0x29": "TSL2561 / VL53L0X",
  "0x3C": "SSD1306 OLED",
  "0x3D": "SSD1306 OLED (alt)",
  "0x40": "INA219 / Si7021",
  "0x48": "ADS1115 ADC",
  "0x50": "AT24C EEPROM",
  "0x53": "ADXL345 Accelerometer",
  "0x57": "MAX30102 Pulse Oximeter",
  "0x5A": "MPR121 Touch",
  "0x68": "MPU6050 / DS3231 RTC",
  "0x69": "MPU6050 (alt)",
  "0x76": "BME280 / BMP280",
  "0x77": "BME280 / BMP280 (alt)",
};

// app state
let boards = [];
let currentBoardId = null;
let currentPort = null;
let backendAlive = false;
let selectedPin = null;
let pinFilter = "";

let scopeRunning = false;
let scopeWs = null;
let scopeTimer = null;
let scopeData = [];
let scopePhase = 0;
let scopeStart = 0;


// --- helpers ---

function $(id) {
  return document.getElementById(id);
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) {
    e.className = cls;
  }
  if (text !== undefined) {
    e.textContent = text;
  }
  return e;
}

function setStatus(connected, label) {
  const dot = $("status-dot");
  const txt = $("status-text");
  if (connected) {
    dot.classList.remove("off");
  } else {
    dot.classList.add("off");
  }
  txt.textContent = label;
}

// works out the colour category for a pin based on its function list
function functionCategory(functions) {
  const fs = functions.map(function(f) { return f.toUpperCase(); }).join(" ");

  if (fs.indexOf("POWER") !== -1 || fs.indexOf("VCC") !== -1 || fs.indexOf("3V3") !== -1 || fs.indexOf("5V") !== -1) {
    return "pwr";
  }
  if (fs.indexOf("GND") !== -1) {
    return "gnd";
  }
  if (fs.indexOf("I2C") !== -1 || fs.indexOf("SDA") !== -1 || fs.indexOf("SCL") !== -1) {
    return "i2c";
  }
  if (fs.indexOf("SPI") !== -1 || fs.indexOf("MOSI") !== -1 || fs.indexOf("MISO") !== -1 || fs.indexOf("SCK") !== -1) {
    return "spi";
  }
  if (fs.indexOf("UART") !== -1 || fs.indexOf("USART") !== -1 || fs.indexOf("TX") !== -1 || fs.indexOf("RX") !== -1) {
    return "uart";
  }
  if (fs.indexOf("ADC") !== -1) {
    return "adc";
  }
  return "gpio";
}

// returns badge colour class for a single function string
function badgeForFunction(fn) {
  const up = fn.toUpperCase();

  if (up.indexOf("I2C") !== -1 || up.indexOf("SDA") !== -1 || up.indexOf("SCL") !== -1) {
    return "purple";
  }
  if (up.indexOf("SPI") !== -1 || up.indexOf("MOSI") !== -1 || up.indexOf("MISO") !== -1 || up.indexOf("SCK") !== -1) {
    return "blue";
  }
  if (up.indexOf("UART") !== -1 || up.indexOf("USART") !== -1 || up.indexOf("TX") !== -1 || up.indexOf("RX") !== -1) {
    return "yellow";
  }
  if (up.indexOf("ADC") !== -1) {
    return "orange";
  }
  if (up.indexOf("POWER") !== -1 || up.indexOf("VCC") !== -1) {
    return "red";
  }
  return "green";
}


// --- backend probe ---

async function probeBackend() {
  try {
    const res = await fetch(API + "/api/boards", { method: "GET" });
    if (!res.ok) {
      backendAlive = false;
      return false;
    }
    backendAlive = true;
    return true;
  } catch (e) {
    backendAlive = false;
    return false;
  }
}


// --- board + port ---

async function loadBoards() {
  if (backendAlive) {
    try {
      const res = await fetch(API + "/api/boards");
      boards = await res.json();
    } catch (e) {
      boards = FALLBACK_BOARDS;
    }
  } else {
    boards = FALLBACK_BOARDS;
  }

  const sel = $("board-select");
  sel.innerHTML = "";

  for (let i = 0; i < boards.length; i++) {
    const opt = document.createElement("option");
    opt.value = boards[i].id;
    opt.textContent = boards[i].name;
    sel.appendChild(opt);
  }

  if (!currentBoardId && boards.length > 0) {
    currentBoardId = boards[0].id;
    sel.value = currentBoardId;
  }
}

async function loadPorts() {
  const listEl = $("port-list");
  const msgEl = $("port-msg");
  listEl.innerHTML = "";
  msgEl.textContent = "";

  if (!backendAlive) {
    msgEl.textContent = "backend not running. start the python server to scan ports.";
    return;
  }

  let ports = [];
  try {
    const res = await fetch(API + "/api/ports");
    ports = await res.json();
  } catch (e) {
    msgEl.textContent = "failed to scan ports.";
    return;
  }

  if (ports.length === 0) {
    msgEl.textContent = "no usb devices found. plug your board in and click rescan.";
    return;
  }

  for (let i = 0; i < ports.length; i++) {
    const p = ports[i];
    const wrap = el("div", "port");
    const row = el("div", "row spaced");
    const name = el("span", "name", p.port);
    row.appendChild(name);

    if (currentPort === p.port) {
      row.appendChild(el("span", "badge green", "connected"));
    } else {
      const useBtn = el("button", "btn", "use");
      useBtn.addEventListener("click", function() {
        currentPort = p.port;
        if (p.detected_board && p.detected_board !== "unknown") {
          currentBoardId = p.detected_board;
          $("board-select").value = currentBoardId;
          renderPinout();
        }
        $("i2c-port").value = p.port;
        loadPorts();
      });
      row.appendChild(useBtn);
    }
    wrap.appendChild(row);

    const desc = el("div", "port-desc muted");
    desc.style.fontSize = "11px";
    desc.style.marginTop = "2px";
    desc.textContent = p.description;
    if (p.detected_board && p.detected_board !== "unknown") {
      desc.appendChild(document.createTextNode(" · "));
      desc.appendChild(el("span", "badge blue", p.detected_board));
    }
    wrap.appendChild(desc);
    listEl.appendChild(wrap);
  }
}


// --- pinout ---

async function fetchPins(boardId) {
  if (backendAlive) {
    try {
      const res = await fetch(API + "/api/pins/" + boardId);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // fall through to fallback
    }
  }
  if (FALLBACK_PINS[boardId]) {
    return FALLBACK_PINS[boardId];
  }
  return { name: boardId, pins: [] };
}

async function renderPinout() {
  if (!currentBoardId) {
    return;
  }

  const data = await fetchPins(currentBoardId);
  $("pinout-name").textContent = data.name;
  $("chip-label").textContent = data.name;

  const allPins = data.pins || [];
  let pins = allPins;

  if (pinFilter.trim() !== "") {
    const q = pinFilter.toLowerCase();
    pins = allPins.filter(function(p) {
      if (p.id.toLowerCase().indexOf(q) !== -1) {
        return true;
      }
      if ((p.label || "").toLowerCase().indexOf(q) !== -1) {
        return true;
      }
      const fns = p.functions || [];
      for (let i = 0; i < fns.length; i++) {
        if (fns[i].toLowerCase().indexOf(q) !== -1) {
          return true;
        }
      }
      return false;
    });
  }

  const leftEl = $("pins-left");
  const rightEl = $("pins-right");
  leftEl.innerHTML = "";
  rightEl.innerHTML = "";

  const mid = Math.ceil(pins.length / 2);
  const leftPins = pins.slice(0, mid);
  const rightPins = pins.slice(mid).reverse();

  function makePin(p, isRight) {
    const cat = functionCategory(p.functions || []);
    let cls = "pin " + cat;
    if (isRight) {
      cls += " right";
    }
    if (selectedPin && selectedPin.id === p.id) {
      cls += " selected";
    }

    const row = el("div", cls);
    row.appendChild(el("span", "pid", p.label || p.id));

    const fn = (p.functions && p.functions.length > 0) ? p.functions[0] : "";
    row.appendChild(el("span", "fn", fn));

    row.addEventListener("click", function() {
      selectedPin = p;
      renderPinout();
    });

    return row;
  }

  for (let i = 0; i < leftPins.length; i++) {
    leftEl.appendChild(makePin(leftPins[i], false));
  }
  for (let i = 0; i < rightPins.length; i++) {
    rightEl.appendChild(makePin(rightPins[i], true));
  }

  const det = $("pin-detail");
  if (selectedPin) {
    det.innerHTML = "";
    det.style.display = "block";

    det.appendChild(el("h4", null, selectedPin.label || selectedPin.id));

    const tagRow = el("div", "row");
    tagRow.style.gap = "6px";
    tagRow.appendChild(el("span", "badge", selectedPin.voltage || "3.3V"));
    if (selectedPin.warning) {
      tagRow.appendChild(el("span", "badge red", selectedPin.warning));
    }
    det.appendChild(tagRow);

    det.appendChild(el("div", "label", "ALTERNATE FUNCTIONS"));

    const fnRow = el("div", "functions");
    const fns = selectedPin.functions || [];
    for (let i = 0; i < fns.length; i++) {
      fnRow.appendChild(el("span", "badge " + badgeForFunction(fns[i]), fns[i]));
    }
    det.appendChild(fnRow);
  } else {
    det.style.display = "none";
  }
}


// --- i2c scanner ---

function renderI2CGrid(found) {
  const grid = $("i2c-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 128; i++) {
    const hex = i.toString(16).padStart(2, "0");
    const upper = "0x" + hex.toUpperCase();
    let cls = "i2c-cell";
    if (found.indexOf(upper) !== -1) {
      cls += " found";
    }
    const cell = el("div", cls, hex);
    cell.title = upper;
    grid.appendChild(cell);
  }
}

function renderI2CDevices(found) {
  const list = $("i2c-devices");
  list.innerHTML = "";

  for (let i = 0; i < found.length; i++) {
    const addr = found[i];
    let name;
    if (KNOWN_I2C[addr]) {
      name = KNOWN_I2C[addr];
    } else {
      name = "unknown device";
    }
    const row = el("div", "device");
    row.appendChild(el("span", "badge green", addr));
    row.appendChild(el("span", "muted", name));
    list.appendChild(row);
  }
}

async function runI2CScan() {
  const port = $("i2c-port").value.trim();
  const baud = parseInt($("i2c-baud").value, 10) || 115200;
  const msg = $("i2c-msg");
  const btn = $("i2c-scan-btn");

  btn.disabled = true;
  btn.textContent = "scanning...";
  msg.textContent = "";

  if (!backendAlive) {
    msg.textContent = "backend not running. start the python server first.";
    btn.disabled = false;
    btn.textContent = "Run I2C Scan";
    return;
  }

  let found = [];
  try {
    const res = await fetch(API + "/api/i2c-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ port: port, baud: baud }),
    });
    if (!res.ok) {
      const body = await res.json();
      msg.textContent = "scan failed: " + (body.detail || "unknown error");
    } else {
      const data = await res.json();
      found = data.addresses || [];
    }
  } catch (e) {
    msg.textContent = "scan failed: " + e.message;
  }

  renderI2CGrid(found);
  renderI2CDevices(found);
  btn.disabled = false;
  btn.textContent = "Run I2C Scan";
}


// --- oscilloscope ---

// maps voltage to svg y coordinate, 0v at bottom 5.5v at top
function voltageToY(v) {
  const top = 0;
  const bottom = 240;
  const range = 5.5;
  const pct = v / range;
  return bottom - pct * (bottom - top);
}

function renderScope() {
  const line = $("scope-line");
  const w = 800;

  if (scopeData.length === 0) {
    line.setAttribute("points", "");
    $("rd-now").textContent = "0.00 V";
    $("rd-min").textContent = "0.00 V";
    $("rd-max").textContent = "0.00 V";
    return;
  }

  const n = scopeData.length;
  const step = w / Math.max(1, n - 1);
  const parts = [];
  let min = scopeData[0].v;
  let max = scopeData[0].v;

  for (let i = 0; i < n; i++) {
    const x = i * step;
    const y = voltageToY(scopeData[i].v);
    parts.push(x.toFixed(1) + "," + y.toFixed(1));
    if (scopeData[i].v < min) {
      min = scopeData[i].v;
    }
    if (scopeData[i].v > max) {
      max = scopeData[i].v;
    }
  }

  line.setAttribute("points", parts.join(" "));

  const cur = scopeData[n - 1].v;
  $("rd-now").textContent = cur.toFixed(2) + " V";
  $("rd-min").textContent = min.toFixed(2) + " V";
  $("rd-max").textContent = max.toFixed(2) + " V";
}

function pushSample(v) {
  const t = Date.now() - scopeStart;
  scopeData.push({ t: t, v: v });
  if (scopeData.length > 200) {
    scopeData = scopeData.slice(-200);
  }
  renderScope();
}

function startWsLoop(port, baud, rateHz) {
  scopeStart = Date.now();
  scopeData = [];

  scopeWs = new WebSocket("ws://localhost:8000/ws/oscilloscope");

  scopeWs.onopen = function() {
    scopeWs.send(JSON.stringify({
      port: port,
      baud: baud,
      sample_rate: rateHz,
    }));
  };

  scopeWs.onmessage = function(ev) {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (msg.error) {
      return;
    }
    if (typeof msg.v === "number") {
      pushSample(msg.v);
    }
  };

  scopeWs.onerror = function() {
    stopScope();
    $("scope-btn").textContent = "Start";
    $("scope-btn").classList.remove("danger");
    $("i2c-msg").textContent = "";
    $("port-msg").textContent = "websocket failed. is the backend running?";
  };

  scopeWs.onclose = function() {
    // nothing needed here
  };
}

function stopScope() {
  if (scopeTimer) {
    clearInterval(scopeTimer);
    scopeTimer = null;
  }
  if (scopeWs) {
    try {
      scopeWs.send(JSON.stringify({ cmd: "stop" }));
    } catch (e) {
      // already closed probably
    }
    try {
      scopeWs.close();
    } catch (e) {
      // ignore
    }
    scopeWs = null;
  }
  scopeRunning = false;
}

function toggleScope() {
  const btn = $("scope-btn");

  if (scopeRunning) {
    stopScope();
    btn.textContent = "Start";
    btn.classList.remove("danger");
    return;
  }

  if (!backendAlive) {
    $("port-msg").textContent = "backend not running. start the python server first.";
    return;
  }

  if (!currentPort) {
    $("port-msg").textContent = "pick a port from the list first.";
    return;
  }

  const rate = parseInt($("rate").value, 10) || 20;
  const baud = parseInt($("scope-baud").value, 10) || 115200;
  startWsLoop(currentPort, baud, rate);

  scopeRunning = true;
  btn.textContent = "Stop";
  btn.classList.add("danger");
}


// --- wire up events ---

function wireEvents() {
  $("board-select").addEventListener("change", function(e) {
    currentBoardId = e.target.value;
    selectedPin = null;
    renderPinout();
  });

  $("rescan-btn").addEventListener("click", async function() {
    await probeBackend();
    if (backendAlive) {
      setStatus(true, "backend ok");
    } else {
      setStatus(false, "backend not running");
    }
    await loadPorts();
  });

  $("rate").addEventListener("input", function(e) {
    $("rate-val").textContent = e.target.value;
  });

  $("scope-btn").addEventListener("click", toggleScope);

  $("i2c-scan-btn").addEventListener("click", runI2CScan);

  $("pin-filter").addEventListener("input", function(e) {
    pinFilter = e.target.value;
    renderPinout();
  });
}


// --- boot ---

async function boot() {
  wireEvents();
  await probeBackend();
  if (backendAlive) {
    setStatus(true, "backend ok");
  } else {
    setStatus(false, "backend not running");
  }
  await loadBoards();
  await loadPorts();
  renderI2CGrid([]);
  await renderPinout();
}

boot();
