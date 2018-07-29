const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"))
const path = require("path")
const Bacon = require("baconjs")

const {initTradfri} = require("./tradfri.js")
const houm = require("./houm.js")

const PORT = process.env.PORT
if (!PORT) throw Error("PORT is required")

async function main() {
  const tradfri = await initTradfri()
  const setCommandStream = houm.startDriver(PORT)
  setCommandStream.onValue(({instanceId, state}) => {
    const device = tradfri.devices[instanceId]
    const operation = mkOperation(device, state)
    tradfri.operateLight(device, operation)
  })
}

function mkOperation(device, state) {
  const light = device.lightList[0]
  let operation = {onOff: state.on}
  if (state.on) {
    if (state.bri) operation.dimmer = scaleDimmer(state.bri)
    if (state.temperature) operation.colorTemperature = scaleTemperature(state.temperature)
    if (state.hue) operation.hue = scaleHue(state.hue)
    if (state.saturation) operation.saturation = scaleSaturation(state.saturation)
  }
  return operation
}

function scaleDimmer(bri) {
  return scaleRange([0, 255], [0, 100], bri)
}

function scaleTemperature(temperature) {
  return scaleRange([2200, 4000], [100, 0], temperature)
}

function scaleHue(hue) {
  return scaleRange([0, 255], [0, 360], hue)
}

function scaleSaturation(saturation) {
  return scaleRange([0, 255], [0, 100], saturation)
}

function scaleRange([fromMin, fromMax], [toMin, toMax], x) {
  return (toMax - toMin) * (x - fromMin) / (fromMax - fromMin) + toMin
}

main()
