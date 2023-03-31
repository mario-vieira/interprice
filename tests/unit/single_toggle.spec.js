import {shallowMount} from '@vue/test-utils'
import SingleToggle from '@/components/SingleToggle.vue'

describe('SingleToggle.vue', () => {
    const options = [
        {"title": "USD", "value": "a", "checked": true},
        {"title": "CAD", "value": "b", "checked": false},
        {"title": "EUR", "value": "c", "checked": false}
    ];
    const wrapper = shallowMount(SingleToggle, {
        propsData: {
            name: 'Test',
            options: options
        }
    })

    it('renders the correct number of buttons', () => {
        const buttons = wrapper.findAll('.btn-container')
        expect(buttons.length).toBe(3)
    })

    it('renders buttons with the correct text', () => {
        wrapper.findAll('.btn-container').wrappers.forEach((buttonContainer, index) => {
            const buttonText = buttonContainer.text()
            expect(buttonText).toBe(options[index]['title'])
        })
    })

    it('emits a change event with the correct label when a button is clicked', () => {
        const buttonIndex = 1
        const radio = wrapper.findAll('input[type="radio"]').at(buttonIndex)

        radio.trigger('click')

        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')[0][0]).toBe(options[buttonIndex]['value'])
    })
})