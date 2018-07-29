const express = require("express")
const bodyParser = require("body-parser")
const Bacon = require("baconjs")

function startDriver(port) {
  const app = express()
  app.use(bodyParser.json())

  const setCommandStream = Bacon.fromBinder(sink => {
    app.post("/tradfri/:instanceId", async (req, res) => {
      if (req.body.command === "set") {
        sink({
          instanceId: req.params.instanceId,
          state: req.body.state,
        })
      }
      res.sendStatus(200)
    })
  })

  app.listen(port, () => console.log(`Driver listening on port ${port}`))

  return setCommandStream
}

module.exports = {startDriver}
