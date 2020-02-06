/**
 * @type {string}
 */
const baseURL = process.env.VUE_APP_REPORT_BASE_URL

/**
 * @param {Function} h
 * @returns {*}
 */
export const reportContext = (h) => {
  const domProps = {
    type: 'hidden',
    name: '__@context',
    value: undefined
  }
  return h('input', { domProps })
}

// noinspection JSUnusedLocalSymbols
/**
 * @return {string}
 */
export const reportLoading = (report) => {
  // return `${baseURL}/report/loading`
  return `${baseURL}/loading.html`
}

/**
 * @param {string} report
 * @param {string} token
 * @param {boolean} printing
 * @return {string}
 */
export const reportAction = (report, token, printing) => {
  return `${baseURL}/process.html?report=${report}?c=${token}&p=${printing}`
}

// noinspection JSUnusedLocalSymbols
/**
 * @return {string}
 */
export const reportMethod = (report, token, printing) => {
  return 'get'
}
