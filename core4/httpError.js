import Vue from "vue";

function i18n(code, name = "default") {
  const defaultError = Vue.prototype.i18n.t("errors.default");

  try {
    const translate = Vue.prototype.i18n.t(`errors.${code}.${name}`);
    return translate.includes("undefined") ? defaultError : translate;
  } catch (e) {
    return defaultError;
  }
}

function payload(err, actions, html, isClosableDialog = true) {
  let payload = {
    error: err,
    actions: actions,
    close: isClosableDialog,
  };

  if (err.json != null) {
    payload.json = err.json;
  } else {
    payload.html = html || `${i18n()}`;
  }

  return payload;
}

const actions = {
  "502"() {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t("reloadPage"),
        action() {
          Vue.prototype.$store.dispatch("reloadCurrentPage");
        },
      },
      {
        main: true,
        name: Vue.prototype.i18n.t("toTheMainPage"),
        action() {
          Vue.prototype.$store.dispatch("gotoMainPage");
        },
      },
    ];
  },
  "400"() {
    return [];
  },
  "403"() {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t("contact"),
        action() {
          window.location.href = `mailto:${Vue.prototype.$store.getters.contact}`;
        },
      },
      {
        main: true,
        name: Vue.prototype.i18n.t("toTheMainPage"),
        action() {
          Vue.prototype.$store.dispatch("gotoMainPage");
        },
      },
    ];
  },
  "404"() {
    return [
      {
        main: true,
        name: Vue.prototype.i18n.t("toTheMainPage"),
        action() {
          Vue.prototype.$store.dispatch("gotoMainPage");
        },
      },
    ];
  },
  "409"() {
    return [
      {
        main: true,
        name: Vue.prototype.i18n.t("reloadPage"),
        action() {
          Vue.prototype.$store.dispatch("reloadCurrentPage");
        },
      },
      {
        main: false,
        name: Vue.prototype.i18n.t("toTheMainPage"),
        action() {
          Vue.prototype.$store.dispatch("gotoMainPage");
        },
      },
    ];
  },
  noInternet() {
    const action = {
      main: true,
      name: Vue.prototype.i18n.t("checkConnectivity"),
      timer: 0,
      action() {
        if (action.timer) clearTimeout(action.timer);

        Vue.prototype.$store.dispatch("setLoading", true);

        action.timer = setTimeout(() => {
          if (navigator.onLine) {
            Vue.prototype.$store.dispatch("hideError");
          }

          Vue.prototype.$store.dispatch("setLoading", false);
        }, 2000);
      },
    };
    return [action];
  },
  default() {
    return [
      {
        main: false,
        name: Vue.prototype.i18n.t("contact"),
        action() {
          window.location.href = `mailto:${Vue.prototype.$store.getters.contact}`;
        },
      },
      {
        main: true,
        name: Vue.prototype.i18n.t("toTheMainPage"),
        action() {
          Vue.prototype.$store.dispatch("gotoMainPage");
        },
      },
    ];
  },
};

export default {
  show(err, vm, info) {
    // err: error trace
    // vm: component in which error occurred
    // info: Vue specific error information such as lifecycle hooks, events etc.

    // ToDo: find a solution for differentiating regular errors from our errors
    // Somehow axios error equals to InternalError. In this case "instanceof" check can't be used
    // if (err instanceof EvalError) {console.log(err)}
    // if (err instanceof RangeError) {console.log(err)}
    // if (err instanceof ReferenceError) {console.log(err)}
    // if (err instanceof SyntaxError) {console.log(err)}
    // if (err instanceof TypeError) {console.log(err)}
    // if (err instanceof URIError) {console.log(err)}
    // if (err instanceof InternalError ) {console.log(err)}

    // All of axios error can be differentiate by isAxiosError build in prop
    if (err.isAxiosError) {
      if (Vue.prototype.$store.getters.loading) {
        Vue.prototype.$store.dispatch("setLoading", false);
      }

      if (err.response) {
        const errorCode = err.response.status.toString();

        switch (errorCode) {
          case "503":
          // error will be handled by 502 case, because missed "break" instruction
          case "502":
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions[errorCode](), `${i18n(errorCode)}`)
            );
            break;
          case "400":
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions[errorCode](), `${i18n(errorCode)}`)
            );
            break;
          case "401":
            Vue.prototype.$store.dispatch("gotoLogin");
            break;
          case "403":
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions[errorCode](), `${i18n(errorCode)}`)
            );
            break;
          case "404":
            //Vue.prototype.$store.dispatch("gotoNotFoundPage");
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions[errorCode](), `${i18n(errorCode)}`)
            );
            break;
          case "409":
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions[errorCode](), `${i18n(errorCode)}`)
            );
            break;
          default:
            // cases: 4xx, 5xx, 500, 405, 406
            // mail = `<a href="mailto:${Vue.prototype.$store.getters.contact}">${Vue.prototype.$store.getters.contact}</a>`
            Vue.prototype.$store.dispatch(
              "showError",
              payload(err, actions["default"](), `${i18n()}`)
            );
        }
      } else {
        if (!navigator.onLine) {
          // no internet connection
          Vue.prototype.$store.dispatch(
            "showError",
            payload(
              err,
              actions["noInternet"](),
              `${i18n("networkError", "noInternet")}`
            )
          );
        } else {
          // all of possible not xhr errors
          Vue.prototype.$store.dispatch(
            "showError",
            payload(err, actions["default"](), `${i18n("networkError")}`)
          );
        }
      }
    } else {
      //console.info(`Core4ui error handling system: new error type - ${err}`)
      console.error(err)
    }
  }
};
