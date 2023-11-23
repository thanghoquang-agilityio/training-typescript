export const convertSnakeToCamel = (text: string): string => {
  if (typeof text !== 'string' || !text.trim()) {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
};

export const convertSnakeToCapitalize = (text: string): string => {
  if (typeof text !== 'string' || !text.trim()) {
    return '';
  }

  let newText = text
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) => group.replace('-', ' ').replace('_', ' '));
  return newText.charAt(0).toUpperCase() + newText.slice(1);
};

export const formatDuration = (seconds: number): string => {
  const oneMinute = 60;
  const oneHour = 60 * oneMinute;

  const hours = Math.floor(seconds / oneHour);
  const minutes = Math.floor((seconds % oneHour) / oneMinute);
  const remainingSeconds = Math.floor(seconds % oneMinute);

  const formattedHours = hours > 0 ? `${hours}h ` : '';
  const formattedMinutes = minutes > 0 ? `${minutes.toString().padStart(2, '0')}m ` : '';
  const formattedSeconds =
    remainingSeconds > 0 ? `${remainingSeconds.toString().padStart(2, '0')}s` : '';

  if (hours > 0) {
    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  } else if (minutes > 0) {
    return `${formattedMinutes}${formattedSeconds}`;
  } else {
    return `${formattedSeconds}`;
  }
};
