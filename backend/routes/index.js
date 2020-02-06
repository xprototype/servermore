import ProfileResource from '../src/Application/Action/Admin/ProfileResource.js'
import UserResource from '../src/Application/Action/Admin/UserResource.js'

/**
 * @param router
 */
export default function (router) {
  router.get('/', async (request, reply) => {
    return { hello: 'world' }
  })

  router.resources('/api/v1/admin/users', UserResource)
  router.resources('/api/v1/admin/profiles', ProfileResource)
}