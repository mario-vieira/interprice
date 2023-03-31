import {shallowMount} from '@vue/test-utils'
import InterPriceTable from '@/components/InterPriceTable.vue'
import data from '../assets/data.json'

describe('InterPriceTable.vue', () => {
    const minimumValues = {
        "5":{"FIX":50},
        "10":{"FIX":75,"FRN":94},
        "40":{"FIX":130,"FRN":128}
    }
    const notSelectedMetrics = ["Yield","3MLSpread"];
    const years = [
        {"value":5,"title":"5 YRS","checked":true},
        {"value":10,"title":"10 YRS","checked":true},
        {"value":40,"title":"40 YRS","checked":true}
    ]

    const wrapper = shallowMount(InterPriceTable, {
        propsData: {
            items: data.Items,
            minimumValues: minimumValues,
            notSelectedMetrics: notSelectedMetrics,
            selectedMetric:"Spread",
            sortBy:"DateSent",
            sortOrder:"desc",
            years: years
        }
    })
    it('renders the correct number of headers', () => {
        const headers = wrapper.findAll('table thead tr')
        expect(headers.wrappers.length).toBe(2)
        expect(headers.wrappers[0].findAll('th').length).toBe(3 + years.length)
        expect(headers.wrappers[1].findAll('th').length).toBe(2 * years.length)
    })

    it('renders the correct number of rows', () => {
        const rows = wrapper.findAll('table tbody')
        expect(rows.wrappers.length).toBe(data.Items.length)
    })

    it('renders the correct number of column in the footer', () => {
        const footerColumns = wrapper.findAll('table tfoot tr td')
        expect(footerColumns.wrappers.length).toBe(3 + (2 * years.length))
    })

    it('emits a sortChanged event when a sortable column is clicked', () => {
        const sortableColumns = wrapper.findAll('th .is-clickable')

        sortableColumns.wrappers.forEach((columnWrapper, index) => {
            const columnText = columnWrapper.text()
            columnWrapper.trigger('click')
            expect(columnWrapper.emitted('sortChanged')).toBeTruthy()
            const emittedData = columnWrapper.emitted('change')[0][0]
            expect(emittedData === columnText).toBeTruthy()
        })
    })
})
