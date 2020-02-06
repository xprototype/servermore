import { unSerialize, serialize } from 'src/app/Util/general'

/** @type {string} */
export const primaryKey = 'uuid'

/** @type {string} */
export const displayKey = 'name'

/** @type {string} */
export const filterKey = 'filter'

/** @type {string} */
export const searchKey = 'where'

/** @type {string} */
export const SEPARATION_OPERATOR = '~'

/**
 * @param {Object} value
 * @return {string}
 */
export const serializeSearch = (value) => {
  return serialize(value, searchKey)
}

/**
 * @param {string} value
 * @return {Object}
 */
export const unSerializeSearch = (value) => {
  return unSerialize(value, searchKey)
}

/**
 * @param {string} validation
 * @return {boolean}
 */
export const required = (validation) => ['required'].includes(validation)

/** @type {Object} */
export const counter = {
  name: 'counter',
  label: '*',
  sortable: false,
  required: true,
  align: 'left',
  style: 'width: 50px',
  generate: (page, rowsPerPage, index) => {
    return ((page - 1) * (rowsPerPage)) + (index + 1)
  }
}

/**
 * @type {string[]}
 */
export const inheritEvents = ['filter', 'allow-new']

/**
 * @param h
 * @param field
 * @param input
 * @param value
 * @param ref
 * @param tabIndex
 * @returns {*}
 */
export const renderField = (h, field, input, value, ref, tabIndex) => {
  const classNames = [`$key-${field.$key}`]
  if (field.classNames) {
    classNames.push(field.classNames)
  }
  if (field.attrs.uppercase) {
    classNames.push('uppercase')
  }
  if (field.attrs.borderLess) {
    classNames.push('border-less')
  }

  if (field.attrs.useReadonly && field.attrs.disable) {
    // console.log('~> field', JSON.stringify([field.is, field.attrs.useReadonly, field.attrs.disable]))
    delete field.attrs.disable
    field.attrs.readonly = true
  }

  return h(field.is, {
    ref: ref,
    refInFor: true,
    class: classNames,
    domProps: { tabIndex: tabIndex, value: value },
    props: { value: value },
    attrs: { ...field.attrs },
    on: { ...field.listeners, input: input }
  })
}
