#!/bin/sh

#source the env
source ../util/oba-admin/scripts/prod.env.sh

#publish the metadata
pushd ../util/oba-admin
./bin/run publish-metadata --useAws --translation yetfa ./sample_data/md.json --includeAudio
./bin/run publish-metadata --useAws --translation papuan_malay \
    ./sample_data/metadata/papuan_malay-metadata-0.0.8.json --includeAudio