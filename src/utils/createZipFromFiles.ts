import { forEach, map } from 'lodash';
import Admz from 'adm-zip';
import { Readable } from 'stream';
import streamToBuffer from './streamToBuffer';

interface IFileData {
  name: string;
  Body: Readable;
}

export default async (files: IFileData[]) => {
  const filesBuffers = await Promise.all(
    map(files, ({ Body }) => streamToBuffer(Body))
  );

  const zp = new Admz();
  forEach(filesBuffers, (buffer, index) => {
    zp.addFile(files[index].name, buffer);
  });

  return zp.toBuffer();
};
