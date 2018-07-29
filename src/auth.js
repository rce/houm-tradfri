const Promise = require("bluebird")
const path = require("path")
const fs = Promise.promisifyAll(require("fs"))

const TRADFRI_QR_CODE = process.env.TRADFRI_QR_CODE
if (!TRADFRI_QR_CODE) throw Error("TRADFRI_QR_CODE is required")

const PSK = TRADFRI_QR_CODE.split(",")[1]

async function ensureCredentials(tradfri) {
  const authFile = path.resolve(__dirname, "../auth.json")

  try {
    console.log("Trying to read existing credentials")
    const json = JSON.parse(await fs.readFileAsync(authFile))
    console.log("Reading existing credentials succeeded")
    return json
  } catch (e) {
    console.log("Failed to read existing credentials")
    console.log("Authenticating with QR code")
    const credentials = await tradfri.authenticate(PSK)
    console.log("Storing client credentials")
    await fs.writeFileAsync(authFile, JSON.stringify(credentials))
    return credentials
  }
}

module.exports = {ensureCredentials}
