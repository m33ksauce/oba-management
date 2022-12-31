import {Command, Flags} from '@oclif/core'
import * as fs from "fs";
import { Metadata, AudioFile, Category } from '../../interfaces';
import { v4 as uuidv4 } from 'uuid';
const path = require('path');

export default class ParseMedia extends Command {
  static description = 'Send metadata to prod'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {}

  static args = [
    {name: 'mediaDir', description: 'Media dir to analyze', required: true},
    {name: 'version', description: 'Version tag to use', required: true},
  ]

  private metadata: Metadata = {
        Version: "",
        Categories: [],
        Audio: [],
    };

  async run(): Promise<void> {
    const {args, flags} = await this.parse(ParseMedia)

    this.metadata = {
        Version: args.version,
        Categories: [],
        Audio: [],
    }

    fs.readdirSync(path.resolve(args.mediaDir), {withFileTypes: true}).forEach(entry => {
        if (entry.isDirectory()) {
            let topLevelCat = this.parseDir(path.join(args.mediaDir), entry.name);
            this.metadata.Categories.push(topLevelCat)
        }
    });

    console.log(JSON.stringify(this.metadata));
  }

  private parseDir(curPath: string, name: string): Category {
    let newCategory: Category = {
        "type": 1,
        "name": name.replace(/\([^)]*\)/, "").trim(),
        "children": []
    }

    fs
        .readdirSync(path.resolve(`${curPath}/${name}`), {withFileTypes: true})
        .forEach(entry => {
            if (entry.isFile()) {
                let file = this.parseFile(`${curPath}/${name}/${entry.name}`)
                newCategory.children.push({
                    "type": 2,
                    "name": path.parse(entry.name).name,
                    "audioTargetId": file.id,
                })
                this.metadata.Audio.push(file);
            }
            if (entry.isDirectory()) {
                let childDir = this.parseDir(path.join(curPath, name), entry.name);
                newCategory.children.push(childDir);
            }
        })

    return newCategory;
  }

  private parseFile(curPath: string): AudioFile {
    return {
        "id": uuidv4(),
        "file": curPath,
    }
  }
}