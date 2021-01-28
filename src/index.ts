import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { CloudinaryUploader } from './lib/uploaders/cloudinary';

dotenv.config();

const cloudinaryUploader = new CloudinaryUploader({
  cloudname: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT;

const server = new ApolloServer({
  typeDefs: gql`
    type UploadedFileResponse {
      filename: String!
      mimetype: String!
      encoding: String!
      url: String!
    }

    type Query {
      hello: String!
    }

    type Mutation {
      singleUpload(file: Upload!): UploadedFileResponse!
      multipleUpload(files: [Upload!]!): UploadedFileResponse!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hey!',
    },
    Mutation: {
      /**
       * This is where we hook up the file uploader that does all of the
       * work of uploading the files. With Cloudinary and S3, it will:
       *
       * 1. Upload the file
       * 2. Return an UploadedFileResponse with the url it was uploaded to.
       *
       * Feel free to pick through the code an IUploader in order to
       */

      singleUpload: cloudinaryUploader.singleFileUploadResolver.bind(
        cloudinaryUploader
      ),
      multipleUpload: cloudinaryUploader.multipleUploadsResolver.bind(
        cloudinaryUploader
      ),
    },
  },
});

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
