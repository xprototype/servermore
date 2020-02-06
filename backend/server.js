'use strict'

import app from './app.js'
import routes from './routes/index.js'

// Run the server!
const start = async () => {
  try {
    const options = { port: process.env.SERVER_PORT, host: '0.0.0.0' }
    await app.listen(options)
    app.log.info(`🚀 server listening on ${app.server.address().port}`)
  }
  catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

routes(app)
start()
