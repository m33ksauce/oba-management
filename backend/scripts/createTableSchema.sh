#!/bin/sh
aws --endpoint-url=http://localhost:4566 \
    dynamodb create-table \
        --table-name "app.oralbible.api.releases" \
        --attribute-definitions \
            AttributeName=VERSION,AttributeType=S \
        --key-schema \
            AttributeName=VERSION,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=1,WriteCapacityUnits=1

aws --endpoint-url=http://localhost:4566 \
    dynamodb create-table \
        --table-name "app.oralbible.api.audio" \
        --attribute-definitions \
            AttributeName=VERSION,AttributeType=S \
        --key-schema \
            AttributeName=VERSION,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=1,WriteCapacityUnits=1

aws --endpoint-url=http://localhost:4566 s3 mb s3://app.oralbible.api