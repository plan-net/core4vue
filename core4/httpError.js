import Vue from 'vue'

function i18n (code, name='default') {
  const defaultError = Vue.prototype.i18n.t('errors.default')

  try {
    const translate = Vue.prototype.i18n.t(`errors.${code}.${name}`)
    return translate.includes('undefined') ? defaultError : translate
  } catch (e) {
    return defaultError
  }
}

function payload (err, actions, isClosableDialog=false, html=`${i18n()}`) {
  let payload = {
    error: err,
    actions: actions,
    close: isClosableDialog
  }

  if (err.json != null) {
    payload.json = err.json
  } else {
    payload.html = html
  }

  return payload
}

const actions = {
  '502' () {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t('reloadPage'),
        action () {
          Vue.prototype.$store.dispatch('reloadCurrentPage')
        }
      },
      {
        main: true,
        name: Vue.prototype.i18n.t('toTheMainPage'),
        action () {
          Vue.prototype.$store.dispatch('gotoMainPage')
        }
      }
    ]
  },
  '400' () {
    return []
  },
  '403' () {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t('contact'),
        action () {
          window.location.href = `mailto:${Vue.prototype.$store.getters.contact}`
        }
      },
      {
        main: true,
        name: Vue.prototype.i18n.t('toTheMainPage'),
        action () {
          Vue.prototype.$store.dispatch('gotoMainPage')
        }
      }
    ]
  },
  '409' () {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t('reloadPage'),
        action () {
          Vue.prototype.$store.dispatch('reloadCurrentPage')
        }
      },
      {
        main: true,
        name: Vue.prototype.i18n.t('toTheMainPage'),
        action () {
          Vue.prototype.$store.dispatch('gotoMainPage')
        }
      }
    ]
  },
  'noInternet' () {
    return [
      {
        main: true,
        name: Vue.prototype.i18n.t('checkConnectivity'),
        action () {
          Vue.prototype.$store.dispatch('setLoading', true)

          setTimeout(() => {
            if (navigator.onLine) {
              Vue.prototype.$store.dispatch('hideError')
            }

            Vue.prototype.$store.dispatch('setLoading', false)
          }, 2000)
        }
      }
    ]
  },
  'default' () {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t('contact'),
        action () {
          window.location.href = `mailto:${Vue.prototype.$store.getters.contact}`
        }
      },
      {
        main: true,
        name: Vue.prototype.i18n.t('toTheMainPage'),
        action () {
          Vue.prototype.$store.dispatch('gotoMainPage')
        }
      }
    ]
  }
}

export default {
  show (err, vm, info) {
    // err: error trace
    // vm: component in which error occurred
    // info: Vue specific error information such as lifecycle hooks, events etc.

    if (err.isAxiosError) {
      if (Vue.prototype.$store.getters.loading) {
        Vue.prototype.$store.dispatch('setLoading', false)
      }

      let status = err.response ? err.response.status.toString() : false

      if (status) {
        switch (status){
          case "503":
          // error will be handled by 502 case, because missed "break" instruction
          case "502":
            Vue.prototype.$store.dispatch('showError', payload(err, actions[status], false, `${i18n(status)}`))
            break
          case "400":
            Vue.prototype.$store.dispatch('showError', payload(err, actions[status], true, `${i18n(status)}`))
            break
          case "401":
            Vue.prototype.$store.dispatch('gotoLogin')
            break
          case "403":
            Vue.prototype.$store.dispatch('showError', payload(err, actions[status], true, `${i18n(status)}`))
            break
          case "404":
            Vue.prototype.$store.dispatch('gotoNotFoundPage')
            break
          case "409":
            Vue.prototype.$store.dispatch('showError', payload(err, actions[status], false, `${i18n(status)}`))
            break
          default:
            // cases: 4xx, 5xx, 500, 405, 406
            // mail = `<a href="mailto:${Vue.prototype.$store.getters.contact}">${Vue.prototype.$store.getters.contact}</a>`
            Vue.prototype.$store.dispatch('showError', payload(err, actions['default']))
        }
      } else {
        if (!navigator.onLine) {
          // no internet connection
          Vue.prototype.$store.dispatch('showError', payload(err, actions['noInternet'], false, `${i18n('networkError', 'noInternet')}`))
        } else {
          // all of possible not xhr errors
          Vue.prototype.$store.dispatch('showError', payload(err, actions['default'], true, `${i18n('networkError')}`))
        }
      }
    }
  }
}
