import Repository from '../../../Infrastructure/Repository.js'

/**
 * @class {ProfileRepository}
 */
export default class ProfileRepository extends Repository {
  /**
   * @type {string}
   */
  static collection = 'profiles'
}
