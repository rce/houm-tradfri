const request = require("request-promise")
const {AccessoryTypes} = require("node-tradfri-client")
const {initTradfri} = require("./tradfri.js")

const SITE_KEY = process.env.SITE_KEY
if (!SITE_KEY) throw Error("SITE_KEY is required")

const ROOM_ID = process.env.ROOM_ID
if (!ROOM_ID) throw Error("ROOM_ID is required")

const DRIVER_ENDPOINT = process.env.DRIVER_ENDPOINT
if (!DRIVER_ENDPOINT) throw Error("DRIVER_ENDPOINT is required")

const temperatureTypes = [
  "colorTemperature",
  "rgbColorTemperature",
]

const spectrumTypeMap = {
  "white": "colorTemperature",
  "none": "dimmable",
  "rgb": "rgb",
}

async function main() {
  const tradfri = await initTradfri()
  try {
    const houmDevices = Object.values(tradfri.devices)
      .filter(d => d.type === AccessoryTypes.lightbulb)
      .map(mkHoumDevice)
    for (const d of houmDevices) {
      await postDevice(d)
    }
  } finally {
    tradfri.destroy()
  }
}

function mkHoumDevice(d) {
  const light = d.lightList[0]
  const houmDevice = {
    "roomId": ROOM_ID,
    "address": `${DRIVER_ENDPOINT}/tradfri/${d.instanceId}`,
    "type": spectrumTypeMap[light.spectrum],
    "name": d.name,
  }
  if (temperatureTypes.includes(houmDevice.type)) {
    houmDevice.temperatureLimits = {"min": 2200, "max": 4000}
  }
  return houmDevice
}

async function postDevice(device) {
  console.log("Adding device:", JSON.stringify(device, null, 2))
  await request({
    method: "POST",
    url: `https://houmkolmonen.herokuapp.com/api/site/${SITE_KEY}/httpDevice`,
    json: true,
    body: device,
  })
}

main()
