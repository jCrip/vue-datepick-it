<template>
  <transition name="asd__fade">
    <div
      :id="wrapperId"
      class="asd__wrapper"
      v-show="showYearpicker"
      :class="wrapperClasses"
      :style="showFullscreen ? undefined : wrapperStyles"
      v-click-outside="handleClickOutside"
    >
      <div class="asd__mobile-header asd__mobile-only" v-if="showFullscreen">
        <div class="asd__mobile-close" @click="closeYearpicker">
          <div class="asd__mobile-close-icon">X</div>
        </div>
        <h3>{{ mobileHeader }}</h3>
      </div>
      <div class="asd__yearpicker-header">
        <div class="asd__change-year-button asd__change-year-button--previous">
          <button @click="previousYearWrapper" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z" /></svg>
          </button>
        </div>
        <div class="asd__change-year-button asd__change-year-button--next">
          <button @click="nextYearWrapper" type="button">
            <svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" /></svg>
          </button>
        </div>

        <div class="asd__inner-wrapper" :style="innerStyles">
          <transition-group name="asd__list-complete" tag="div">
            <div
              v-for="(yearWrapper,yearWrapperIndex) in yearsWrappers"
              :key="yearWrapper.name"
              class="asd__year"
              :class="{hidden: yearWrapperIndex === 0 || yearWrapperIndex > showYears}"
              :style="yearWidthStyles"
            >
              <div class="asd__year-wrapper-name">{{ yearWrapper.name }}</div>
              <div class="asd__years-list">
                <div
                  class="asd__year-item"
                  v-for="year in yearWrapper.years"
                  :key="year.name"
                  :class="{
                    'asd__year-item--disabled': isDisabled(year),
                    'asd__year-item--enabled' : !isDisabled(year),
                    'asd__year-item--selected': isSelectedYear(year) || isSelectedYear(year),
                    'asd__year-item--in-range': isInRange(year)
                  }"
                  :style="getYearsWrapperStyles(year)"
                  @mouseover="setHoverYear(year)"
                >
                  <button
                    class="asd__year-button"
                    type="button"
                    :disabled="isDisabled(year)"
                    @click="selectYear(year)"
                    :class="{
                      'asd__year-button--disabled': isDisabled(year),
                    }"
                    :data-date="year.name"
                  >{{ year.name }}</button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
        <div class="asd__action-buttons" v-if="mode !== 'single' && showActionButtons">
          <button @click="closeYearpickerCancel" type="button">{{ texts.cancel }}</button>
          <button @click="apply" :style="{color: colors.selected}" type="button">{{ texts.apply }}</button>
        </div>
      </div>
  </div></transition>
</template>

<script>
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import subYears from 'date-fns/sub_years'
import addYears from 'date-fns/add_years'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import isSameYear from 'date-fns/is_same_year'
import isValid from 'date-fns/is_valid'
import startOfYear from 'date-fns/start_of_year'
import endOfYear from 'date-fns/end_of_year'
import { debounce, copyObject, findAncestor, randomString } from './../helpers'

export default {
  name: 'YearpickIt',
  props: {
    triggerElementId: { type: String },
    minYear: { type: [String, Date] },
    maxYear: { type: [String, Date] },
    mode: { type: String, default: 'range' },
    offsetY: { type: Number, default: 0 },
    offsetX: { type: Number, default: 0 },
    yearsWrappersToShow: { type: Number, default: 2 },
    yearsInWrapper: { type: Number, default: 9 },
    startOpen: { type: Boolean, default: false },
    fullscreenMobile: { type: Boolean, default: true },
    inline: { type: Boolean, default: false },
    mobileHeader: { type: String, default: 'Select date' },
    disabledYears: { type: Array, default: () => [] },
    showActionButtons: { type: Boolean, default: true },
    value: { type: [Array, String], default: () => ['', ''] },
    isTest: {
      type: Boolean,
      default: () => process.env.NODE_ENV === 'test'
    },
    trigger: { type: Boolean, default: false }
  },
  data() {
    return {
      yearOne: '',
      yearTwo: '',
      wrapperId: 'airbnb-style-yearpicker-wrapper-' + randomString(5),
      yearFormat: 'YYYY',
      showYearpicker: false,
      showYears: 2,
      startYearOfActualWrapper: '',
      colors: {
        selected: '#00a699',
        inRange: '#66e2da',
        selectedText: '#fff',
        text: '#565a5c',
        inRangeBorder: '#33dacd',
        disabled: '#fff'
      },
      texts: {
        apply: 'Apply',
        cancel: 'Cancel'
      },
      startingYear: '',
      yearsWrappers: [],
      width: 340,
      selectedDate1: '',
      selectedDate2: '',
      isSelectingDate1: true,
      hoverYear: '',
      alignRight: false,
      triggerPosition: {},
      triggerWrapperPosition: {},
      viewportWidth: window.innerWidth + 'px',
      isMobile: window.innerWidth < 768,
      isTablet: window.innerWidth >= 768 && window.innerWidth <= 1024,
      triggerElement: undefined
    }
  },
  computed: {
    wrapperClasses() {
      return {
        'asd__wrapper--yearpicker-open': this.showYearpicker,
        'asd__wrapper--full-screen': this.showFullscreen,
        'asd__wrapper--inline': this.inline
      }
    },
    wrapperStyles() {
      return {
        position: this.inline ? 'static' : 'absolute',
        top: this.inline
          ? '0'
          : this.triggerPosition.height + this.offsetY + 'px',
        left: !this.alignRight
          ? this.triggerPosition.left -
        this.triggerWrapperPosition.left +
        this.offsetX +
        'px'
          : '',
        right: this.alignRight
          ? this.triggerWrapperPosition.right -
        this.triggerPosition.right +
        this.offsetX +
        'px'
          : '',
        width: this.width * this.showYears + 'px',
        zIndex: this.inline ? '0' : '100'
      }
    },
    innerStyles() {
      return {
        'margin-left': this.showFullscreen
          ? '-' + this.viewportWidth
          : `-${this.width}px`
      }
    },
    yearWidthStyles() {
      return {
        width: this.showFullscreen ? this.viewportWidth : this.width + 'px'
      }
    },
    showFullscreen() {
      return this.isMobile && this.fullscreenMobile
    },
    allYearsSelected() {
      if (this.isSingleMode) {
        return !!(this.selectedDate1 &&
          this.selectedDate !== '')
      }
      return !!(
        this.selectedDate1 &&
        this.selectedDate1 !== '' &&
        this.selectedDate2 &&
        this.selectedDate2 !== '' &&
        !isSameYear(this.selectedDate2, this.selectedDate1)
      )
    },
    noYearsSelected() {
      return this.selectedDate1 === '' && this.selectedDate2 === ''
    },
    hasMinYear() {
      return !!(this.minYear && this.minYear !== '')
    },
    hasMaxYear() {
      return !!(this.maxYear && this.maxYear !== '')
    },
    isRangeMode() {
      return this.mode === 'range'
    },
    isSingleMode() {
      return this.mode === 'single'
    },
    yearpickerWidth() {
      return this.width * this.showYears
    },
    isDateTwoBeforeDateOne() {
      if (!this.yearTwo) {
        return false
      }
      return isBefore(this.yearTwo, this.yearOne)
    }
  },
  watch: {
    mode(newValue, oldValue) {
      this.setStartYears()
    }
  },
  created() {
    this.setupYearpicker()
    this._handleWindowResizeEvent = debounce(() => {
      this.positionYearpicker()
      this.setStartYears()
    }, 200)
    this._handleWindowClickEvent = event => {
      if (event.target.id === this.triggerElementId) {
        event.stopPropagation()
        event.preventDefault()
        this.toggleYearpicker()
      }
    }
    window.addEventListener('resize', this._handleWindowResizeEvent)
    window.addEventListener('click', this._handleWindowClickEvent)
  },
  mounted() {
    this.triggerElement = this.isTest
      ? document.createElement('input')
      : document.getElementById(this.triggerElementId)

    this.setStartYears()
    this.generateYearsWrappers()
    if (this.startOpen || this.inline) {
      this.openYearpicker()
    }

    this.triggerElement.addEventListener('keyup', this.handleTriggerInput)
  },
  destroyed() {
    window.removeEventListener('resize', this._handleWindowResizeEvent)
    window.removeEventListener('click', this._handleWindowClickEvent)

    this.triggerElement.removeEventListener('keyup', this.handleTriggerInput)
  },
  methods: {
    isSelectedYear(year) {
      return isSameYear(this.selectedDate1, year.firstDay) || isSameYear(this.selectedDate2, year.firstDay)
    },
    getYearsWrapperStyles(year) {
      const isSelected = this.isSelectedYear(year)
      const isInRange = this.isInRange(year)
      const isDisabled = this.isDisabled(year)

      let styles = {
        width: (this.width - 30) / 7 + 'px',
        background: isSelected
          ? this.colors.selected
          : isInRange ? this.colors.inRange : '',
        color: isSelected
          ? this.colors.selectedText
          : isInRange ? this.colors.selectedText : this.colors.text,
        border: isSelected
          ? '1px double ' + this.colors.selected
          : isInRange && this.allYearsSelected
            ? '1px double ' + this.colors.inRangeBorder
            : ''
      }
      if (isDisabled) {
        styles.background = this.colors.disabled
      }
      return styles
    },
    handleClickOutside(event) {
      if (
        event.target.id === this.triggerElementId ||
        !this.showYearpicker ||
        this.inline
      ) {
        return
      }
      this.closeYearpicker()
    },
    handleTriggerInput(event) {
      const keys = {
        arrowDown: 40,
        arrowUp: 38,
        arrowRight: 39,
        arrowLeft: 37
      }
      if (
        event.keyCode === keys.arrowDown &&
      !event.shiftKey &&
      !this.showYearpicker
      ) {
        this.openYearpicker()
      } else if (event.keyCode === keys.arrowUp && !event.shiftKey && this.showYearpicker) {
        this.closeYearpicker()
      } else if (
        event.keyCode === keys.arrowRight &&
    !event.shiftKey &&
    this.showYearpicker
      ) {
        this.nextYearWrapper()
      } else if (
        event.keyCode === keys.arrowLeft &&
    !event.shiftKey &&
    this.showYearpicker
      ) {
        this.previousYearWrapper()
      } else {
        if (this.mode === 'single') {
          this.setYearFromText(event.target.value)
        }
      }
    },
    setYearFromText(value) {
      if (value.length !== 4) {
        return
      }
      // make sure format is either 'YYYY-MM-DD' or 'DD.MM.YYYY'
      const isFormatYear = value.match(
        /(\d{4})/
      )
      if (!isFormatYear) {
        return
      }
      const valueAsDateObject = parse(value)
      if (!isValid(valueAsDateObject)) {
        return
      }
      const formattedDate = format(valueAsDateObject, this.yearFormat)
      if (
        this.isYearDisabled(formattedDate) ||
        this.isBeforeMinYear(formattedDate) ||
        this.isAfterMaxYear(formattedDate)
      ) {
        return
      }
      this.startingYear = subYears(formattedDate, 1)

      this.generateYearsWrappers()
      let yw = this.getYearData(value)
      this.selectYear(yw)
    },
    generateYearsWrappers() {
      this.yearsWrappers = []
      for (let i = 0; i < this.yearsWrappersToShow + 2; i++) {
        this.yearsWrappers.push(this.getYearWrapper(this.startingYear))
        this.startingYear = this.addYears(this.startingYear)
      }
    },
    getYearWrapper(date) {
      const firstYear = date.getFullYear()
      const lastYear = this.addYears(date).getFullYear() - 1
      const name = `${firstYear}–${lastYear}`
      return {
        name,
        years: this.getYearsData(firstYear, lastYear)
      }
    },
    getYearsData(firstYear, lastYear) {
      const years = []
      for (firstYear; firstYear <= lastYear; firstYear += 1) {
        let data = this.getYearData(firstYear)
        years.push(data)
      }
      return years
    },
    getYearData(year) {
      return {
        name: year.toString(),
        firstDay: startOfYear(parse(year.toString())),
        lastDay: endOfYear(parse(year.toString()))
      }
    },
    setupYearpicker() {
      if (this.$options.colors) {
        const colors = copyObject(this.$options.colors)
        this.colors.selected = colors.selected || this.colors.selected
        this.colors.inRange = colors.inRange || this.colors.inRange
        this.colors.selectedText =
      colors.selectedText || this.colors.selectedText
        this.colors.text = colors.text || this.colors.text
        this.colors.inRangeBorder =
      colors.inRangeBorder || this.colors.inRangeBorder
        this.colors.disabled = colors.disabled || this.colors.disabled
      }
      if (this.$options.monthNames && this.$options.monthNames.length === 12) {
        this.monthNames = copyObject(this.$options.monthNames)
      }
      if (this.$options.monthNamesShort && this.$options.monthNamesShort.length === 12) {
        this.monthNamesShort = copyObject(this.$options.monthNamesShort)
      }
      if (this.$options.texts) {
        const texts = copyObject(this.$options.texts)
        this.texts.apply = texts.apply || this.texts.apply
        this.texts.cancel = texts.cancel || this.texts.cancel
      }
    },
    setStartYears() {
      if (Array.isArray(this.value)) {
        [this.yearOne, this.yearTwo] = this.value
      } else {
        this.yearOne = parse(this.value)
      }
      let startDate
      if (this.yearOne !== '') {
        startDate = startOfYear(this.yearOne)
      } else {
        startDate = startOfYear(new Date())
      }
      if (this.hasMinYear && isBefore(startDate, this.minYear)) {
        startDate = startOfYear(this.minYear)
      }
      this.startYearOfActualWrapper = this.getInitialWrapperDate(parse(startDate))
      this.startingYear = this.subtractYears(parse(this.startYearOfActualWrapper))
      if (this.yearOne && this.yearOne !== '') {
        if (this.isSingleMode) {
          this.selectedDate1 = startOfYear(this.yearOne)
          this.selectedDate2 = endOfYear(this.yearOne)
        } else {
          this.selectedDate1 = startOfYear(this.yearOne)
          this.selectedDate2 = endOfYear(this.yearTwo)
        }
      }
    },
    subtractYears(date) {
      return subYears(date, this.yearsInWrapper)
    },
    addYears(date) {
      return addYears(date, this.yearsInWrapper)
    },
    getInitialWrapperDate(date) {
      const yearsToSubstract = Math.floor(this.yearsInWrapper / 2)
      return subYears(date, yearsToSubstract)
    },
    selectYear(year) {
      if (
        this.isBeforeMinYear(year.firstDay) ||
      this.isAfterMaxYear(year.firstDay) ||
      this.isYearDisabled(year.firstDay)) {
        return
      }

      if (this.mode === 'single') {
        this.selectedDate1 = year.firstDay
        this.selectedDate2 = year.lastDay
        this.$emit('input', [this.selectedDate1, this.selectedDate2])
        this.apply()
        return
      }
      if (isSameYear(this.selectedDate1, year.firstDay)) {
        this.selectedDate1 = ''
        this.selectedDate2 = ''
        this.isSelectingDate1 = true
      } else {
        if (this.isSelectingDate1 || isBefore(year.firstDay, this.selectedDate1)) {
          this.selectedDate1 = year.firstDay
          this.isSelectingDate1 = false

          if (isBefore(this.selectedDate2, year.lastDay)) {
            this.selectedDate2 = ''
          }
        } else {
          this.selectedDate2 = year.lastDay
          this.isSelectingDate1 = true

          if (isAfter(this.selectedDate1, year.lastDay)) {
            this.selectedDate1 = ''
          }
        }
      }
      if (this.allYearsSelected || this.noYearsSelected) this.$emit('input', [this.selectedDate1, this.selectedDate2])
      if (this.allYearsSelected && !this.showActionButtons) this.closeYearpicker()
    },
    setHoverYear(year) {
      this.hoverYear = year
    },
    isInRange(year) {
      if (!this.allYearsSelected || this.isSingleMode) {
        return false
      }
      return (
        (isAfter(year.firstDay, this.selectedDate1) &&
      isBefore(year.lastDay, this.selectedDate2)) ||
    (isAfter(year.firstDay, this.selectedDate1) &&
      isBefore(year.firstDay, this.hoverYear) &&
      !this.allYearsSelected)
      )
    },
    isBeforeMinYear(year) {
      if (!this.minYear) {
        return false
      }
      return isBefore(year.lastDay, this.minYear)
    },
    isAfterMaxYear(year) {
      if (!this.maxYear) {
        return false
      }
      return isAfter(year.firstDay, this.maxYear)
    },
    isYearDisabled(year) {
      for (var i = this.disabledYears.length - 1; i >= 0; i--) {
        if (isSameYear(year.firstDay, this.disabledYears[i])) { return true }
      }
      return false
    },
    isDisabled(year) {
      return (
        this.isYearDisabled(year) ||
    this.isBeforeMinYear(year) ||
    this.isAfterMaxYear(year)
      )
    },
    previousYearWrapper() {
      this.startingYear = this.subtractYears(this.yearsWrappers[0].years[0].firstDay)

      this.yearsWrappers.unshift(this.getYearWrapper(this.startingYear))
      this.yearsWrappers.splice(this.yearsWrappers.length - 1, 1)
    },
    nextYearWrapper() {
      this.startingYear = this.addYears(
        this.yearsWrappers[this.yearsWrappers.length - 1].years[0].firstDay)
      this.yearsWrappers.push(this.getYearWrapper(this.startingYear))

      setTimeout(() => {
        this.yearsWrappers.splice(0, 1)
      }, 100)
    },
    toggleYearpicker() {
      if (this.showYearpicker) {
        this.closeYearpicker()
      } else {
        this.openYearpicker()
      }
    },
    openYearpicker() {
      this.positionYearpicker()
      this.setStartYears()
      this.triggerElement.classList.add('yearpicker-open')
      this.showYearpicker = true
      this.initialDate1 = this.yearOne
      this.initialDate2 = this.yearTwo
    },
    closeYearpickerCancel() {
      if (this.showYearpicker) {
        this.selectedDate1 = this.initialDate1
        this.selectedDate2 = this.initialDate2
        this.closeYearpicker()
      }
    },
    closeYearpicker() {
      if (this.inline) {
        return
      }
      this.showYearpicker = false
      this.triggerElement.classList.remove('yearpicker-open')
      this.$emit('closed')
    },
    apply() {
      const datesSelected = {
        yearOne: this.selectedDate1,
        yearTwo: this.selectedDate2
      }
      this.$emit('apply', datesSelected)
      this.closeYearpicker()
    },
    positionYearpicker() {
      const triggerWrapperElement = findAncestor(
        this.triggerElement,
        '.yearpicker-trigger'
      )
      this.triggerPosition = this.triggerElement.getBoundingClientRect()
      if (triggerWrapperElement) {
        this.triggerWrapperPosition = triggerWrapperElement.getBoundingClientRect()
      } else {
        this.triggerWrapperPosition = { left: 0, right: 0 }
      }

      const viewportWidth =
  document.documentElement.clientWidth || window.innerWidth
      this.viewportWidth = viewportWidth + 'px'
      this.isMobile = viewportWidth < 768
      this.isTablet = viewportWidth >= 768 && viewportWidth <= 1024
      this.showYears = this.isMobile
        ? 1
        : this.isTablet && this.yearsWrappersToShow > 2 ? 2 : this.yearsWrappersToShow

      this.$nextTick(function() {
        const monthpickerWrapper = document.getElementById(this.wrapperId)
        if (!this.triggerElement || !monthpickerWrapper) {
          return
        }

        const rightPosition =
    this.triggerElement.getBoundingClientRect().left +
    monthpickerWrapper.getBoundingClientRect().width
        this.alignRight = rightPosition > viewportWidth
      })
    }
  }
}
</script>

<style lang="scss">
@import './../styles/transitions';

$tablet: 768px;
$color-gray: rgba(0, 0, 0, 0.2);
$border-normal: 1px solid $color-gray;
$border: 1px solid #e4e7e7;
$transition-time: 0.3s;

*,
*:after,
*:before {
  box-sizing: border-box;
}

.yearpicker-trigger {
  position: relative;
  overflow: visible;
}

.asd {
  &__wrapper {
    border: $border-normal;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;
    background-color: white;

    &--full-screen {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: none;
      z-index: 100;
    }
  }
  &__inner-wrapper {
    transition: all $transition-time ease;
    position: relative;
  }

  &__yearpicker-header {
    position: relative;
  }

  &__change-year-button {
    position: absolute;
    top: 12px;
    z-index: 10;
    background: white;

    &--previous {
      left: 0;
      padding-left: 15px;
    }
    &--next {
      right: 0;
      padding-right: 15px;
    }

    > button {
      background-color: white;
      border: $border;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;

      &:hover {
        border: 1px solid #c4c4c4;
      }

      > svg {
        height: 19px;
        width: 19px;
        fill: #82888a;
      }
    }
  }

  &__year-wrapper-name {
    font-size: 1.3em;
    text-align: center;
    margin: 0 0 30px;
    line-height: 1.4em;
    text-transform: lowercase;
    font-weight: bold;
  }

  &__year {
    transition: all $transition-time ease;
    display: inline-block;
    padding: 15px;

    &--hidden {
      height: 275px;
      visibility: hidden;
    }
  }

  &__years-list {
    display: flex;
    flex-wrap: wrap;
  }

  &__year-item {
    $size: 40px;
    flex: 1;
    flex-basis: 30%;
    border: 1px solid #e4e7e7;
    margin: 1%;
    line-height: $size;
    height: $size;
    padding: 0;
    overflow: hidden;
    &--enabled {
      border: $border;
      &:hover {
        background-color: #e4e7e7;
      }
    }
    &--disabled {
      opacity: 0.5;
      &:hover {
        background-color: transparent;
      }

      button {
        cursor: default;
      }
    }
  }

  &__year-button {
    background: transparent;
    width: 100%;
    height: 100%;
    border: none;
    cursor: pointer;
    color: inherit;
    text-align: center;
    user-select: none;
    font-size: 15px;
    font-weight: inherit;
    padding: 0;
  }

  &__action-buttons {
    min-height: 50px;
    padding-top: 10px;
    button {
      display: block;
      position: relative;
      background: transparent;
      border: none;
      font-weight: bold;
      font-size: 15px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
      &:nth-child(1) {
        float: left;
        left: 15px;
      }
      &:nth-child(2) {
        float: right;
        right: 15px;
      }
    }
  }

  &__mobile-header {
    border-bottom: $border-normal;
    position: relative;
    padding: 15px 15px 15px 15px !important;
    text-align: center;
    height: 50px;
    h3 {
      font-size: 20px;
      margin: 0;
    }
  }

  &__mobile-only {
    display: none;
    @media (max-width: 600px) {
      display: block;
    }
  }

  &__mobile-close {
    position: absolute;
    top: 7px;
    right: 5px;
    padding: 5px;
    z-index: 100;
    cursor: pointer;

    &__icon {
      position: relative;
      font-size: 1.6em;
      font-weight: bold;
      padding: 0;
    }
  }
}
</style>
