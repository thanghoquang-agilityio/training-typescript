const MAX_SIZE_IMAGE = 1024 * 1024; // 1MB
const EXTENSIONS_IMAGE: string[] = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];

const MAX_SIZE_VIDEO = 5 * 1024 * 1024; // 5MB
const EXTENSIONS_VIDEO: string[] = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm'];

const MEDIA_FILE_TYPE = {
  image: 'image',
  video: 'video',
};

export { MAX_SIZE_IMAGE, EXTENSIONS_IMAGE, MAX_SIZE_VIDEO, EXTENSIONS_VIDEO, MEDIA_FILE_TYPE };
