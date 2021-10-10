import csv from 'csvtojson';
import { createWriteStream } from 'fs';

const csvFilePath = './csv/nodejs-hw1-ex1.csv'
const writable = createWriteStream('./txt/file.txt', 'utf8');

csv({ checkType: true })
  .fromFile(csvFilePath)
  .subscribe((json) => {
    writable.write(JSON.stringify(json) + '\r\n', (error) => {
      if (error) {
        onError(error);
      }
    });
  }, onError, onComplete);

function onError(error) {
  console.error(error);
}

function onComplete() {
  writable.end('');
  console.log('Read from csv file and write to txt file completed');
}
