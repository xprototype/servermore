import UserRepository from '../../../Domains/Admin/User/UserRepository.js'
import ActionResource from '../ActionResource.js'

/**
 * @class {UserResource}
 */
export default class UserResource extends ActionResource {
  /**
   * @type {UserRepository}
   */
  repository = UserRepository
}
