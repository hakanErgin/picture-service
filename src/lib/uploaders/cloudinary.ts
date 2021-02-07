const cloudinary = require('cloudinary').v2;
import { ApolloServerFileUploads } from '../index';
import getCloudinaryUploaderOptions from '../googleSecret';

function createUploadStream(fileName: string, cb: Function): any {
  return cloudinary.uploader.upload_stream(
    { public_id: fileName },
    (error: any, file: any) => cb(error, file)
  );
}

export async function singleFileUploadResolver(
  parent: any,
  { file }: { file: ApolloServerFileUploads.File }
): Promise<ApolloServerFileUploads.UploadedFileResponse> {
  const cloudinaryUploaderOptions = await getCloudinaryUploaderOptions();
  cloudinary.config(cloudinaryUploaderOptions);
  const { createReadStream, filename, mimetype, encoding } = await file;
  console.log(file);

  return new Promise((resolve, reject) => {
    const uploadStream = createUploadStream(
      filename,
      (error: any, result: any) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({
          filename,
          mimetype,
          encoding,
          url: result.url,
        } as ApolloServerFileUploads.UploadedFileResponse);
      }
    );
    // @ts-ignore
    createReadStream(filename).pipe(uploadStream);
  });
}

export async function multipleUploadsResolver(
  parent: any,
  { files }: { files: ApolloServerFileUploads.File[] }
): Promise<ApolloServerFileUploads.UploadedFileResponse[]> {
  return Promise.all(
    files.map((f) => singleFileUploadResolver(null, { file: f }))
  );
}
