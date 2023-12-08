import stringHelper from './string';

import {
  VALIDATION_MESSAGES,
  MAX_SIZE_IMAGE,
  MAX_SIZE_VIDEO,
  EXTENSIONS_IMAGE,
  EXTENSIONS_VIDEO,
  MIN_YEAR,
  MAX_YEAR,
} from '@/constants';

import { IMovie } from '@/interfaces';
import { TypeOfMediaFile, TypeOfInput, ValidationFileCase, ValidationFormCase } from '@/types';

/**
 * Set error for field.
 * @param {HTMLElement} element - The element form need be validated.
 * @param {string} message error.
 */
const setError = (element: HTMLElement, message: string) => {
  element.textContent = message;
};

/**
 * Reset default value for all field.
 * @param {HTMLElement} form - The element form need be validated.
 */
const resetErrors = (form: HTMLElement) => {
  const emptyError = '';
  const errorList = form.querySelectorAll<HTMLElement>('.input-error');

  if (errorList.length) {
    errorList.forEach((element) => {
      setError(element, emptyError);
    });
  }
};

/**
 * Check number invalid.
 * @param {HTMLInputElement} input - this input have type number.
 * @returns {boolean}
 */
const checkInvalidYearRelease = (input: HTMLInputElement, min: number, max: number): boolean => {
  const inputValue = parseInt(input.value.trim());

  return inputValue < min || inputValue > max;
};

/**
 * Check size file is invalid.
 * @param {HTMLElement} form - The element form need be validated.
 * @param {string} mediaType - The type of file need be validated.
 * @param {number} maxSize - The largest size of the file.
 * @returns {boolean}
 */
const checkInvalidSizeFile = (form: HTMLElement, mediaType: string, maxSize: number): boolean => {
  const formData = new FormData(form as HTMLFormElement);
  const file = formData.get(mediaType) as File;

  return file.size > maxSize;
};

/**
 * Check extension file is invalid.
 * @param {HTMLElement} form - The element form need be validated.
 * @param {string} mediaType - The type of file need be validated.
 * @param {string[]} extensionList - The list of suitable file extensions.
 * @returns {boolean}
 */
const checkInvalidExtensionFile = (
  form: HTMLElement,
  mediaType: string,
  extensionList: string[],
): boolean => {
  const formData = new FormData(form as HTMLFormElement);
  const file = formData.get(mediaType) as File;
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

  return extensionList.includes(fileExtension);
};

/**
 * Set validation file case
 * @param {TypeOfMediaFile} type - type of file.
 * @param {HTMLElement} form - The element form need be validated.
 * @returns {ValidationFileCase}
 */
const setValidationInputMediaFile = (
  type: TypeOfMediaFile,
  form: HTMLElement,
): ValidationFileCase => {
  const ValidationFile = {
    image: () => {
      const validationFileCase: ValidationFileCase = {
        isOverSize: checkInvalidSizeFile(form, type, MAX_SIZE_IMAGE),
        isValidKind: checkInvalidExtensionFile(form, type, EXTENSIONS_IMAGE),
      };

      return validationFileCase;
    },
    video: () => {
      const validationFileCase: ValidationFileCase = {
        isOverSize: checkInvalidSizeFile(form, type, MAX_SIZE_VIDEO),
        isValidKind: checkInvalidExtensionFile(form, type, EXTENSIONS_VIDEO),
      };

      return validationFileCase;
    },
  };

  return ValidationFile[type]();
};

/**
 * Validates input file in form
 * @param {HTMLElement} form - The element form need be validated.
 * @param {HTMLInputElement} input - The element input need be validated.
 * @param {string[]} rules - The rules need validate
 * @returns {string} error message
 */
const validateInputMediaFile = (
  form: HTMLElement,
  input: HTMLInputElement,
  rules: string[],
): string => {
  const fieldName = stringHelper.convertSnakeToCapitalize(input.name);
  const isRequired = input.files && !input.files.length && rules.includes('required');

  if (isRequired) return VALIDATION_MESSAGES.required(fieldName);

  const isValidation = rules.includes('required');
  const validationFileCase = setValidationInputMediaFile(input.name as TypeOfMediaFile, form);
  const isValidKind = validationFileCase.isValidKind;
  const isOverSize = validationFileCase.isOverSize;

  if (isValidation && !isValidKind) return VALIDATION_MESSAGES.invalidExtensionOfFile(fieldName);

  if (isValidation && isOverSize) return VALIDATION_MESSAGES.invalidSizeOfFile(fieldName);

  return '';
};

/**
 * Validates input file in form
 * @param {HTMLInputElement} input - The element input need be validated.
 * @param {string[]} rules - The rules need validate
 * @returns {string} error message
 */
const validateInputNumber = (input: HTMLInputElement, rules: string[]): string => {
  const fieldName = stringHelper.convertSnakeToCapitalize(input.name);
  const isRequired = !input.value.trim() && rules.includes('required');

  if (isRequired) return VALIDATION_MESSAGES.required(fieldName);

  const isValidNumber = checkInvalidYearRelease(input, MIN_YEAR, MAX_YEAR);

  if (isValidNumber) return VALIDATION_MESSAGES.invalidNumber(fieldName, MIN_YEAR, MAX_YEAR);

  return '';
};

/**
 * Set validation form
 * @param {TypeOfInput} type - type of input.
 * @param {HTMLElement} form - The element form need be validated.
 * @param {HTMLInputElement} input - The element input need be validated.
 * @param {string[]} rules - The rules need validate
 * @returns {string} error
 */
const setValidationForm = (
  type: TypeOfInput,
  form: HTMLElement,
  input: HTMLInputElement,
  rules: string[],
): string => {
  const ValidationForm = {
    file: () => validateInputMediaFile(form, input, rules),
    number: () => validateInputNumber(input, rules),
    default: (): string => {
      const fieldName = stringHelper.convertSnakeToCapitalize(input.name);
      const isRequired = !input.value.trim() && rules.includes('required');

      if (isRequired) {
        return VALIDATION_MESSAGES.required(fieldName);
      }

      return '';
    },
  };

  return ValidationForm[type as ValidationFormCase]
    ? ValidationForm[type as ValidationFormCase]()
    : ValidationForm.default();
};

/**
 * Validates if a field has a non-empty value.
 * @param {HTMLElement} form - The element form need be validated.
 * @returns {boolean}
 */
const validateForm = (form: HTMLElement): boolean => {
  const textareaList = Array.from(form.querySelectorAll<HTMLInputElement>('textarea'));
  const inputList = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
  const errorList = form.querySelectorAll<HTMLElement>('.input-error');
  const combinedList = textareaList.length > 0 ? inputList.concat(textareaList) : inputList;
  let isValidData = true;

  if (!combinedList.length) {
    return isValidData;
  }

  combinedList.forEach((input, index) => {
    const rules = input.getAttribute('rules')?.split(',');
    const type = input.type as TypeOfInput;

    if (!rules || !rules.length) {
      return isValidData;
    }

    const error = setValidationForm(type, form, input, rules);

    if (error) {
      setError(errorList[index], error);
      isValidData = false;
    }
  });

  return isValidData;
};

/**
 * Validates all field in Movie object
 * @param {IMovie} dataMovie - The data in api need be validated.
 * @returns {IMovie}
 */
const validateMovieResponse = (dataMovie: IMovie): IMovie => {
  const movie = {
    id: dataMovie.id || 0,
    title: dataMovie.title || 'Title',
    image: dataMovie.image || './images/default.png',
    category: dataMovie.category || 'movies',
    type: dataMovie.type || 'This is default type ',
    release: dataMovie.release || new Date().getFullYear(),
    rating: dataMovie.rating || 0,
    video: dataMovie.video || '#',
    duration: dataMovie.duration || 0,
    description: dataMovie.description || 'This is default description',
    isTrending: dataMovie.isTrending || false,
    favorites: dataMovie.favorites || [],
    incompleteness: dataMovie.incompleteness || [],
  };

  return movie;
};

export { resetErrors, validateForm, validateMovieResponse };
