import ProfileRepository from '../../../Domains/Admin/Profile/ProfileRepository.js'
import ActionResource from '../ActionResource.js'

/**
 * @class {ProfileResource}
 */
export default class ProfileResource extends ActionResource {
  /**
   * @type {ProfileRepository}
   */
  repository = ProfileRepository
}
