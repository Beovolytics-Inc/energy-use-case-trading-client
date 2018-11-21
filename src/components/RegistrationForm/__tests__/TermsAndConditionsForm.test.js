import React from 'react';
import { shallow } from 'enzyme';
import Wizard from '../../Wizard';
import TermsAndConditionsForm from '../TermsAndConditionsForm';

function renderComponent(props = {}, mountFn = shallow) {
    return mountFn(<TermsAndConditionsForm {...props} />);
}

describe('<TermsAndConditionsForm /> component', () => {
    beforeAll(() => {
        // Prevent displaying async-validator warn messages
        jest.spyOn(console, 'warn').mockImplementation(jest.fn());
    });

    it('should render with necessary elements', () => {
        const termAndConditionsForm = renderComponent();

        expect(termAndConditionsForm.find('TextField[name="message"]')).toHaveLength(1);
        expect(termAndConditionsForm.find('Checkbox[name="agbApproval"]')).toHaveLength(1);
        expect(termAndConditionsForm.find('Checkbox[name="enableNotifications"]')).toHaveLength(1);
        expect(termAndConditionsForm.find('Captcha')).toHaveLength(1);
    });

    it('should handle captcha verifying', () => {
        const setFormData = jest.fn();
        const termsAndConditionsForm = renderComponent({ setFormData });
        termsAndConditionsForm
            .find('Captcha')
            .props()
            .onVerify('abc');

        expect(setFormData).toHaveBeenCalledWith({ googleReCaptchaResponse: 'abc' });
    });

    it('should reset captcha value when component is unmounted', () => {
        const setFormData = jest.fn();
        const termsAndConditionsForm = renderComponent({ setFormData });
        termsAndConditionsForm.unmount();

        expect(setFormData).toHaveBeenCalledWith({ googleReCaptchaResponse: '' });
    });

    it('should validate all form fields', () => {
        const termAndConditionsForm = renderComponent();

        termAndConditionsForm
            .find(Wizard.Content)
            .props()
            .onNextButtonClick();
        ['agbApproval', 'googleReCaptchaResponse'].forEach(property => {
            expect(termAndConditionsForm.state().errors).toHaveProperty(property);
        });

        termAndConditionsForm.setProps({
            formData: { message: 'test', agbApproval: true, enableNotifications: true, googleReCaptchaResponse: 'abc' }
        });
        termAndConditionsForm
            .find(Wizard.Content)
            .props()
            .onNextButtonClick();
        expect(termAndConditionsForm.state().errors).toEqual({});
    });
});