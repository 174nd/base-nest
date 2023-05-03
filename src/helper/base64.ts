import { HttpException } from '@nestjs/common';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import * as mime from 'mime-types';
import { extname, join } from 'path';

export function validateBase64(base64: string): boolean {
  var mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  return mime && mime.length ? true : false;
}

export function extractBase64(base64: string): {data: Buffer, contentType: string, extension: string} {
  return {
    data: Buffer.from(base64.split(',').pop(), "base64"),
    contentType: base64.split(';').shift().split(':').pop(),
    extension: mime.extension(base64.split(';').shift().split(':').pop()),
  }
}

export async function createFileWithBase64(data, directory: string = 'files'){
  if(!data) return null;
  try {
    const extract = extractBase64(data);
    const filesname = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('') + '.' + extract.extension;
    const path = join(process.cwd(), directory, filesname);
    if(!existsSync(join(process.cwd(), directory + '/'))) mkdirSync(join(process.cwd(), directory + '/'));
    writeFileSync(path, extract.data);
    return filesname;
  } catch (error) {
    throw new HttpException(error ?? 'Files Not Supported!', 400);
  }
}

export function getContentType(filename: string){
  let ext = extname(filename).replace('.','');
  if(ext != '') return mime.contentType(filename);
  throw new HttpException('Files Not Supported!', 400);
}

export function checkFile(set: {
  fileSource: string;
  directory?: string; 
}) {

  const path = join(process.cwd(), set.directory ?? 'files' , set.fileSource);
  if (existsSync(path)) return path;
  throw new HttpException('file not found', 404);
}

export function checkFileStream(set: {
  fileSource: string;
  directory?: string; 
}) {
  const path = join(process.cwd(), set.directory ?? 'files' , set.fileSource);
  if (existsSync(path)) return createReadStream(path);
  throw new HttpException('file not found', 404);
}
