import { Flags } from "@oclif/core";

export const SharedFlags = {
  useFirebase:
    Flags.boolean(
      {
        description: 'Uses firebase for storage',
        exactlyOne: ["useFirebase", "useAws"]
      }),
  useAws:
    Flags.boolean(
      {
        description: 'Uses AWS for storage',
        exactlyOne: ["useFirebase", "useAws"]
      }),
  awsS3Endpoint:
    Flags.string(
      {
        description: 'Endpoint to use for AWS',
        dependsOn: ['useAws'],
        env: 'awsS3Endpoint',
        default: 'http://localhost.localstack.cloud:4566'
      }),
  awsDynamoEndpoint:
    Flags.string(
      {
        description: 'Endpoint to use for AWS',
        dependsOn: ['useAws'],
        env: 'awsDynamoEndpoint',
        default: 'http://localhost.localstack.cloud:4566'
      }),
  awsKeyId:
    Flags.string(
      {
        description: 'Key ID to use for AWS',
        dependsOn: ['useAws'],
        env: 'awsKeyId',
        default: 'secret'
      }),
  awsSecretKey:
    Flags.string(
      {
        description: 'Secret key to use for AWS',
        dependsOn: ['useAws'],
        env: 'awsSecretKey',
        default: 'secret'
      }),
  awsRegion:
    Flags.string(
      {
        description: 'Region to use for AWS',
        dependsOn: ['useAws'],
        default: 'us-east-1'
      }),
  translation:
    Flags.string(
      {
        description: 'Translation project name',
        required: true,
      }
    )
}