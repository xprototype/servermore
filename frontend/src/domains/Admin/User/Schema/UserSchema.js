import Schema from 'src/app/Agnostic/Schema'

import Service from 'src/domains/Admin/User/Schema/UserService'
import { domain, path } from 'src/domains/Admin/User/settings'

import { SCOPES } from 'src/app/Agnostic/enum'
import ProfileSchema from 'src/domains/Admin/Profile/Schema/ProfileSchema'

/**
 * @class {UserSchema}
 */
export default class UserSchema extends Schema {
  /**
   * @type {string}
   */
  static domain = domain

  /**
   * @type {string}
   */
  static path = path

  /**
   * @type {Http}
   */
  service = Service

  /**
   */
  construct () {
    this.addField('name')
      .fieldTableShow()
      .fieldTableWhere()
      .fieldFormAutofocus()
      .fieldFormWidth(60)
      .validationRequired()

    this.addField('photo')
      .fieldIsImage()
      .fieldFormWidth(40)
      .fieldFormHeight(4)

    this.addField('email')
      .fieldTableShow()
      .fieldTableWhere()
      .fieldIsEmail()
      .fieldFormWidth(60)
      .validationRequired()
      .validationEmail()

    this.addField('profile')
      .fieldTableShow()
      .fieldTableWhere()
      .fieldIsSelectRemote(ProfileSchema.build().provideRemote())
      .fieldFormWidth(60)
      .validationRequired()

    this.addField('password')
      .fieldFormWidth(30)
      .fieldIsPassword()
      .validationPassword()
      .validationRequiredWhen(function () {
        return this.scope === SCOPES.SCOPE_ADD
      })

    this.addField('confirmPassword')
      .fieldFormWidth(30)
      .fieldIsPassword()
      .validationSameAs(['password'])

    this.addField('phone')
      .fieldAsPhone()
      .fieldFormWidth(30)

    this.addField('integration')
      .fieldTableWhere()
      .fieldFormWidth(100)
      .fieldFormDisabled()
      .fieldConfigure(function (field) {
        if (this.scope === SCOPES.SCOPE_ADD) {
          field.$layout.formHidden = true
        }
        return field
      })

    this.addField('active')
      .fieldTableShow()
      .fieldTableWhere()
      .fieldIsToggle({ label: this.$lang(`domains.${this.constructor.domain}.fields.active.inline`) })
      .fieldConfigure(function (field) {
        if (this.scope === SCOPES.SCOPE_ADD) {
          field.$layout.formHidden = true
        }
        return field
      })
      .fieldFormDefaultValue(true)
  }
}
