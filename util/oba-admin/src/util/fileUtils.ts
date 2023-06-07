import * as fs from "fs";
import * as pathLib from "path";
import { lookup } from 'mime-types';

export function prepFile(path: string): [Buffer, string] {
    return [
        fs.readFileSync(pathLib.resolve(path)),
        lookup(path) || "audio/mpeg3"
    ]
  }