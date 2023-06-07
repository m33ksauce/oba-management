import {Command, Flags} from '@oclif/core'
import * as fs from "fs";
import { AwsPublisher } from '../../publishers/aws';
import { Metadata, Publisher } from '../../interfaces';
import { SharedFlags } from '../../shared/shared-flags';

export default class PublishMetadata extends Command {
  static description = 'Post categories to prod'

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
    {name: 'file', description: 'Metadata file to process', required: true}
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
        flags.awsRegion,
        flags.includeAudio,
      );
    }
    else throw Error("No valid publisher")

    this.log(`Include files? ${flags.includeAudio || false}`)
    
    publisher.PublishCategories(flags.translation, md);
  }

  
}