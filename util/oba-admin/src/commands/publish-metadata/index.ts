import {Command, Flags} from '@oclif/core'
import * as fs from "fs";
import { AwsPublisher } from '../../publishers/aws';
import { Metadata, Publisher } from '../../interfaces';
import { SharedFlags } from '../../shared/shared-flags';
import { prepFile } from '../../util/fileUtils';

export default class PublishMetadata extends Command {
  static description = 'Send metadata to prod'

  static examples = [
    `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
  ]

  static flags = {
    includeAudio:
      Flags.boolean({ description: 'Include Audio?', required: false }),
    ...SharedFlags,
}

  static args = [
    {name: 'file', description: 'Metadata file to upload', required: true}
  ]

  async run(): Promise<void> {
    const {args, flags} = await this.parse(PublishMetadata)

    const mdRaw = fs.readFileSync(args.file); 
    const md: Metadata = JSON.parse(mdRaw.toString());

    let publisher: Publisher;

    if (flags.useAws) {
      publisher = new AwsPublisher(
        flags.awsS3Endpoint,
        flags.awsDynamoEndpoint,
        flags.httpEndpoint,
        flags.awsKeyId,
        flags.awsSecretKey,
        flags.awsRegion
      );
    }
    else throw Error("No valid publisher")

    if (flags.includeAudio) {
      md.Audio.forEach(audio => {
        const [file, mimeType] = prepFile(audio.file);
        publisher.PublishMedia(flags.translation, audio.id, mimeType, file)
        .then(() => console.log(`Published ${audio.file} with content-type: ${mimeType}`))
        .catch((err) => console.log(`Failed to publish ${audio.file}: ${err}`));
      })
    }

    this.log(`Include files? ${flags.includeAudio || false}`)
    
    publisher.PublishMetadata(flags.translation, md);
  }
}