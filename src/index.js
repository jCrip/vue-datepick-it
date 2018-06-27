import './polyfills'
import Datepicker from './components/DatepickIt.vue'
import Monthpicker from './components/MonthpickIt.vue'
import Yearpicker from './components/YearpickIt.vue'
import ClickOutside from './directives/ClickOutside'

const DatepickIt = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Datepicker.name, {
      ...options,
      ...Datepicker
    })
  }
}

const MonthpickIt = {
  install(Vue, options) {
    Vue.directive('click-outside', ClickOutside)

    Vue.component(Monthpicker.name, {
      ...options,
      ...Monthpicker
    })
  }
}
const YearpickIt = {
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
  window.DatepickIt = DatepickIt
  window.MonthpickIt = MonthpickIt
  window.YearpickIt = YearpickIt
}

export { DatepickIt, MonthpickIt, YearpickIt }
