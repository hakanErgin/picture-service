"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var apollo_server_1 = require("apollo-server");
var cloudinary_1 = require("./lib/uploaders/cloudinary");
dotenv.config();
var cloudinaryUploader = new cloudinary_1.CloudinaryUploader({
    cloudname: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
});
var port = process.env.PORT;
var server = new apollo_server_1.ApolloServer({
    typeDefs: apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    type UploadedFileResponse {\n      filename: String!\n      mimetype: String!\n      encoding: String!\n      url: String!\n    }\n\n    type Query {\n      hello: String!\n    }\n\n    type Mutation {\n      singleUpload(file: Upload!): UploadedFileResponse!\n      multipleUpload(files: [Upload!]!): UploadedFileResponse!\n    }\n  "], ["\n    type UploadedFileResponse {\n      filename: String!\n      mimetype: String!\n      encoding: String!\n      url: String!\n    }\n\n    type Query {\n      hello: String!\n    }\n\n    type Mutation {\n      singleUpload(file: Upload!): UploadedFileResponse!\n      multipleUpload(files: [Upload!]!): UploadedFileResponse!\n    }\n  "]))),
    resolvers: {
        Query: {
            hello: function () { return 'Hey!'; },
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
            singleUpload: cloudinaryUploader.singleFileUploadResolver.bind(cloudinaryUploader),
            multipleUpload: cloudinaryUploader.multipleUploadsResolver.bind(cloudinaryUploader),
        },
    },
});
server.listen({ port: port }).then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80 Server ready at " + url);
});
var templateObject_1;
