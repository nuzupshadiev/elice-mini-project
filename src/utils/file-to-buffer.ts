import { Buffer } from 'buffer';

export function convertFileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function(event: ProgressEvent<FileReader>) {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const buffer = Buffer.from(arrayBuffer);
          resolve(buffer);
      };

      reader.onerror = function(err: ProgressEvent<FileReader>) {
          reject(err);
      };

      reader.readAsArrayBuffer(file);
  });
}

