import database from 'arangojs'

/**
 * @class {QueryBuilder}
 */
export default class QueryBuilder {
  /**
   * @return {QueryBuilder}
   */
  static build () {
    return new this()
  }

  /**
   * @return {Database}
   */
  connect () {
    if (!this.connection) {
      const dbConfig = {
        url: process.env.ARANGO_URL,
        database: process.env.ARANGO_DATABASE,
        username: process.env.ARANGO_USERNAME,
        password: process.env.ARANGO_PASSWORD
      }
      this.connection = new database.Database({
        url: dbConfig.url
      })
      this.connection.useDatabase(dbConfig.database)
      this.connection.useBasicAuth(dbConfig.username, dbConfig.password)
    }

    return this.connection
  }

  /**
   * @param {string} collection
   * @param {Array} filters
   * @return {number}
   */
  async count (collection, filters = []) {
    const query = `
      FOR document IN ${collection}
      FILTER document.deletedAt == null
      COLLECT WITH COUNT INTO length
      RETURN length
    `
    const statement = await this.connection.query(query)
    if (!statement) {
      return 0
    }
    if (!statement._result) {
      return 0
    }
    return Number(statement._result.pop())
  }

  /**
   * @param {string} collection
   * @param {Record} parameters
   * @return {number}
   */
  async paginate (collection, parameters = {}) {
    const queryRecords = `
      FOR document IN ${this.constructor.collection}
      FILTER document.deletedAt == null
      LIMIT @offset, @limit
      RETURN document
    `
    const { offset, limit } = parameters

    const statement = await this.connection.query(queryRecords, { offset, limit })
    if (!statement) {
      return []
    }
    if (!statement._result) {
      return []
    }
    return statement._result
  }
}