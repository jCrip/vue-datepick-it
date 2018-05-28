import './polyfills'
import Datepicker from './components/AirbnbStyleDatepicker.vue'
import Monthpicker from './components/AirbnbStyleMonthpicker.vue'
import Yearpicker from './components/AirbnbStyleYearpicker.vue'
import ClickOutside from './directives/ClickOutside'

const AirbnbStyleDatepicker = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Datepicker.name, {
      ...options,
      ...Datepicker
    })
  }
}

const AirbnbStyleMonthpicker = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Monthpicker.name, {
      ...options,
      ...Monthpicker
    })
  }
}
const AirbnbStyleYearpicker = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Yearpicker.name, {
      ...options,
      ...Yearpicker
    })
  }
}
// User has to install the component by themselves, to allow to pass options
if (typeof window !== 'undefined' && window.Vue) {
  window.AirbnbStyleDatepicker = AirbnbStyleDatepicker
  window.AirbnbStyleMonthpicker = AirbnbStyleMonthpicker
  window.AirbnbStyleYearpicker = AirbnbStyleYearpicker
}

export { AirbnbStyleDatepicker, AirbnbStyleMonthpicker, AirbnbStyleYearpicker }
