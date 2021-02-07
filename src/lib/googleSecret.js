const name = 'projects/119764587873/secrets/test_env/versions/1';
// const name = 'projects/my-project/secrets/my-secret/versions/latest';

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const client = new SecretManagerServiceClient();

export default async function getCloudinaryUploaderOptions() {
  const [version] = await client.accessSecretVersion({
    name: name,
  });

  // Extract the payload as a string.
  const payload = version.payload.data.toString();

  const [
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
  ] = payload.split('\r\n').map((val) => val.split('=')[1]);

  const cloudinaryUploaderOptions = {
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  };
  return cloudinaryUploaderOptions;
}
