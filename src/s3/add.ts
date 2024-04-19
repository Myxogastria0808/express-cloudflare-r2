import fs from 'node:fs';
import { addObject } from './basic';

//*バイナリーのデータを追加する関数
const addBinary = (filename: string, filePath: string) => {
    fs.readFile(filePath, (e, data) => {
        if (e === null) {
            addObject(filename, data);
        } else {
            throw e;
        }
    });
};

//*テキストのデータを追加する関数
const addText = async (filename: string, filePath: string) => {
    //デフォルトは、utf8
    //同期関数 ... readFileSync()
    //非同期関数 ... readFile()
    const text: string = fs.readFileSync(filePath, 'utf8');
    addObject(filename, text);
    //以下の処理は、確認用
    const lines: string[] = text.toString().split('\n');
    for (let line of lines) {
        console.log(line);
    }
};

addBinary('nyoki.png', 'src/data/sample.png');
