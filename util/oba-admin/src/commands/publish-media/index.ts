import { Command, Flags } from '@oclif/core'

export default class PublishMedia extends Command {
    static description = 'Send metadata to prod'

    static examples = [
        `$ oex hello friend --from oclif
hello friend from oclif! (./src/commands/hello/index.ts)
`,
    ]

    static flags = {
        file: Flags.string({ char: 'f', description: 'File to upload', required: true }),
    }

    static args = [{ name: 'fileId', description: 'File ID to use', required: false }];

    async run(): Promise<void> {
        const { args, flags } = await this.parse(PublishMedia)

        // this.log(`hello ${args.person} from ${flags.from}! (./src/commands/hello/index.ts)`)
    }
}
