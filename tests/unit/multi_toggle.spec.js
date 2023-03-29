import {shallowMount} from '@vue/test-utils'
import MultiToggle from '@/components/MultiToggle.vue'

describe('MultiToggle.vue', () => {
    it('renders the correct number of buttons', () => {
        const options = [
            {"title": "5 YRS", "value": 5, "checked": true},
            {"title": "10 YRS", "value": 10, "checked": true}
        ]
        const wrapper = shallowMount(MultiToggle, {
            propsData: {
                options: options
            }
        })

        const buttons = wrapper.findAll('.btn-container')
        expect(buttons.length).toBe(2)
    })
})

describe('MultiToggle.vue', () => {
    it('renders buttons with the correct text', () => {
        const options = [
            {"title": "5 YRS", "value": 5, "checked": true},
            {"title": "10 YRS", "value": 10, "checked": true}
        ]
        const wrapper = shallowMount(MultiToggle, {
            propsData: {
                options: options
            }
        })

        wrapper.findAll('.btn-container').wrappers.forEach((buttonContainer, index) => {
            const buttonText = buttonContainer.text()
            expect(buttonText).toBe(options[index]['title'])
        })
    })
})

describe('MultiToggle', () => {
    it('emits a change event with the checked options when a button is clicked', () => {
        const options = [
            {"title": "5 YRS", "value": 5, "checked": true},
            {"title": "10 YRS", "value": 10, "checked": true},
            {"title": "15 YRS", "value": 15, "checked": true}
        ]
        const wrapper = shallowMount(MultiToggle, {
            propsData: {
                name: 'Test',
                options: options
            }
        })

        const buttonIndex = 1
        const Input = wrapper.findAll('input[type="checkbox"]').at(buttonIndex)

        Input.trigger('click')

        expect(wrapper.emitted('change')).toBeTruthy()

        const emittedData = wrapper.emitted('change')[0][0]

        expect(emittedData.length).toBe(2)
        expect(emittedData[0]).toBe(options[0])
        expect(emittedData[1]).toBe(options[2])
    })
})