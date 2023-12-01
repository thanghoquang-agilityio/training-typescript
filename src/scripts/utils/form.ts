import fileHelper from './file';

import { Category } from '@/types';
import { IMovieOptionalField } from '@/interfaces';

/**
 * Extract value from input.
 * @param {FormData} formData - The FormData object containing the form input values.
 * @param {string} key - id of input
 * @returns {string} value of input.
 */
const extractValue = (formData: FormData, key: string): string => {
  const element = formData.get(key) as string;

  if (formData && element) {
    return element.trim();
  }

  return '';
};

/**
 * Extract file from input.
 * @param {FormData} formData - The FormData object containing the form input values.
 * @param {string} key - id of input
 * @param {string} defaultValue - default value of file
 * @returns {Promise<string>} value of input.
 */
const getOptionalFile = async (
  formData: FormData,
  key: string,
  defaultValue: string = '',
): Promise<string> => {
  const file = formData.get(key) as File;

  return file.size > 0 ? await fileHelper.convertFile(file) : defaultValue;
};

/**
 * Extract form data from a FormData object and convert it into a structured ProjectForm object.
 * @param {FormData} formData - The FormData object containing the form input values.
 * @returns {ProjectFormInputs} The structured form data.
 */
const extractFormData = async (formData: FormData): Promise<IMovieOptionalField> => {
  const yearOfReleaseString = formData.get('year-of-release') as string;
  let yearOfReleaseNumber = new Date().getFullYear();

  if (yearOfReleaseString) {
    yearOfReleaseNumber = parseInt(yearOfReleaseString);
  }

  // TODO: Update score instead of is trending
  const isTrendingString = formData.get('is-trending') as string;
  let isTrending = true;

  if (isTrendingString) {
    isTrending = isTrendingString === 'yes';
  }

  const movie: IMovieOptionalField = {
    title: extractValue(formData, 'title'),
    category: formData.get('category') as Category,
    type: extractValue(formData, 'type'),
    release: yearOfReleaseNumber,
    isTrending: isTrending,
    description: extractValue(formData, 'description'),
  };

  const imgBase64 = await getOptionalFile(formData, 'image');

  if (imgBase64) {
    movie.image = imgBase64;
  }

  const videoBase64 = await getOptionalFile(formData, 'video');

  if (videoBase64) {
    movie.video = videoBase64;

    const inputVideoElement = document.getElementById('video');

    if (inputVideoElement) {
      const video = await fileHelper.getVideoDuration(inputVideoElement as HTMLInputElement);

      if (video.length && video[0].duration) {
        const duration = video[0].duration;

        if (duration) movie.duration = duration;
      }
    }
  }

  return movie;
};

export default extractFormData;
