import cloudinary from 'cloudinary';
import { ApolloServerFileUploads } from '../index';

type CloudinaryUploadConfig = {
  cloudname: any;
  apiKey: any;
  apiSecret: any;
};

export class CloudinaryUploader implements ApolloServerFileUploads.IUploader {
  private config: CloudinaryUploadConfig;

  constructor(config: CloudinaryUploadConfig) {
    this.config = config;

    cloudinary.v2.config({
      cloud_name: config.cloudname,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
  }

  private createUploadStream(fileName: string, cb: Function): any {
    return cloudinary.v2.uploader.upload_stream(
      /**
       * We need a ts-ignore on the next line because for v2,
       * the order of params for upload_stream is reversed.
       */

      //@ts-ignore
      { public_id: fileName },
      (error: any, file: any) => cb(error, file)
    );
  }

  async singleFileUploadResolver(
    parent: any,
    { file }: { file: ApolloServerFileUploads.File }
  ): Promise<ApolloServerFileUploads.UploadedFileResponse> {
    const { createReadStream, filename, mimetype, encoding } = await file;
    console.log(file);

    return new Promise((resolve, reject) => {
      const uploadStream = this.createUploadStream(
        filename,
        (error: any, result: any) => {
          if (error) return reject(error);
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

  async multipleUploadsResolver(
    parent: any,
    { files }: { files: ApolloServerFileUploads.File[] }
  ): Promise<ApolloServerFileUploads.UploadedFileResponse[]> {
    return Promise.all(
      files.map((f) => this.singleFileUploadResolver(null, { file: f }))
    );
  }
}
