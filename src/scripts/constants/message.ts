export const MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidFile: (field: string) => `${field} must be a image file`,
  invalidNumber: (field: string, min: number, max: number) =>
    `${field} must be between from ${min} to ${max}`,
};

export const CONFIRM_MESSAGES = {
  create: 'Do you want to create this movie?',
  update: 'Do you want to update this movie?',
  delete: 'Do you want to delete this movie?',
};
