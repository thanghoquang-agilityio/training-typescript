import { FORM_INPUT, MESSAGES } from '@/constants';
import { convertSnakeToCapitalize } from './string';

/**
 * Set error for field.
 * @param {HTMLElement} element - The element form need be validated.
 * @param {string} message error.
 */
function setError(element: HTMLElement, message: string) {
  element.textContent = message;
}

/**
 * Reset default value for all field.
 * @param {HTMLElement} form - The element form need be validated.
 */
export function resetErrors(form: HTMLElement) {
  const emptyError = '';
  const errorList = form.querySelectorAll<HTMLElement>('.input-error');

  if (errorList.length) {
    errorList.forEach((element) => {
      setError(element, emptyError);
    });
  }
}

/**
 * Validates if a field has a non-empty value.
 * @param {HTMLElement} form - The element form need be validated.
 */
export function validateForm(form: HTMLElement) {
  const textareaList = form.querySelectorAll<HTMLInputElement>('textarea');
  const inputList = form.querySelectorAll<HTMLInputElement>('input');
  const errorList = form.querySelectorAll<HTMLElement>('.input-error');
  let combinedList = [];
  let isValidData = true;

  if (textareaList.length > 0) {
    combinedList = Array.from(inputList).concat(Array.from(textareaList));
  } else {
    combinedList = Array.from(inputList);
  }

  if (combinedList.length) {
    combinedList.forEach((input, index) => {
      const rules = input.getAttribute('rules')?.split(',');
      const field = input.name;

      if (rules && rules.length) {
        let isRequired: boolean | undefined = false;
        const fieldName = convertSnakeToCapitalize(field);

        switch (input.type) {
          case FORM_INPUT.file:
            isRequired = Boolean(input.files && !input.files.length && rules.includes('required'));

            if (isRequired) {
              setError(errorList[index], MESSAGES.required(fieldName));
              isValidData = false;
            }

            break;

          case FORM_INPUT.number:
            isRequired = !input.value.trim() && rules.includes('required');

            if (isRequired) {
              setError(errorList[index], MESSAGES.required(fieldName));
              isValidData = false;
            }

            const minValue = parseInt(input.min);
            const maxValue = parseInt(input.max);
            const inputValue = parseInt(input.value.trim());
            const isValidNumber = inputValue < minValue || inputValue > maxValue;

            if (isValidNumber) {
              setError(errorList[index], MESSAGES.invalidNumber(fieldName, minValue, maxValue));
              isValidData = false;
            }

          case FORM_INPUT.text:
          default:
            isRequired = !input.value.trim() && rules.includes('required');

            if (isRequired) {
              setError(errorList[index], MESSAGES.required(fieldName));
              isValidData = false;
            }

            break;
        }
      }
    });
  }

  return isValidData;
}
