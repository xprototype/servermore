// domains/Admin
import action from 'src/domains/Admin/Action/pt-br'
import profile from 'src/domains/Admin/Profile/pt-br'
import user from 'src/domains/Admin/User/pt-br'
// domains/Help
import home from 'src/domains/Home/pt-br'
// domains/Report
import report from 'src/domains/Report/pt-br'

/**
 */
export default {
  home,
  admin: {
    action, profile, user
  },
  report
}
