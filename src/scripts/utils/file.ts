import { CustomFile } from '@/interfaces';
import { formatDuration } from './string';

/**
 * Converts a File object to a Base64 string.
 *
 * This function reads the contents of the provided File and returns its data as a Base64-encoded string.
 *
 * @param {File} file - The File object to be converted.
 * @returns {Promise<string>} A Promise that resolves with the Base64-encoded string.
 */
export const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();

    // Event listener for when the FileReader finishes reading the file
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        // Extract the Base64 data from the FileReader result
        const base64Data = event.target.result as string;
        resolve(base64Data);
      }
    };

    // Start reading the file as a data URL (Base64)
    reader.readAsDataURL(file);
  });

export const getVideoDuration = (inputVideoElement: HTMLInputElement): Promise<CustomFile[]> => {
  return new Promise((resolve) => {
    const myVideos: CustomFile[] = [];
    const files: FileList | null = inputVideoElement.files;

    if (!files || !files[0]) {
      resolve(myVideos);
    } else {
      const currentFile = files[0] as CustomFile;

      myVideos.push(files[0] as CustomFile);

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);

        const duration = video.duration;

        if (myVideos.length > 0) {
          myVideos[myVideos.length - 1].duration = formatDuration(duration);
          resolve(myVideos);
        }
      };

      video.src = URL.createObjectURL(currentFile);
    }
  });
};