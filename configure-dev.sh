#!/bin/sh

#source the env
source ./util/oba-admin/scripts/dev.env.sh

#configure local s3 and dynamodb
./backend/scripts/createTableSchema.sh

#publish the metadata
pushd ./util/oba-admin
./bin/run publish-metadata --useAws ./sample_data/md.json --includeAudio