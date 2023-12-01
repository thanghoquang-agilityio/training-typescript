import stringHelper from './string';

import {
  FORM_INPUTS,
  MEDIA_FILE_TYPE,
  VALIDATION_MESSAGES,
  MAX_SIZE_IMAGE,
  MAX_SIZE_VIDEO,
  EXTENSIONS_IMAGE,
  EXTENSIONS_VIDEO,
  MIN_YEAR,
  MAX_YEAR,
} from '@/constants';

import { IMovie } from '@/interfaces';

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
 * Validates if a field has a non-empty value.
 * @param {HTMLElement} form - The element form need be validated.
 * @returns {boolean}
 */
const validateForm = (form: HTMLElement): boolean => {
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

  if (!combinedList.length) {
    return isValidData;
  }

  combinedList.forEach((input, index) => {
    const rules = input.getAttribute('rules')?.split(',');
    const field = input.name;
    const fieldName = stringHelper.convertSnakeToCapitalize(field);

    if (!rules || !rules.length) {
      return isValidData;
    }

    switch (input.type) {
      case FORM_INPUTS.file: {
        const isRequired = input.files && !input.files.length && rules.includes('required');

        if (isRequired) {
          setError(errorList[index], VALIDATION_MESSAGES.required(fieldName));

          isValidData = false;
          break;
        }

        let isOverSize = false;
        let isValidTypeFile = false;
        const isBypassValidation = rules.includes('required');

        switch (field) {
          case MEDIA_FILE_TYPE.image: {
            isOverSize = checkInvalidSizeFile(form, MEDIA_FILE_TYPE.image, MAX_SIZE_IMAGE);

            isValidTypeFile = checkInvalidExtensionFile(
              form,
              MEDIA_FILE_TYPE.image,
              EXTENSIONS_IMAGE,
            );

            break;
          }

          case MEDIA_FILE_TYPE.video: {
            isOverSize = checkInvalidSizeFile(form, MEDIA_FILE_TYPE.video, MAX_SIZE_VIDEO);

            isValidTypeFile = checkInvalidExtensionFile(
              form,
              MEDIA_FILE_TYPE.video,
              EXTENSIONS_VIDEO,
            );

            break;
          }
        }

        if (isBypassValidation && !isValidTypeFile) {
          setError(errorList[index], VALIDATION_MESSAGES.invalidExtensionOfFile(fieldName));

          isValidData = false;
          break;
        }

        if (isBypassValidation && isOverSize) {
          setError(errorList[index], VALIDATION_MESSAGES.invalidSizeOfFile(fieldName));

          isValidData = false;
          break;
        }

        break;
      }

      case FORM_INPUTS.number: {
        const isRequired = !input.value.trim() && rules.includes('required');

        if (isRequired) {
          setError(errorList[index], VALIDATION_MESSAGES.required(fieldName));

          isValidData = false;
          break;
        }

        const isValidNumber = checkInvalidYearRelease(input, MIN_YEAR, MAX_YEAR);

        if (isValidNumber) {
          setError(
            errorList[index],
            VALIDATION_MESSAGES.invalidNumber(fieldName, MIN_YEAR, MAX_YEAR),
          );
          isValidData = false;
          break;
        }

        break;
      }

      case FORM_INPUTS.text:
      case FORM_INPUTS.textarea: {
        const isRequired = !input.value.trim() && rules.includes('required');

        if (isRequired) {
          setError(errorList[index], VALIDATION_MESSAGES.required(fieldName));
          isValidData = false;
        }

        break;
      }
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
