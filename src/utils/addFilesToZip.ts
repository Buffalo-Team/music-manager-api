import { forEach, map } from 'lodash';
import Admz from 'adm-zip';
import { Readable } from 'stream';
import streamToBuffer from './streamToBuffer';

interface IFileData {
  name: string;
  Body: Readable;
}

interface IArgs {
  downloaded: IFileData[];
  local: string[];
}

export default async (zp: Admz, { downloaded, local }: IArgs) => {
  const filesBuffers = await Promise.all(
    map(downloaded, ({ Body }) => streamToBuffer(Body))
  );

  forEach(filesBuffers, (buffer, index) => {
    zp.addFile(downloaded[index].name, buffer);
  });

  forEach(local, (filePath) => {
    zp.addLocalFile(filePath);
  });

  return zp;
};
