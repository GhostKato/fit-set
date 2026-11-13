export const AUDIO_EXTENSIONS_REGEX =
  /\.(mp3|m4a|aac|wav|ogg|flac|opus|webm)$/i;

export const formatTrackTitle = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};
