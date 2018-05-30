import { shallow, createLocalVue } from '@vue/test-utils'
import AirbnbStyleMonthpicker from '@/components/AirbnbStyleMonthpicker'
import ClickOutside from '@/directives/ClickOutside'
import TestHelpers from 'test/test-helpers'
import parse from 'date-fns/parse'
import format from 'date-fns/format'
import lastDayOfMonth from 'date-fns/last_day_of_month'
import startOfMonth from 'date-fns/start_of_month'
import isSameMonth from 'date-fns/is_same_month'

const localVue = createLocalVue()
localVue.directive('click-outside', ClickOutside)

const createMonthPickerInstance = (propsData, options) => {
  let h

  if (!propsData) {
    propsData = {
      value: [parse('Enero 2018'), parse('Mayo 2018')],
      yearsToShow: 2
    }
  }
  if (!options) {
    options = {}
  }
  const component = {
    ...AirbnbStyleMonthpicker,
    ...options
  }
  const wrapper = shallow(component, {
    localVue,
    propsData
  })
  h = new TestHelpers(wrapper, expect)
  return wrapper
}
const monthpickerWrapper = '.asd__wrapper'
let wrapper

describe('AirbnbStyleMonthpicker', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('lifecycle hooks', () => {
    test('creates correct amount of years', () => {
      wrapper = createMonthPickerInstance()
      expect(wrapper.vm.years.length).toEqual(wrapper.props().yearsToShow + 2)
    })
    test('dates are set when initial values are passed', () => {
      wrapper = createMonthPickerInstance({
        value: ['Enero 2015', 'Febrero 2016']
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfMonth(parse(wrapper.props().value[0])))
      expect(wrapper.vm.selectedDate2).toEqual(lastDayOfMonth(parse(wrapper.props().value[1])))
    })
    test('dates are set when is single Mode and only one month is passed', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: ['Enero 2015', '']
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfMonth(parse(wrapper.props().value[0])))
      expect(wrapper.vm.selectedDate2).toEqual(lastDayOfMonth(parse(wrapper.props().value[0])))
    })
    test('dates are set when is single Mode and only one month is passed', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: 'Enero 2015'
      })
      expect(wrapper.vm.selectedDate1).toEqual(startOfMonth(parse(wrapper.props().value)))
      expect(wrapper.vm.selectedDate2).toEqual(lastDayOfMonth(parse(wrapper.props().value)))
    })
  })

  describe('computed', () => {
    test('allMonthsSelected() works', () => {
      wrapper = createMonthPickerInstance({
        mode: 'range',
        value: [ '', '']
      })
      expect(wrapper.vm.allMonthsSelected).toEqual(false)
    })
    test('allMonthsSelected() works', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: ['Febrero 2016', '']
      })
      expect(wrapper.vm.allMonthsSelected).toEqual(true)
    })
  })

  describe('methods', () => {
    test('getYear() returns correct values', () => {
      const wrapper = createMonthPickerInstance()
      let year = wrapper.vm.getYear(new Date('2017-12-01'))
      expect(year.name).toBe(2017)
      expect(year.months.length).toBeGreaterThan(0)
    })
    test('getMonths() returns correct values', () => {
      let months = wrapper.vm.getMonths('2017-12-01')
      expect(months.length).toEqual(12)
    })
    test('setHoverMonth() sets correct value', () => {
      const wrapper = createMonthPickerInstance()
      wrapper.vm.setHoverMonth(wrapper.vm.getMonths('2017-12-01')[0])
      expect(format(wrapper.vm.hoverMonth, 'YYYY-MM-DD')).toBe(format(parse('2017-01-01'), 'YYYY-MM-DD'))
    })
    test('isSelected() works', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: ['Enero 2018', '']
      })
      let enero2018 = wrapper.vm.getMonths('2018-12-01')[0]
      expect(wrapper.vm.isSelected('2017-12-11')).toEqual(false)
      expect(wrapper.vm.isSelected(enero2018)).toEqual(true)
    })
    test('previousYear adds year first', () => {
      const firstYear = wrapper.vm.years[1]
      wrapper.setData({ showMonthpicker: true })
      wrapper.vm.previousYear()
      expect(wrapper.vm.years[0].name).not.toEqual(firstYear.name)
    })
    test('nextYear adds year last', () => {
      const lastYear = wrapper.vm.years[wrapper.vm.years.length - 1]
      wrapper.setData({ showMonthpicker: true })
      wrapper.vm.nextYear()
      expect(wrapper.vm.years[0].name).not.toEqual(lastYear.name)
    })
    test('closeMonthpicker sets correct value', () => {
      wrapper.setData({
        triggerElement: document.createElement('div'),
        showMonthpicker: true
      })
      wrapper.vm.closeMonthpicker()
      expect(wrapper.vm.showMonthpicker).toBe(false)
    })
    test('month is in range', () => {
      wrapper = createMonthPickerInstance({
        value: ['January 2018', 'April 2018']
      })
      expect(wrapper.vm.isInRange(wrapper.vm.years[2].months[6])).toBe(false)
      expect(wrapper.vm.isInRange(wrapper.vm.years[2].months[2])).toBe(false)
      expect(wrapper.vm.isInRange(wrapper.vm.years[1].months[1])).toBe(true)
    })
    test('event is emitted when selecting month', () => {
      wrapper = createMonthPickerInstance()
      const monthOne = wrapper.vm.years[2].months[7]
      const monthTwo = wrapper.vm.years[3].months[5]
      wrapper.vm.selectMonth(monthOne)
      wrapper.vm.selectMonth(monthTwo)

      wrapper.vm.$nextTick(function() {
        expect(wrapper.vm.selectedDate1).toEqual(monthOne.firstDay)
        expect(wrapper.vm.selectedDate2).toEqual(monthTwo.lastDay)
      })
    })
    test('year of minMonth is shown first', () => {
      wrapper = createMonthPickerInstance({ minMonth: 'May 2020' })
      const firstVisibleYear = wrapper.vm.years[1]
      expect(firstVisibleYear.name).toBe(2020)
    })
    test('emits closed event on monthpicker close', () => {
      wrapper = createMonthPickerInstance()
      wrapper.setData({ triggerElement: document.createElement('div') })
      wrapper.vm.closeMonthpicker()
      wrapper.vm.$nextTick(function() {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
  })

  describe('gui', () => {
    test('Year shows year title', () => {
      wrapper = createMonthPickerInstance({
        value: ['January 2018', 'June 2018']
      })
      wrapper.setData({ showMonthpicker: true })

      expect(wrapper.contains('.asd__year-name')).toBe(true)
      expect(wrapper.find('.asd__year-name').text()).toContain('2017')
    })
    test('monthpicker wrapper is correct width', () => {
      wrapper = createMonthPickerInstance({
        yearsToShow: 2
      })
      wrapper.setData({ showMonthpicker: true })

      let dWrapper = wrapper.find(monthpickerWrapper)
      expect(dWrapper.element.style.width).toBe(wrapper.vm.monthpickerWidth + 'px')
    })
    test('selected month get selected class', () => {
      wrapper = createMonthPickerInstance({
        value: ['January 2018', 'May 2018']
      })
      wrapper.setData({ showMonthpicker: true })
      expect(wrapper.contains('.asd__month-item--selected')).toBe(true)
      expect(wrapper.findAll('.asd__month-item--selected').length).toBe(2)
      expect(wrapper.contains('.asd__month-item--in-range')).toBe(true)
      expect(wrapper.findAll('.asd__month-item--in-range').length).toBe(3)
    })
    test('is fullscreen on mobile', () => {
      wrapper = createMonthPickerInstance({
        fullscreenMobile: true,
        monthsToShow: 2
      })
      wrapper.vm.isMobile = true
      wrapper.vm.viewportWidth = '650px'
      wrapper.setData({ showMonthpicker: true })

      let dWrapper = wrapper.find(monthpickerWrapper)
      expect(dWrapper.classes()).toContain('asd__wrapper--full-screen')
    })
    test('disabled months are not selectable', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: ['January 2018', ''],
        disabledMonths: ['March 2018']
      })
      wrapper.setData({ showMonthpicker: true })
      const disabledMonth = wrapper.find('.asd__month-button[data-date="2018-03"]')
      expect(disabledMonth.classes()).toContain('asd__month-button--disabled')
      disabledMonth.trigger('click')
      expect(wrapper.vm.selectedDate1).not.toEqual(startOfMonth(parse('2018-03')))
      expect(wrapper.vm.selectedDate1).toEqual(startOfMonth(parse('2018-01')))
    })
    test('month are set if user types a valid date in input', () => {
      wrapper = createMonthPickerInstance({
        mode: 'single',
        value: ['January 2018', '']
      })
      wrapper.setData({ showMonthpicker: true })
      wrapper.vm.handleTriggerInput({ target: { value: '2018-01' } })
      expect(parse(wrapper.vm.selectedDate1)).toEqual(parse('2018-01'))
    })
  //   // test('opens monthpicker on focus', () => {
  //   //   wrapper = createMonthPickerInstance({
  //   //     mode: 'single',
  //   //     dateOne: '',
  //   //     openOnFocus: true
  //   //   })
  //   //   wrapper.vm.triggerElement.trigger('focus')
  //   //   expect(wrapper.classes()).toContain('monthpicker-open')
  //   // })
  })
})
