export default (bytes: number): number =>
  Math.round((bytes / 1024 / 1024) * 10) / 10;
