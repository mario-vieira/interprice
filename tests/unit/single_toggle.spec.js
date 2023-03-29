import {shallowMount} from '@vue/test-utils'
import SingleToggle from '@/components/SingleToggle.vue'

describe('SingleToggle.vue', () => {
    it('renders the correct number of buttons', () => {
        const options = [
            {"title": "USD", "value": "USD", "checked": true},
            {"title": "CAD", "value": "CAD", "checked": false},
            {"title": "EUR", "value": "EUR", "checked": false}
        ];
        const wrapper = shallowMount(SingleToggle, {
            propsData: {
                name: 'Test',
                options: options
            }
        })

        const buttons = wrapper.findAll('.btn-container')
        expect(buttons.length).toBe(3)
    })
})

describe('SingleToggle.vue', () => {
    it('renders buttons with the correct text', () => {
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

        wrapper.findAll('.btn-container').wrappers.forEach((buttonContainer, index) => {
            const buttonText = buttonContainer.text()
            expect(buttonText).toBe(options[index]['title'])
        })
    })
})

describe('SingleToggle', () => {
    it('emits a change event with the correct label when a button is clicked', () => {
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

        const buttonIndex = 1
        const radio = wrapper.findAll('input[type="radio"]').at(buttonIndex)

        radio.trigger('click')

        expect(radio.attributes('checked')).toBe(true);
        expect(wrapper.emitted('change')).toBeTruthy()
        expect(wrapper.emitted('change')[0][0]).toBe(options[buttonIndex]['value'])
    })
})