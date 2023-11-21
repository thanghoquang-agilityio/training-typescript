import { FORM_INPUT, MESSAGES } from '@/constants';
import { snakeToStringAndCapitalize } from './string';

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
      const rules = input.name.split(',');
      let field = '';

      if (rules.length) {
        field = rules[0];

        let isRequired: boolean | undefined = false;
        const fieldName = snakeToStringAndCapitalize(field);

        switch (input.type) {
          case FORM_INPUT.file:
            isRequired =
              input.files && !input.files.length && rules.includes('required') ? true : false;

            if (isRequired) {
              setError(errorList[index], MESSAGES.required(fieldName));
              isValidData = false;
            }

            break;

          case FORM_INPUT.number:
            isRequired = !input.value.trim() && rules.includes('required') ? true : false;

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

function setError(element: HTMLElement, message: string) {
  element.textContent = message;
}

export function resetErrors(form: HTMLElement) {
  const emptyError = '';
  const errorList = form.querySelectorAll<HTMLElement>('.input-error');

  if (errorList.length) {
    errorList.forEach((element) => {
      setError(element, emptyError);
    });
  }
}
