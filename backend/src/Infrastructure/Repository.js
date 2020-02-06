import uuid from 'uuid/v1.js'
import QueryBuilder from './QueryBuilder.js'

/**
 * @class Repository
 */
export default class Repository extends QueryBuilder {
  /**
   * @type {string}
   */
  static collection = undefined

  /**
   */
  constructor () {
    super()
    this.manager = this.connect().collection(this.constructor.collection)
  }

  /**
   * Save a new User with title and description as required fields
   *
   * @param {Record} record
   * @return {Promise<any> | void}
   */
  create (record) {
    if (!record.uuid) {
      record.uuid = uuid()
    }
    record._key = record.uuid
    const now = new Date()
    record.createdAt = now
    record.updateAt = now
    record.deletedAt = null
    return this.manager.save(record)
  }

  /**
   * Find an User by its key
   *
   * @param {string} uuid
   * @param {boolean} trash
   * @return {Promise<any>}
   */
  read (uuid, trash = false) {
    const example = { _key: uuid }
    if (!trash) {
      example.deletedAt = null
    }
    return this.manager.firstExample(example)
  }

  /**
   * Update an existing User, the incoming object should have the _key field
   *
   * @param {Record} record
   * @return {*}
   */
  update (record) {
    const now = new Date()
    record.updateAt = now
    return this.manager.update(record._key, record)
  }

  /**
   * Remove an existing User by its _key
   *
   * @param {Record} record
   * @param {Object} options
   * @return {Promise<any>}
   */
  destroy (record, options = {}) {
    const now = new Date()
    record.deletedAt = now
    return this.manager.update(record._key, record)
  }

  /**
   * Remove an existing User by its _key
   *
   * @param {Record} record
   * @param {Object} options
   * @return {Promise<any>}
   */
  restore (record, options = {}) {
    record.deletedAt = null
    return this.manager.update(record._key, record)
  }

  /**
   * Remove an existing User by its _key
   *
   * @param {Object} record
   * @param {Object} options
   * @return {Promise<any>}
   */
  erase (record, options = {}) {
    return this.manager.removeByKeys([record._key], options)
  }

  /**
   * Find all Users saved so fare
   *
   * @return {*}
   */
  async search (options = {}) {
    const { filters } = options
    const parameters = {
      offset: options.offset ? options.offset : 0,
      limit: options.limit ? options.limit : 10,
      filters: filters ? filters : []
    }

    const total = await this.count(this.constructor.collection, parameters.filters)
    const rows = await this.paginate(this.constructor.collection, parameters)

    return { total, rows  }
  }
}