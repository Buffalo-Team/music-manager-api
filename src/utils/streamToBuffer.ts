import { Stream } from 'stream';
import messages from 'consts/messages';

// Copied from https://stackoverflow.com/a/67729663
export default (stream: Stream): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const buf: any[] = [];

    stream.on('data', (chunk) => buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buf)));
    stream.on('error', () =>
      reject(new Error(messages.convertingStreamFailed))
    );
  });
