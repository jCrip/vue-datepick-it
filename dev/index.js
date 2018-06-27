import Vue from 'vue'
import App from './App.vue'
import { DatepickIt, MonthpickIt, YearpickIt } from './../src/index'

Vue.use(DatepickIt, {
  sundayFirst: false,
  days: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
  daysShort: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  colors: {
    selected: '#00a699',
    inRange: '#66e2da',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#33dacd',
    disabled: '#fff'
  },
  texts: {
    apply: 'Aceptar',
    cancel: 'Cancelar'
  }
})

Vue.use(MonthpickIt, {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
})
Vue.use(YearpickIt)
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App)
})
