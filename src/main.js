// Polyfill for requestIdleCallback / cancelIdleCallback (WebKitGTK compatibility for Tauri)
if (typeof window !== "undefined" && !window.requestIdleCallback) {
  window.requestIdleCallback = function (cb) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };
  window.cancelIdleCallback = function (id) {
    clearTimeout(id);
  };
}

import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"


import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"
import App from "./App.vue"
import VueClipboard from "vue-clipboard2"
import VueMeta from "vue-meta"
import VueSocialSharing from "vue-social-sharing"
import Vue from "vue"

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueClipboard)
Vue.use(VueMeta)
Vue.use(VueSocialSharing)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount("#app")
