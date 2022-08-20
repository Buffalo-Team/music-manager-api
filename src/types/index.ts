export interface IMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size?: number;
  key?: string;
  location?: string;
}
