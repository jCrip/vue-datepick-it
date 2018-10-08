import { shallow, createLocalVue } from '@vue/test-utils'
import DatepickIt from '@/components/DatepickIt'
import ClickOutside from '@/directives/ClickOutside'
import TestHelpers from 'test/test-helpers'
import parse from 'date-fns/parse'
let h

const localVue = createLocalVue()
localVue.directive('click-outside', ClickOutside)
const createDatePickItInstance = (propsData, options) => {
  if (!propsData) {
    propsData = {
      value: ['2018-01-10', '2018-01-13'],
      monthsToShow: 2
    }
  }
  if (!options) {
    options = {}
  }
  const component = {
    ...DatepickIt,
    ...options
  }
  const wrapper = shallow(component, {
    localVue,
    propsData
  })
  h = new TestHelpers(wrapper, expect)
  return wrapper
}
const datepickerWrapper = '.asd__wrapper'
let wrapper

describe('DatepickIt', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('lifecycle hooks', () => {
    test('creates correct amount of months', () => {
      wrapper = createDatePickItInstance()
      expect(wrapper.vm.months.length).toEqual(wrapper.props().monthsToShow + 2)
    })
    test('dates are set when initial values are passed', () => {
      wrapper = createDatePickItInstance({
        value: ['2018-01-10', '2018-01-13']
      })
      expect(wrapper.vm.selectedDate1).toEqual(wrapper.props().value[0])
      expect(wrapper.vm.selectedDate2).toEqual(wrapper.props().value[1])
    })

    test('sunday is first day, if specified', () => {
      wrapper = createDatePickItInstance(null, { sundayFirst: true })
      expect(wrapper.vm.days[0]).toBe('Sunday')
    })
  })

  describe('computed', () => {
    test('datesSelected() works', () => {
      wrapper = createDatePickItInstance({
        mode: 'range',
        value: '2018-01-10'
      })
      expect(wrapper.vm.datesSelected).toEqual(true)
    })
    test('allDatesSelected() works', () => {
      wrapper = createDatePickItInstance({
        mode: 'range',
        value: ['2018-01-10', '']
      })
      expect(wrapper.vm.allDatesSelected).toEqual(false)
    })
  })

  describe('methods', () => {
    test('getMonth() returns correct values', () => {
      let month = wrapper.vm.getMonth('2017-12-01')
      expect(month.monthName).toBe('December')
      expect(month.weeks.length).toBeGreaterThan(0)
    })
    test('getWeeks() returns correct values', () => {
      let weeks = wrapper.vm.getWeeks('2017-12-01')
      expect(weeks.length).toEqual(5)
    })
    test('setHoverDate() sets correct value', () => {
      const wrapper = createDatePickItInstance()
      wrapper.vm.setHoverDate('2017-12-12')
      expect(wrapper.vm.hoverDate).toBe('2017-12-12')
    })
    test('isSelected() works', () => {
      wrapper = createDatePickItInstance({
        mode: 'single',
        value: '2018-01-10'
      })
      expect(wrapper.vm.isSelected('2017-12-11')).toEqual(false)
      expect(wrapper.vm.isSelected(wrapper.props().value)).toEqual(true)
    })
    test('previousMonth adds month first', () => {
      const firstMonth = wrapper.vm.months[1]
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.previousMonth()
      expect(wrapper.vm.months[0].monthName).not.toEqual(firstMonth.monthName)
    })
    test('nextMonth adds month last', () => {
      const lastMonth = wrapper.vm.months[wrapper.vm.months.length - 1]
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.nextMonth()
      expect(wrapper.vm.months[0].monthName).not.toEqual(lastMonth.monthName)
    })
    test('closeDatepicker sets correct value', () => {
      wrapper.setData({
        triggerElement: document.createElement('div'),
        showDatepicker: true
      })
      wrapper.vm.closeDatepicker()
      expect(wrapper.vm.showDatepicker).toBe(false)
    })
    test('date is in range', () => {
      wrapper = createDatePickItInstance({
        value: ['2018-02-20', '2018-02-26']
      })
      expect(wrapper.vm.isInRange('2018-03-22')).toBe(false)
      expect(wrapper.vm.isInRange('2018-02-22')).toBe(true)
    })
    test('event is emitted when selecting date', () => {
      wrapper = createDatePickItInstance({
        mode: 'range',
        value: ['', '']
      })
      const dateOne = '2018-01-10'
      const dateTwo = '2018-02-10'
      wrapper.vm.selectDate(dateOne)
      wrapper.vm.selectDate(dateTwo)
      wrapper.vm.$nextTick(function() {
        expect(wrapper.vm.selectedDate1).toEqual(dateOne)
      })
    })
    test('month of minDate is shown first', () => {
      wrapper = createDatePickItInstance({ minDate: '2018-06-14', value: ['','']})
      const firstVisibleMonth = wrapper.vm.months[0]
      expect(firstVisibleMonth.monthNumber).toBe(5)
    })
    test('emits closed event on datepicker close', () => {
      wrapper = createDatePickItInstance()
      wrapper.setData({ triggerElement: document.createElement('div') })
      wrapper.vm.closeDatepicker()
      wrapper.vm.$nextTick(function() {
        expect(wrapper.emitted().closed).toBeTruthy()
      })
    })
  })

  describe('gui', () => {
    test('months shows month and year', () => {
      wrapper = createDatePickItInstance({
        value: ['2018-02-20', '2018-02-26']
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.asd__month-name')).toBe(true)
      expect(wrapper.find('.asd__month-name').text()).toContain('January 2018')
    })
    test('datepicker wrapper is correct width', () => {
      wrapper = createDatePickItInstance({
        value: ['2018-02-20', '2018-02-26'],
        monthsToShow: 2
      })
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.element.style.width).toBe(wrapper.vm.datepickerWidth + 'px')
    })
    test('selected date get selected class', () => {
      wrapper = createDatePickItInstance({
        value: ['2017-12-10', '2017-12-15']
      })
      wrapper.setData({ showDatepicker: true })

      expect(wrapper.contains('.asd__day--selected')).toBe(true)
      expect(wrapper.findAll('.asd__day--selected').length).toBe(2)
      expect(wrapper.contains('.asd__day--in-range')).toBe(true)
      expect(wrapper.findAll('.asd__day--in-range').length).toBe(4)
    })
    test('is fullscreen on mobile', () => {
      wrapper = createDatePickItInstance({
        value: ['2017-12-10', '2017-12-15'],
        fullscreenMobile: true,
        monthsToShow: 2
      })
      wrapper.vm.isMobile = true
      wrapper.vm.viewportWidth = '650px'
      wrapper.setData({ showDatepicker: true })

      let dWrapper = wrapper.find(datepickerWrapper)
      expect(dWrapper.classes()).toContain('asd__wrapper--full-screen')
    })
    test('disabled dates are not selectable', () => {
      wrapper = createDatePickItInstance({
        mode: 'single',
        value: '2018-10-10',
        disabledDates: ['2018-10-20'],
        openOnFocus: true
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      const disabledDate = wrapper.find('.asd__day[data-date="2018-10-20"]')
      expect(disabledDate.classes()).toContain('asd__day--disabled')

      disabledDate.find('button').trigger('click')
      expect(wrapper.props().value[0]).not.toEqual([
        '2018-10-20'
      ])
    })
    test('date are set if user types a valid date in input', () => {
      wrapper = createDatePickItInstance({
        mode: 'single',
        value: '',
        disabledDates: ['2018-10-20']
      })
      wrapper.setData({ showDatepicker: true })
      wrapper.vm.handleTriggerInput({ target: { value: '2018-11-23' } })
      expect(wrapper.vm.selectedDate1).toEqual('2018-11-23')

      wrapper.vm.handleTriggerInput({ target: { value: '2018-10-20' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '20.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-20')

      wrapper.vm.handleTriggerInput({ target: { value: '32.10.2018' } })
      expect(wrapper.vm.selectedDate1).not.toEqual('2018-10-32')
    })
    test('opens datepicker on focus', () => {
      wrapper = createDatePickItInstance({
        mode: 'single',
        value: '',
        openOnFocus: true
      })
      wrapper.vm.triggerElement.dispatchEvent(new Event('focus'))
      wrapper.update()
      expect(wrapper.classes()).toContain('asd__wrapper')
    })
  })
})