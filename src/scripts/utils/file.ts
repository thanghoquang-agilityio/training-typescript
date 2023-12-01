import { IVideoFile } from '@/interfaces';

/**
 * Converts a File object to a Base64 string.
 * This function reads the contents of the provided File and returns its data as a Base64-encoded string.
 * @param {File} file - The File object to be converted.
 * @returns {Promise<string>} A Promise that resolves with the Base64-encoded string.
 */
const convertFile = (file: File): Promise<string> =>
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

/**
 * Get duration of video in File object.
 * This function reads the contents of the provided File and returns duration.
 * @param {HTMLInputElement} inputVideoElement - The File object to be converted.
 * @returns {Promise<IVideoFile[]>} A Promise that resolves with the custom file.
 */
const getVideoDuration = (inputVideoElement: HTMLInputElement): Promise<IVideoFile[]> =>
  new Promise((resolve) => {
    const myVideos: IVideoFile[] = [];
    const files = inputVideoElement.files;
    const hasFile = !files || !files[0];

    if (hasFile) {
      resolve(myVideos);
    } else {
      const currentFile = files[0] as IVideoFile;

      myVideos.push(currentFile);

      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);

        const duration = video.duration;
        const lastVideoNumber = myVideos.length - 1;

        if (myVideos.length) {
          myVideos[lastVideoNumber].duration = duration;

          resolve(myVideos);
        }
      };

      video.src = URL.createObjectURL(currentFile);
    }
  });

const fileHelper = {
  convertFile: convertFile,
  getVideoDuration: getVideoDuration,
};

export default fileHelper;
