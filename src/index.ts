import express from 'express';
import cors from 'cors';
import { getObjectCommandWrapper } from './s3/basic';
import { Readable } from 'node:stream';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';

const app = express();

const PORT = 3000;
const IPADDRESS = '127.0.0.1';

//CORS
const corsOptions = {
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
    credentials: true,
    optionSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get('/:filename', async (req, res) => {
    const filename: string = req.params.filename;
    console.log(filename);
    const result: GetObjectCommandOutput = await getObjectCommandWrapper(filename);

    const readableObj: Readable = result.Body as Readable;

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', result.ContentLength as number);

    readableObj.pipe(res);
});

app.listen(PORT, IPADDRESS, () => {
    console.log(`server stating port: http://${IPADDRESS}:${PORT}/`);
}).on('error', (error) => {
    throw new Error(error.message);
});
