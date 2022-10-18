import pkgApi from 'pkg-api';
import { exeFileKey } from 'consts/config';
import { uploadLocalFileToS3 } from 'controllers/AWS';

export default async () => {
  const outputPath = 'dist/apply-music-to-device.exe';
  await pkgApi('src/exe/index.js', {
    targets: 'node16-win',
    output: outputPath,
  });

  await uploadLocalFileToS3(outputPath, exeFileKey);
};
