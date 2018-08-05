const {discoverGateway, TradfriClient} = require("node-tradfri-client")

const {ensureCredentials} = require("./auth.js")

async function initTradfri() {
  const discovered = await discoverGateway()
  const ipAddress = discovered.addresses[0]
  const tradfri = new TradfriClient(ipAddress, {
    customLogger,
    watchConnection: true,
  })
  const credentials = await ensureCredentials(tradfri)
  await tradfri.connect(credentials.identity, credentials.psk)
  await tradfri.observeDevices()
  return tradfri
}

function customLogger(message, severity) {
  switch (severity) {
    case "silly":
      break;
    case "debug":
    case "info":
    case "warn":
    case "error":
    default:
      console.log(`${severity} - ${message}`)
      break;
  }
}

module.exports = {initTradfri}
