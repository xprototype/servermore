import { get, is, serialize, unSerialize, withoutSeparator } from 'src/app/Util/general'
import { replacement } from 'src/app/Util/string'
import { $store } from 'src/store'

import Http from './Http'

import { filterKey, primaryKey, searchKey } from 'src/settings/schema'
import { parseRestRecords, parseRestRecord } from 'src/settings/rest'

/**
 * @class {Rest}
 */
export default class Rest extends Http {
  /**
   * @type {string}
   */
  path = '/api/v1'

  /**
   * @type {string}
   */
  resource = '/please/override/resource'

  /**
   * @type {String}
   */
  primaryKey = primaryKey

  /**
   * @type {number}
   */
  size = 10

  /**
   * @type {Object}
   */
  __resourceParams = {}

  /**
   * @type {Object}
   */
  $store = {}

  /**
   * @type {Array}
   */
  filterable = []

  /**
   * @param {Record<string, any>} record
   * @param {Record<string, any>} config
   * @returns {Promise}
   */
  create (record, config = {}) {
    if ($store.getters['app/getOffline'] || this.offline) {
      return new Promise((resolve, reject) => {
        reject('Unsupported action create')
      })
    }
    return this.post(this.getResource(), record, config)
  }

  /**
   * @param {string | number | Record<string, any>} record
   * @param {boolean} trash
   * @param {Record<string, any>} config
   * @returns {Promise}
   */
  read (record, trash = false, config = {}) {
    let queryString = ''
    if (trash) {
      queryString = '?trash=true'
    }

    if ($store.getters['app/getOffline'] || this.offline) {
      return this.readOffline(record, trash)
    }
    const url = `${this.getResource()}/${this.getId(record)}${queryString}`
    return this.get(url, config).then(parseRestRecord())
  }

  /**
   * @param {Record<string, any>} record
   * @param {Record<string, any>} config
   * @returns {Promise}
   */
  update (record, config = {}) {
    if ($store.getters['app/getOffline'] || this.offline) {
      return this.updateOffline(record)
    }
    const url = `${this.getResource()}/${this.getId(record)}`
    return this.patch(url, record, config)
  }

  /**
   * @param {Record<string, any>} record
   * @param {Record<string, any>} config
   * @returns {Promise<any>}
   */
  destroy (record, config = {}) {
    if ($store.getters['app/getOffline'] || this.offline) {
      return new Promise((resolve, reject) => {
        reject('Unsupported action create')
      })
    }
    const url = `${this.getResource()}/${this.getId(record)}`
    return this.delete(url, config)
  }

  /**
   * @param {Record<string, any>} record
   * @param {Record<string, any>} config
   * @returns {Promise}
   */
  restore (record, config = {}) {
    const url = `${this.getResource()}/${this.getId(record)}/restore`
    return this.patch(url, record, config)
  }

  /**
   * @param {Record<string, string | number>} parameters
   * @param {Array<string>} [filters] = []
   * @param {boolean} [trash] = false
   * @returns {Promise}
   */
  paginate (parameters, filters, trash = false) {
    const { pagination, [filterKey]: filter, [searchKey]: where, raw } = parameters

    const size = get(pagination, 'rowsPerPage', this.size)
    const sortBy = get(pagination, 'sortBy')
    const descending = get(pagination, 'descending')
    const page = get(pagination, 'page', 1)

    let sort
    if (sortBy) {
      const direction = descending ? 'desc' : 'asc'
      sort = `${sortBy}.${direction}`
    }

    if ($store.getters['app/getOffline'] || this.offline) {
      return this.searchOffline({ page, size, sort, filter, where, raw, trash })
    }

    return this
      .search({ page, size, sort, filter, where, raw, trash })
      .then(parseRestRecords({ rowsPerPage: size, sortBy, descending, page }))
  }

  /**
   * Ex.: query({ page, size, sort, filter, where })
   * @param {Object} parameters
   * @param {Object} config
   * @returns {Promise}
   */
  search (parameters = {}, config = {}) {
    const queryString = this.searchQueryString(parameters, '&')
    return this.get(`${this.getResource()}?${queryString}`, config)
  }

  /**
   * @param {Object} parameters
   * @param {string} separator
   * @returns {string}
   */
  searchQueryString (parameters = {}, separator) {
    const elements = []
    const { raw, page, size, sort, filter, where, trash } = parameters
    if (is(page)) {
      elements.push(`page=${page}`)
    }
    if (is(size)) {
      elements.push(`size=${size}`)
    }
    if (is(sort)) {
      elements.push(`sort=${sort}`)
    }
    if (is(trash)) {
      elements.push('trash=true')
    }
    if (is(filter)) {
      elements.push(`${filterKey}=${filter}`)
    }
    if (is(raw)) {
      elements.push(typeof raw === 'string' ? raw : serialize(raw))
    }
    if (is(where)) {
      elements.push(typeof where === 'string' ? where : serialize(where, searchKey))
    }
    return elements.join(separator)
  }

  /**
   * @param {Array} records
   * @returns {Promise}
   */
  remove (records) {
    const callback = (record) => this.getId(record)
    const remove = records.map(callback).join(',')
    if (records.length === 1) {
      return this.delete(`${this.getResource()}/${remove}`)
    }
    return this.delete(`${this.getResource()}/[${remove}]`)
  }

  /**
   * @param {Record<string, any>} resourceParams
   * @param {boolean} override
   * @returns {this}
   */
  resourceParams (resourceParams, override = true) {
    if (!override && is(this.__resourceParams)) {
      return this
    }
    this.__resourceParams = resourceParams
    return this
  }

  /**
   * @returns {string}
   */
  getResource () {
    if (is(this.__resourceParams)) {
      return replacement(this.resource, this.__resourceParams)
    }
    return this.resource
  }

  /**
   * @param {string | number | Record<string, any>} record
   * @returns {String}
   */
  getId (record) {
    if (typeof record === 'object') {
      return record[this.primaryKey]
    }
    return String(record)
  }

  /**
   * @param {string | number | Record<string, any>} record
   * @param {boolean} trash
   * @returns {Promise}
   */
  readOffline (record, trash = false) {
    const executor = (resolve) => {
      const read = () => {
        const id = this.getId(record)
        const data = this.getOfflineRecord(id)
        const response = { data }
        resolve(response)
      }
      window.setTimeout(read, 100)
    }
    return new Promise(executor)
  }

  /**
   * @param {Record<string, any>} record
   * @returns {Promise}
   */
  updateOffline (record) {
    const executor = (resolve, reject) => {
      const update = () => {
        const id = this.getId(record)
        const data = this.getOfflineRecord(id)
        if (!data) {
          reject({ type: 'notFound' })
          return
        }
        record = { ...data, ...record }
        const response = this.setOfflineRecord(id, record)
        resolve(response)
      }
      window.setTimeout(update, 100)
    }
    return new Promise(executor)
  }

  /**
   * @param {Object} parameters
   * @returns {Promise}
   */
  searchOffline (parameters) {
    const executor = (resolve) => {
      const search = () => {
        // sort, raw, trash
        const { page, size: rowsPerPage, where, filter } = parameters

        const records = this.getOfflineRecords().filter((record) => {
          if (is(where)) {
            return this.searchOfflineWhere(record, where)
          }
          if (is(filter)) {
            return this.searchOfflineFilter(record, filter)
          }
          return true
        })

        const rowsNumber = records.length
        const pagesNumber = Math.ceil(rowsNumber / rowsPerPage)
        const offset = (page - 1) * rowsPerPage
        const rows = records.slice(offset, offset + rowsPerPage)

        resolve({ rows, rowsPerPage, rowsNumber, pagesNumber, page })
      }
      window.setTimeout(search, 100)
    }
    return new Promise(executor)
  }

  /**
   * @param {Record<string, any>} record
   * @param {string} where
   * @returns {boolean}
   */
  searchOfflineWhere (record, where) {
    const unSerialized = unSerialize(where, searchKey)
    for (let key in unSerialized) {
      if (!unSerialized.hasOwnProperty(key)) {
        continue
      }
      let value = withoutSeparator(unSerialized[key])
      if (String(record[key]).toLowerCase().indexOf(String(value).toLowerCase()) === -1) {
        return false
      }
    }
    return true
  }

  /**
   * @param {Record<string, any>} record
   * @param {string} filter
   * @returns {boolean}
   */
  searchOfflineFilter (record, filter) {
    for (let field in record) {
      if (!record.hasOwnProperty(field)) {
        continue
      }
      if (!this.filterable.includes(field)) {
        continue
      }
      if (String(record[field]).toLowerCase().indexOf(String(filter).toLowerCase()) !== -1) {
        return true
      }
    }
    return false
  }

  /**
   * @returns {Array}
   * @private
   */
  getOfflineRecords () {
    if (!this.$store) {
      return []
    }
    if (!Array.isArray(this.$store.state.records)) {
      return []
    }
    return this.$store.state.records
  }

  /**
   * @param id
   * @returns {Object}
   * @private
   */
  getOfflineRecord (id) {
    const records = this.getOfflineRecords()
    return records.find((record) => record[this.primaryKey] === id)
  }

  /**
   * @param {string} id
   * @param {Object} record
   * @returns {Object}
   * @private
   */
  setOfflineRecord (id, record) {
    if (!this.$store) {
      return undefined
    }
    this.$store.commit('updateRecord', record)
    return { data: { ticket: id } }
  }
}
