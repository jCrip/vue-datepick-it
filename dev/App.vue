<template>
  <div class="app" :class="{'align-right': alignRight}">
    <div v-if="showDatepickers">
      <div class="datepicker-container with-input">
        <h3>Range datepicker with input</h3>
        <div class="datepicker-trigger">
          <input
            type="text"
            id="datepicker-input-trigger"
            :value="vModelformatDates(vModelInputs)"
            placeholder="Select dates"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-trigger'"
            :mode="'range'"
            v-model="vModelInputs"
            :min-date="parse('2018-02-28')"
            :open-on-focus="true"
            :months-to-show="2"
            :show-action-buttons="true"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="datepicker-container single-with-input">
        <h3>Single datepicker with input</h3>
        <div class="datepicker-trigger">
          <input
            type="text"
            id="datepicker-input-single-trigger"
            :value="vModelformatDates(vModelSingleDate)"
            placeholder="Select dates"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-single-trigger'"
            :mode="'single'"
            v-model="vModelSingleDate"
            :months-to-show="2"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="datepicker-container with-button">
        <h3>Range datepicker with button</h3>
        <div class="datepicker-trigger">
          <button id="datepicker-button-trigger">{{ vModelformatDates(vModelButtons) || 'Select dates' }}</button>

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-button-trigger'"
            :mode="'range'"
            v-model="vModelButtons"
            :min-date="parse('2018-04-18')"
            :fullscreen-mobile="true"
            :months-to-show="2"
            :trigger="trigger"
            :offset-y="10"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="datepicker-container inline-with-input">
        <h3>Inline datepicker with input</h3>
        <input
          id="datepicker-inline-trigger"
          :value="vModelformatDates(vModelSingleDate)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-inline-trigger'"
          v-model="vModelSingleDate"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :months-to-show="2"
          :disabled-dates="[parse('2018-04-30'), parse('2018-05-10'), parse('2018-12-14')]"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>

      <div class="monthpicker-container datepicker-container with-input">
        <h3>Range monthpicker with input</h3>
        <div class="monthpicker-trigger">
          <input
            type="text"
            id="monthpicker-input-trigger"
            :value="vModelformatMonths(vModelInputs)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-trigger'"
            v-model="vModelInputs"
            :mode="'range'"
            :min-date="parse('2018-02')"
            :months-to-show="2"
            :show-action-buttons="true"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container single-with-input">
        <h3>Single monthpicker with input</h3>
        <div class="monthpicker-trigger">
          <input
            type="text"
            id="monthpicker-input-single-trigger"
            :value="vModelformatMonthsSingle(vModelSingleDate)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-single-trigger'"
            v-model="vModelSingleDate"

            :mode="'single'"
            :months-to-show="2"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container with-button">
        <h3>Range monthpicker with button</h3>
        <div class="monthpicker-trigger">
          <button id="monthpicker-button-trigger">{{ vModelformatMonths(vModelButtons) || 'Select dates' }}</button>

          <airbnb-style-monthpicker
            v-model="vModelButtons"

            :max-date="parse('2018-12')"
            :trigger-element-id="'monthpicker-button-trigger'"
            :mode="'range'"
            :inline="false"
            :fullscreen-mobile="true"
            :months-to-show="2"
            :trigger="trigger"
            :offset-y="10"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container inline-with-input">
        <h3>Inline monthpicker with input</h3>
        <input
          id="monthpicker-inline-trigger"
          :value="vModelformatMonthsSingle(vModelInputs)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-monthpicker
          :trigger-element-id="'monthpicker-inline-trigger'"
          v-model="vModelInputs"
          :min-date="parse('2018-04')"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :months-to-show="2"
          :disabled-months="[parse('2018-06')]"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>

    </div>

    <button @click="toggleDatepickers">Hide monthpickers</button>
    <button @click="toggleAlign">Toggle alignment</button>
    <button @click="toggleTrigger">Toggle trigger</button>
  </div>
</template>

<script>
import format from 'date-fns/format'
import parse from 'date-fns/parse'
var es = require('date-fns/locale/es')

export default {
  data() {
    return {
      dateFormat: 'DD MMMM YYYY', //'D MMM',
      monthFormat: 'MMMM YYYY', //'D MMM',
      inputDateOne: '',
      inputDateTwo: '',
      inputSingleDateOne: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      inlineDateOne: '',
      sundayFirst: false,
      alignRight: false,
      showDatepickers: true,
      trigger: false,
      vModelButtons: ['', ''],
      vModelInputs: ['', ''],
      vModelSingleDate: ['', '']
    }
  },
  computed: {},
  created() {
    // setTimeout(() => {
    //   this.inputDateOne = '2019-01-12'
    //   this.inputDateTwo = '2019-01-15'
    // }, 5000)
  },
  methods: {
    parse(date) {
      return parse(date)
    },
    formatDates(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat, { locale: es })
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.dateFormat, { locale: es })
      }
      return formattedDates
    },
    formatMonths(dateOne, dateTwo) {
      let formattedDates = ''
      if (dateOne) {
        formattedDates = format(dateOne, this.monthFormat, {locale: es})
      }
      if (dateTwo) {
        formattedDates += ' - ' + format(dateTwo, this.monthFormat, {locale: es})
      }
      return formattedDates
    },
    vModelformatMonths(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.monthFormat, {locale: es})
      }
      if (VmodelButtons[1]) {
        formattedDates += ' - ' + format(VmodelButtons[1], this.monthFormat, {locale: es})
      }
      return formattedDates
    },
    vModelformatMonthsSingle(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.monthFormat, {locale: es})
      }
      return formattedDates
    },
    vModelformatDates(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.dateFormat, { locale: es })
      }
      if (VmodelButtons[1]) {
        formattedDates += ' - ' + format(VmodelButtons[1], this.dateFormat, { locale: es })
      }
      return formattedDates
    },
    toggleAlign() {
      this.alignRight = !this.alignRight
    },
    toggleDatepickers() {
      this.showDatepickers = !this.showDatepickers
    },
    toggleTrigger() {
      this.trigger = !this.trigger
    },
    applyMethod() {
      console.log('apply')
    },
    closedMethod() {
      console.log('closed')
      this.trigger = false
    }
  }
}
</script>

<style lang="scss">
html,
body {
  min-height: 200vh;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
  Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 18px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  padding: 10px;
}
.app {
  &.align-right {
    text-align: right;
  }
}
h1 {
  font-size: 1.8em;
  line-height: 1.5em;
}
.monthpicker-container,.datepicker-container {
  margin-bottom: 30px;
}

#monthpicker-button-trigger,#datepicker-button-trigger {
  background: #008489;
  border: 1px solid #008489;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  min-width: 200px;
}
input {
  padding: 6px 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.with-input {
  .monthpicker-trigger,.datepicker-trigger {
    //padding-right: 40px;
  }
}
.with-button {
  .monthpicker-trigger,.datepicker-trigger {
    //padding-left: 10px;
  }
}
// .inline-with-input {
  //   width: 600px;
  //   input {
    //     width: 100%;
    //   }
    // }
    </style>
