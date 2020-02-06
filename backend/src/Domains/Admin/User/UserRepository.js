import Repository from '../../../Infrastructure/Repository.js'

/**
 * @class {UserRepository}
 */
export default class UserRepository extends Repository {
  /**
   * @type {string}
   */
  static collection = 'users'
}
