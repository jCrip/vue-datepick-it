import { shallow, createLocalVue } from '@vue/test-utils'
import AirbnbStyleYearpicker from '@/components/AirbnbStyleYearpicker'
import ClickOutside from '@/directives/ClickOutside'
import TestHelpers from 'test/test-helpers'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import endOfYear from 'date-fns/end_of_year'
import startOfYear from 'date-fns/start_of_year'
import isSameMonth from 'date-fns/is_same_month'

const localVue = createLocalVue()
localVue.directive('click-outside', ClickOutside)

const createYearPickerInstance = (propsData, options) => {
  let h

  if (!propsData) {
    propsData = {
      value: ['', ''],
      yearsWrappersToShow: 2
    }
  }
  if (!options) {
    options = {}
  }
  const component = {
    ...AirbnbStyleYearpicker,
    ...options
  }
  const wrapper = shallow(component, {
    localVue,
    propsData
  })
  h = new TestHelpers(wrapper, expect)
  return wrapper
}
const yearpickerWrapper = '.asd__wrapper'
let wrapper

describe('AirbnbStyleYearpicker', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('lifecycle hooks', () => {
    test('creates correct amount of years', () => {
      wrapper = createYearPickerInstance()
      expect(wrapper.vm.yearsWrappers.length).toEqual(wrapper.props().yearsWrappersToShow + 2)
    })
    test('dates are set when initial values are passed', () => {
      wrapper = createYearPickerInstance({
        value: [parse('2015'), parse('2016')]
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfYear(parse(wrapper.props().value[0])))
      expect(wrapper.vm.selectedDate2).toEqual(endOfYear(parse(wrapper.props().value[1])))
    })
    test('dates are set when is single Mode and only one month is passed', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: [parse('2015'), '']
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfYear(parse(wrapper.props().value[0])))
      expect(wrapper.vm.selectedDate2).toEqual(endOfYear(parse(wrapper.props().value[0])))
    })
    test('dates are set when is single Mode and only one month is passed', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: '2015'
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfYear(parse(wrapper.props().value)))
      expect(wrapper.vm.selectedDate2).toEqual(endOfYear(parse(wrapper.props().value)))
    })
  })

  describe('computed', () => {
    test('allYearsSelected() works', () => {
      wrapper = createYearPickerInstance({
        mode: 'range',
        value: [ '', '' ]
      })
      expect(wrapper.vm.allYearsSelected).toEqual(false)
    })
    test('allYearsSelected() works', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: 'February 2016'
      })
      expect(wrapper.vm.allYearsSelected).toEqual(true)
    })
  })

  describe('methods', () => {
    test('getYearData() returns correct values', () => {
      const wrapper = createYearPickerInstance()
      let year = wrapper.vm.getYearData('2015')
      expect(year.name).toBe('2015')
      expect(year.firstDay).toEqual(parse('2015-01-01'))
      expect((year.lastDay)).toEqual(endOfYear(parse('2015')))
    })
    test('getYearWrapper() returns correct values', () => {
      let years = wrapper.vm.getYearWrapper(parse('2017'))
      expect(years.years.length).toEqual(9)
    })
    test('setHoverMonth() sets correct value', () => {
      const wrapper = createYearPickerInstance()
      let yearToSelect = wrapper.vm.getYearWrapper(parse('2017')).years[0]
      wrapper.vm.setHoverYear(yearToSelect)
      expect(yearToSelect).toBe(wrapper.vm.hoverYear)
    })
    test('isSelectedYear() works', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: '2018 '
      })
      let y2018 = wrapper.vm.getYearWrapper(parse('2018')).years[0]
      let y2019 = wrapper.vm.getYearWrapper(parse('2018')).years[1]
      expect(wrapper.vm.isSelectedYear(y2019)).toEqual(false)
      expect(wrapper.vm.isSelectedYear(y2018)).toEqual(true)
    })
    test('previousYearWrapper adds year first', () => {
      const firstYearWrapper = wrapper.vm.yearsWrappers[0]
      wrapper.setData({ showYearpicker: true })
      expect(wrapper.vm.yearsWrappers[0].name).toEqual(firstYearWrapper.name)
      wrapper.vm.previousYearWrapper()
      expect(wrapper.vm.yearsWrappers[0].name).not.toEqual(firstYearWrapper.name)
    })
    test('nextYear adds year last', () => {
      const lastYearWrapper = wrapper.vm.yearsWrappers[wrapper.vm.yearsWrappers.length - 1]
      wrapper.setData({ showYearpicker: true })
      expect(wrapper.vm.yearsWrappers[wrapper.vm.yearsWrappers.length - 1].name).toEqual(lastYearWrapper.name)
      wrapper.vm.nextYearWrapper()
      expect(wrapper.vm.yearsWrappers[wrapper.vm.yearsWrappers.length - 1].name).not.toEqual(lastYearWrapper.name)
    })
    test('closeYearpicker sets correct value', () => {
      wrapper.setData({
        triggerElement: document.createElement('div'),
        showYearpicker: true
      })
      wrapper.vm.closeYearpicker()
      expect(wrapper.vm.showYearpicker).toBe(false)
    })
    test('year is in range', () => {
      wrapper = createYearPickerInstance({
        value: ['2014', '2020']
      })
      expect(wrapper.vm.isInRange(wrapper.vm.yearsWrappers[2].years[6])).toBe(false)
      expect(wrapper.vm.isInRange(wrapper.vm.yearsWrappers[2].years[2])).toBe(false)
      expect(wrapper.vm.isInRange(wrapper.vm.yearsWrappers[1].years[5])).toBe(true)
    })
    test('event is emitted when selecting year', () => {
      wrapper = createYearPickerInstance()
      const yearOne = wrapper.vm.yearsWrappers[2].years[7]
      const yearTwo = wrapper.vm.yearsWrappers[3].years[5]
      wrapper.vm.selectYear(yearOne)
      wrapper.vm.selectYear(yearTwo)

      wrapper.vm.$nextTick(function() {
        expect(wrapper.vm.selectedDate1).toEqual(yearOne.firstDay)
        expect(wrapper.vm.selectedDate2).toEqual(yearTwo.lastDay)
      })
    })
    test('year of minMonth is shown first', () => {
      const minYearToTest = 2020
      wrapper = createYearPickerInstance({ minYear: minYearToTest.toString() })
      const yearsInWrapper = wrapper.vm.yearsInWrapper
      const minYearInsideWrapper = minYearToTest - (Math.floor(yearsInWrapper / 2))
      const maxYearInsideWrapper = minYearToTest + (Math.floor(yearsInWrapper / 2))
      const label = `${minYearInsideWrapper}–${maxYearInsideWrapper}`
      const firstVisibleYear = wrapper.vm.yearsWrappers[1]
      expect(firstVisibleYear.name).toBe(label)
    })
    test('emits closed event on monthpicker close', () => {
      wrapper = createYearPickerInstance()
      wrapper.setData({ triggerElement: document.createElement('div') })
      wrapper.vm.closeYearpicker()
      wrapper.vm.$nextTick(function() {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
  })

  describe('gui', () => {
    test('YearWrapper shows year title', () => {
      const initialYear = 2018
      const finalYear = 2020
      wrapper = createYearPickerInstance({
        value: [initialYear.toString(), finalYear.toString()]
      })
      wrapper.setData({ showYearpicker: true })
      const yearsInWrapper = wrapper.vm.yearsInWrapper
      const minYearInsideWrapper = initialYear - (Math.floor(yearsInWrapper / 2))
      const maxYearInsideWrapper = minYearInsideWrapper + yearsInWrapper - 1
      const label = `${minYearInsideWrapper}–${maxYearInsideWrapper}`
      expect(wrapper.contains('.asd__year-wrapper-name')).toBe(true)
      // console.log(wrapper.findAll('.asd__year-wrapper-name').wrappers[1].text())
      expect(wrapper.findAll('.asd__year-wrapper-name').wrappers[1].text()).toContain(label)
    })
    test('yearpicker wrapper is correct width', () => {
      wrapper = createYearPickerInstance({
        yearsWrappersToShow: 2
      })
      wrapper.setData({ showYearpicker: true })

      let dWrapper = wrapper.find(yearpickerWrapper)
      expect(dWrapper.element.style.width).toBe(wrapper.vm.width * 2 + 'px')
    })
    test('selected year get selected class', () => {
      wrapper = createYearPickerInstance({
        value: ['2018', '2022']
      })
      wrapper.setData({ showYearpicker: true })
      expect(wrapper.contains('.asd__year-item--selected')).toBe(true)
      expect(wrapper.findAll('.asd__year-item--selected').length).toBe(2)
      expect(wrapper.contains('.asd__year-item--in-range')).toBe(true)
      expect(wrapper.findAll('.asd__year-item--in-range').length).toBe(3)
    })
    test('is fullscreen on mobile', () => {
      wrapper = createYearPickerInstance({
        fullscreenMobile: true,
        yearsWrappersToShow: 2
      })
      wrapper.vm.isMobile = true
      wrapper.vm.viewportWidth = '650px'
      wrapper.setData({ showYearpicker: true })

      let dWrapper = wrapper.find(yearpickerWrapper)
      expect(dWrapper.classes()).toContain('asd__wrapper--full-screen')
    })
    test('disabled years are not selectable', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: '2019',
        disabledYears: [parse('2018')]
      })
      wrapper.setData({ showYearpicker: true })
      const disabledYear = wrapper.find('.asd__year-button[data-date="2018"]')
      expect(disabledYear.classes()).toContain('asd__year-button--disabled')
      disabledYear.trigger('click')
      expect(wrapper.vm.selectedDate1).not.toEqual(startOfYear(parse('2018')))
      expect(wrapper.vm.selectedDate1).toEqual(startOfYear(parse('2019')))
    })
    test('year are set if user types a valid year in input', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: ['2018', '2020']
      })
      wrapper.setData({ showYearpicker: true })
      wrapper.vm.handleTriggerInput({ target: { value: '2024' } })
      expect(parse(wrapper.vm.selectedDate1)).toEqual(startOfYear('2024'))
    })
    test('opens yearpicker on focus', () => {
      wrapper = createYearPickerInstance({
        mode: 'single',
        value: ['', ''],
        openOnFocus: true
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      expect(wrapper.classes()).toContain('asd__wrapper')
    })
  })
})
