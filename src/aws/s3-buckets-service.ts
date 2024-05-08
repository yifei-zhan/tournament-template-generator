/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

const region = "eu-central-1";
const credentials = {
  accessKeyId: process.env["AWS_ACCESS_KEY_ID"] || "AWS_ACCESS_KEY_ID",
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] || "AWS_SECRET_ACCESS_KEY",
};

const bucketName = "muc-tournament-generator";
const bucketInputFolderPrefix = "input";
const bucketOutputFolderPrefix = "output";

const appInputFolder = path.resolve(__dirname, "../../input");
const appOutputFolder = path.resolve(__dirname, "../../output");

const s3Client = new S3Client({
  region,
  credentials,
});

// export const uploadFilesToBucket = async ({ folderPath }) => {
//   const keys = readdirSync(folderPath);
//   const files = keys.map((key) => {
//     const filePath = `${folderPath}/${key}`;
//     const fileContent = readFileSync(filePath);
//     return {
//       Key: key,
//       Body: fileContent,
//     };
//   });

//   for (let file of files) {
//     await s3Client.send(
//       new PutObjectCommand({
//         Bucket: bucketName,
//         Body: file.Body,
//         Key: file.Key,
//       }),
//     );
//     console.log(`${file.Key} uploaded successfully.`);
//   }
// };

export const uploadFile = async function uploadFile() {
  try {
    const rstream = createReadStream(path.resolve(__dirname, "./input/hello-world.txt"));

    const command = new PutObjectCommand({
      Bucket: "s3-playground0",
      Key: `${bucketInputFolderPrefix}/hello-s3.txt`,
      Body: rstream,
    });

    const data = await s3Client.send(command);
    console.log({
      data,
    });
  } catch (error) {
    console.error(error);
  }
};

export const downloadFilesFromBucket = async () => {
  // @TODO output folder might not exist
  const { Contents } = await s3Client.send(
    new ListObjectsCommand({ Bucket: bucketName, Prefix: bucketOutputFolderPrefix })
  );

  if (Contents === undefined) {
    return;
  }

  for (const content of Contents) {
    const obj = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: `${bucketOutputFolderPrefix}/${content.Key}`,
      })
    );

    if (obj.Body === undefined) {
      continue;
    }

    await writeFile(`${appOutputFolder}/${content.Key}`, await obj.Body.transformToByteArray());
  }
};
