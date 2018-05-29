<template>
  <div class="app" :class="{'align-right': alignRight}">
    <div v-if="showDatepickers">
      <div class="datepicker-container with-input">
        <h3>Range datepicker with input</h3>
        <div class="datepicker-trigger">
          <input
            type="text"
            id="datepicker-input-trigger"
            :value="formatDates(multipleDates)"
            placeholder="Select dates"
          >
          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-trigger'"
            :mode="'range'"
            v-model="multipleDates"
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
            :value="formatDates(inputDateOne)"
            placeholder="Select dates"
          >

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-input-single-trigger'"
            :mode="'single'"
            v-model="inputDateOne"
            :months-to-show="2"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="datepicker-container with-button">
        <h3>Range datepicker with button</h3>
        <div class="datepicker-trigger">
          <button id="datepicker-button-trigger">{{ formatDates(multipleDates) || 'Select dates' }}</button>

          <airbnb-style-datepicker
            :trigger-element-id="'datepicker-button-trigger'"
            :mode="'range'"
            v-model="multipleDates"
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
          :value="formatDates(inputDateOne)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-datepicker
          :trigger-element-id="'datepicker-inline-trigger'"
          v-model="inputDateOne"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :months-to-show="2"
          :disabled-dates="[parse('2018-04-30'), parse('2018-05-10'), parse('2018-12-14')]"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>
    </div>
    <div v-if="showMonthpickers">

      <div class="monthpicker-container datepicker-container with-input">
        <h3>Range monthpicker with input</h3>
        <div class="monthpicker-trigger">
          <input
            type="text"
            id="monthpicker-input-trigger"
            :value="formatMonths(multipleDates)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-trigger'"
            v-model="multipleDates"
            :mode="'range'"
            :min-month="parse('2018-02')"
            :years-to-show="2"
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
            :value="formatMonthsSingle(multipleDates)"
            placeholder="Select dates"
          >

          <airbnb-style-monthpicker
            :trigger-element-id="'monthpicker-input-single-trigger'"
            v-model="multipleDates"

            :mode="'single'"
            :years-to-show="2"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="monthpicker-container with-button">
        <h3>Range monthpicker with button</h3>
        <div class="monthpicker-trigger">
          <button id="monthpicker-button-trigger">{{ formatMonths(multipleDates) || 'Select dates' }}</button>

          <airbnb-style-monthpicker
            v-model="multipleDates"

            :max-month="parse('2018-12')"
            :trigger-element-id="'monthpicker-button-trigger'"
            :mode="'range'"
            :inline="false"
            :fullscreen-mobile="true"
            :years-to-show="2"
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
          :value="formatMonthsSingle(multipleDates)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-monthpicker
          :trigger-element-id="'monthpicker-inline-trigger'"
          v-model="multipleDates"
          :min-date="parse('2018-04')"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :years-to-show="2"
          :disabled-months="[parse('2018-06')]"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>
    </div>
    <div v-if="showYearpickers">
      <div class="yearpicker-container with-input">
        <h3>Range yearpicker with input</h3>
        <div class="yearpicker-trigger">
          <input
            type="text"
            id="yearpicker-input-trigger"
            :value="formatYears(multipleDates)"
            placeholder="Select dates"
          >

          <airbnb-style-yearpicker
            :trigger-element-id="'yearicker-input-trigger'"
            v-model="multipleDates"
            :mode="'range'"
            :min-year="parse('2018')"
            :years-wrappers-to-show="2"
            :show-action-buttons="true"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="yearpicker-container single-with-input">
        <h3>Single yearpicker with input</h3>
        <div class="yearpicker-trigger">
          <input
            type="text"
            id="yearpicker-input-single-trigger"
            :value="formatYears(multipleDates)"
            placeholder="Select Years"
          >

          <airbnb-style-yearpicker
            :trigger-element-id="'yearpicker-input-single-trigger'"
            v-model="multipleDates"

            :mode="'single'"
            :years-wrappers-to-show="2"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="yearpicker-container with-button">
        <h3>Range yearpicker with button</h3>
        <div class="yearpicker-trigger">
          <button id="yearpicker-button-trigger">{{ formatYears(multipleDates) || 'Select Years' }}</button>

          <airbnb-style-yearpicker
            v-model="multipleDates"

            :max-month="parse('2018-12')"
            :trigger-element-id="'yearpicker-button-trigger'"
            :mode="'range'"
            :inline="false"
            :fullscreen-mobile="true"
            :years-wrappers-to-show="2"
            :trigger="trigger"
            :offset-y="10"
            @apply="applyMethod"
            @closed="closedMethod"
          />
        </div>
      </div>

      <div class="yearpicker-container inline-with-input">
        <h3>Inline yearpicker with input</h3>
        <input
          id="yearpicker-inline-trigger"
          :value="formatYears(multipleDates)"
          type="text"
          placeholder="Select date"
        >
        <airbnb-style-yearpicker
          :trigger-element-id="'yearpicker-inline-trigger'"
          v-model="multipleDates"
          :min-date="parse('2018-04')"
          :mode="'single'"
          :inline="true"
          :fullscreen-mobile="false"
          :years-wrappers-to-show="2"
          :disabled-years="[parse('2018')]"
          @apply="applyMethod"
          @closed="closedMethod"
        />
      </div>
    </div>

    <button @click="toggleDatepickers">Hide datepickers</button>
    <button @click="toggleMonthpickers">Hide monthpickers</button>
    <button @click="toggleYearpickers">Hide yearpickers</button>
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
      yearFormat: 'YYYY',
      inputDateOne: '',
      inputDateTwo: '',
      inputSingleDateOne: '',
      buttonDateOne: '',
      buttonDateTwo: '',
      inlineDateOne: '',
      sundayFirst: false,
      alignRight: false,
      showDatepickers: true,
      showYearpickers: true,
      showMonthpickers: true,
      trigger: false,
      vModelButtons: ['', ''],
      vModelInputs: ['', ''],
      vModelSingleDate: ['', '']
    }
  },
  computed: {

    multipleDates: {
      get() {
        return [
          this.inputDateOne,
          this.inputDateTwo
        ]
      },
      set(value) {
        [this.inputDateOne, this.inputDateTwo] = value
      }
    }
  },
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

    formatMonths(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.monthFormat, {locale: es})
      }
      if (VmodelButtons[1]) {
        formattedDates += ' - ' + format(VmodelButtons[1], this.monthFormat, {locale: es})
      }
      return formattedDates
    },
    formatYears(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.yearFormat, {locale: es})
      }
      if (VmodelButtons[1]) {
        formattedDates += ' - ' + format(VmodelButtons[1], this.yearFormat, {locale: es})
      }
      return formattedDates
    },
    formatMonthsSingle(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.monthFormat, {locale: es})
      }
      return formattedDates
    },
    formatYearSingle(VmodelButtons) {
      let formattedDates = ''
      if (VmodelButtons[0]) {
        formattedDates = format(VmodelButtons[0], this.yearFormat, {locale: es})
      }
      return formattedDates
    },
    formatDates(Dates) {
      let formattedDates = ''
      if (!Array.isArray(Dates)) {
        if (Dates) formattedDates = format(Dates, this.dateFormat, { locale: es })
      } else {
        if (Dates[0]) {
          formattedDates = format(Dates[0], this.dateFormat, { locale: es })
        }
        if (Dates[1]) {
          formattedDates += ' - ' + format(Dates[1], this.dateFormat, { locale: es })
        }
      }
      return formattedDates
    },
    toggleAlign() {
      this.alignRight = !this.alignRight
    },
    toggleDatepickers() {
      this.showDatepickers = !this.showDatepickers
    },
    toggleMonthpickers() {
      this.showMonthpickers = !this.showMonthpickers
    },
    toggleYearpickers() {
      this.showYearpickers = !this.showYearpickers
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
