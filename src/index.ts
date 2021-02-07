require('dotenv').config();

import { ApolloServer, gql } from 'apollo-server';
import {
  singleFileUploadResolver,
  multipleUploadsResolver,
} from './lib/uploaders/cloudinary';

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
      multipleUpload(files: [Upload!]!): [UploadedFileResponse!]!
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'Hey!',
    },
    Mutation: {
      singleUpload: singleFileUploadResolver,
      multipleUpload: multipleUploadsResolver,
    },
  },
});

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
