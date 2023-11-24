import { convertFile, getVideoDuration } from './file';
import { Movie } from '@/interfaces';
import { Category } from '@/types';
import {
  DEFAULT_USER_ID,
  DEFAULT_FAVORITES,
  DEFAULT_INCOMPLETENESS,
  DEFAULT_RATING,
} from '@/constants';

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

  return file.size > 0 ? await convertFile(file) : defaultValue;
};

/**
 * Extract form data from a FormData object and convert it into a structured ProjectForm object.
 * @param {FormData} formData - The FormData object containing the form input values.
 * @returns {ProjectFormInputs} The structured form data.
 */
export const extractFormData = async (formData: FormData): Promise<Movie> => {
  const imgBase64 = await getOptionalFile(formData, 'image');
  const videoBase64 = await getOptionalFile(formData, 'video');

  let duration = '';
  const inputVideoElement = document.getElementById('video');

  if (inputVideoElement) {
    const video = await getVideoDuration(inputVideoElement as HTMLInputElement);

    if (video.length && video[0].duration) {
      duration = video[0].duration;
    }
  }

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

  return {
    id: DEFAULT_USER_ID,
    title: extractValue(formData, 'title'),
    image: imgBase64,
    category: formData.get('category') as Category,
    type: extractValue(formData, 'type'),
    release: yearOfReleaseNumber,
    rating: DEFAULT_RATING,
    video: videoBase64,
    duration: duration,
    isTrending: isTrending,
    description: extractValue(formData, 'description'),
    favorites: DEFAULT_FAVORITES,
    incompleteness: DEFAULT_INCOMPLETENESS,
  };
};
