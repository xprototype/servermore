/**
 * @class {ActionResource}
 */
export default class ActionResource {
  /**
   * @type {Repository}
   */
  repository = undefined

  /**
   * @return {ActionResource}
   */
  static build () {
    return new this()
  }

  /**
   * @param request
   * @param reply
   */
  applyStore (request, reply) {
    const record = request.body
    return this.repository.build().create(record)
      .then((meta) => reply.send({ ...meta, ...record }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  applyRecover (request, reply) {
    const { id } = request.params
    return this.repository.build().read(id)
      .then((record) => reply.send({ data: record }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  async applyChange (request, reply) {
    const repository = this.repository.build()
    const { id } = request.params
    const current = await repository.read(id)

    const body = request.body
    const record = { ...current, ...body }
    return repository.update(record)
      .then((meta) => reply.send({ ...meta, ...record }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  async applyRemove (request, reply) {
    const repository = this.repository.build()
    const { id } = request.params
    console.log('~> id', id)
    const record = await repository.read(id)
    return repository.destroy(record)
      .then((meta) => reply.send({ ...meta, ...record }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  applySearch (request, reply) {
    const repository = this.repository.build()
    return repository.search()
      .then((payload) => reply.send({ total: payload.total, data: payload.rows }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  async applyRestore (request, reply) {
    const repository = this.repository.build()
    const { id } = request.params
    const record = await repository.read(id, true)
    return repository.restore(record)
      .then((meta) => reply.send({ ...meta, ...record }))
      .catch((error) => reply.send(error))
  }

  /**
   * @param request
   * @param reply
   */
  async applyErase (request, reply) {
    const repository = this.repository.build()
    const { id } = request.params
    const record = await repository.read(id)
    return repository.erase(record)
      .then((meta) => reply.send({ ...meta, ...record }))
      .catch((error) => reply.send(error))
  }
}