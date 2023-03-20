const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

export const bytesToSize = (bytes) => {
  if (!bytes) {
    return '0 Byte';
  }
  const index = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, index))} ${sizes[index]}`;
};
