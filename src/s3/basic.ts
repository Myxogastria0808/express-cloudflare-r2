import {
    CreateBucketCommand,
    DeleteBucketCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { checkIsString } from '../types';

dotenv.config();

const endpoint: string = checkIsString(process.env.ENDPOINT);
const accessKeyId: string = checkIsString(process.env.ACCESS_KEY_ID);
const secretAccessKey: string = checkIsString(process.env.SECRET_ACCESS_KEY);
const bucket: string = checkIsString(process.env.BUCKET);

//インスタンスの作成
const s3: S3Client = new S3Client({
    region: 'apac',
    endpoint: endpoint,
    //有効期限は、1年
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        // @ts-ignore
        signatureVersion: 'v4',
    },
});

//バケットの作成
//Bucketが、バケット名になる
const createBucket = async (bucket: string) => {
    await s3.send(
        new CreateBucketCommand({
            Bucket: bucket,
        })
    );
};

//バケットの削除
const deleteBucket = async (bucket: string) => {
    await s3.send(
        new DeleteBucketCommand({
            Bucket: bucket,
        })
    );
};

//バケットにオブジェクトの追加
//Bucketが、保存したいバケット名
//Keyが、ファイル名になる
//Bodyが、保存したいオブジェクト本体
const addObject = async (filename: string, data: Buffer | string): Promise<void> => {
    await s3.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: filename,
            Body: data,
        })
    );
};

//バケット内のオブジェクトの削除
//Keyは、保存した時のファイル名
const deleteObject = async (filename: string): Promise<void> => {
    await s3.send(
        new DeleteObjectCommand({
            Bucket: bucket,
            Key: filename,
        })
    );
};

//複数のバケット内オブジェクトを取得
//取得するオブジェクト数
const getManyObject = async (numberOfObjects: number): Promise<void> => {
    const a = await s3.send(
        new ListObjectsV2Command({
            Bucket: bucket,
            MaxKeys: numberOfObjects,
        })
    );
    console.log(a.Contents);
};

//特定のオブジェクトを取得
const getSpecificObject = async (filename: string): Promise<fs.WriteStream> => {
    const result: GetObjectCommandOutput = await s3.send(
        new GetObjectCommand({
            Bucket: bucket,
            Key: filename,
        })
    );
    const readableObj: Readable = result.Body as Readable;
    const writableObj: fs.WriteStream = fs.createWriteStream(filename);
    readableObj.pipe(writableObj);
    return writableObj;
};

//GetObjectCommandのラッパー
const getObjectCommandWrapper = async (filename: string): Promise<GetObjectCommandOutput> => {
    const result: GetObjectCommandOutput = await s3.send(
        new GetObjectCommand({
            Bucket: bucket,
            Key: filename,
        })
    );
    return result;
};

export {
    createBucket,
    deleteBucket,
    deleteObject,
    addObject,
    getManyObject,
    getSpecificObject,
    getObjectCommandWrapper,
};
