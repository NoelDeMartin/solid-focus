import { ValidationRule } from 'vuetify';

class Validations {

    public get required(): ValidationRule {
        return (value: any) => !!value || 'This field is required';
    }

    public minLength(length: number): ValidationRule {
        return (value: any) =>
            (value && value.length >= length) ||
                `This field must be more than ${length} characters long`;
    }

    public maxLength(length: number): ValidationRule {
        return (value: any) =>
            (value && value.length <= length) ||
                `This field must be less than ${length} characters long`;
    }

}

export default new Validations();
