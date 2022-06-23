import {Command, Flags} from '@oclif/core'
import {MetadataPublisher, Metadata} from "../../publishers/metadata.publisher";
import * as fs from "fs";
import { MediaPublisher } from '../../publishers/media.publisher';

export default class PublishMetadata extends Command {
  static description = 'Send metadata to prod'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    includeAudio: Flags.boolean({ description: 'Include Audio?', required: false })
  }

  static args = [{name: 'file', description: 'Metadata file to upload', required: true}]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(PublishMetadata)

    const mdRaw = fs.readFileSync(args.file); 
    const md: Metadata = JSON.parse(mdRaw.toString());

    if (flags.includeAudio) {
      md.Audio.forEach(audio => {
        const [file, mimeType] = MediaPublisher.PrepFile(audio.file);
        MediaPublisher.Publish(audio.id, mimeType, file)
        .then(() => console.log(`Published ${audio.file} with content-type: ${mimeType}`));
      })
    }

    MetadataPublisher.Publish(md);

    this.log(`Include files? ${flags.includeAudio || false}`)
  }
}
