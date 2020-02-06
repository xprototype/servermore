import Rest from 'src/app/Services/Rest'
import { resource } from '../settings'

/**
 * @type {UserService}
 */
export default class UserService extends Rest {
  /**
   * @type {String}
   */
  resource = resource
}
