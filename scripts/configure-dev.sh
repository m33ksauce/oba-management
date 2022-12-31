#!/bin/sh

#source the env
source ../util/oba-admin/scripts/dev.env.sh

#configure local s3 and dynamodb
../backend/scripts/createTableSchema.sh

#publish the metadata
pushd ../util/oba-admin
./bin/run publish-metadata --useAws --translation yetfa ./sample_data/md.json --includeAudio
./bin/run publish-metadata --useAws --translation papuan_malay ./sample_data/malay.json --includeAudio