import dotenv from 'dotenv';
import crypto from 'crypto';
import { promisify } from 'util';
// eslint-disable-next-line import/no-extraneous-dependencies
import aws from 'aws-sdk';

const randomBytes = promisify((crypto.randomBytes));
dotenv.config();
const region = 'ap-south-1';
const accessKeyId = process.env.s3_access;
const secretKeyId = process.env.s3_secret;
const bucketName = 'event-era';

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretKeyId,
  signatureVersion: 'v4',
});

const generateUploadURL = async () => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');
  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  });

  const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
  console.log(s3);
  return uploadUrl;
};
export default generateUploadURL;
