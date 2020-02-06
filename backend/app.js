import dotEnv from 'dotenv'
import Ajv from 'ajv'
import fastify from 'fastify'
import timeout from 'fastify-server-timeout'
import cors from 'fastify-cors'

import error from './error.js'

// create app
const app = fastify({ logger: true })

dotEnv.config()

// noinspection NpmUsedModulesInstalled (ajv is a fastify dependency)
const ajv = new Ajv({
  // the fastify defaults (if needed)
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allErrors: true,
  nullable: true
})
// noinspection JSCheckFunctionSignatures
app.setSchemaCompiler(function (schema) {
  return ajv.compile(schema)
})

app.register(timeout, { serverTimeout: 1000 * 60 * 20 })

app.register(cors, {
  allowedHeaders: ['Device', 'Content-Type', 'Authorization', 'Bearer'],
  exposedHeaders: []
})

// print routes
app.ready(() => console.log(app.printRoutes()))

// set error handler
app.setErrorHandler(error)

app.resources = function (path, controller) {
  this.post(path, async (request, reply) => {
    return controller.build().applyStore(request, reply)
  })
  this.get(`${path}/:id`, async (request, reply) => {
    return controller.build().applyRecover(request, reply)
  })
  this.patch(`${path}/:id`, async (request, reply) => {
    return controller.build().applyChange(request, reply)
  })
  this.delete(`${path}/:id`, async (request, reply) => {
    return controller.build().applyRemove(request, reply)
  })
  this.get(path, async (request, reply) => {
    return controller.build().applySearch(request, reply)
  })
  this.patch(`${path}/:id/restore`, async (request, reply) => {
    return controller.build().applyRestore(request, reply)
  })
  return this
}

export default app
