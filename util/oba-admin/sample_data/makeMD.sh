#!/bin/zsh

echo "{\"var\": [" > audio.json

for file in audio/Songs/*
do
    fileuuid=`uuidgen`
    echo "{" >>audio.json
    echo "  \"id\":\"${fileuuid}\"," >>audio.json
    echo "  \"file\":\"sample_data/${file}\"" >>audio.json
    echo "}," >>audio.json
done

echo "{}]}" >>audio.json

cat audio.json|jq '[.var[0:-1] | .[] | { type: 2, name: (.file | split("/") | .[-1]) , audioTargetId: .id } ]' > meta.json

# # find . -iname *.wav -type f -exec ffmpeg -i {} -codec:a libmp3lame -qscale:a 2 {}.mp3 -y \;


# #  -exec /bin/rm {} \;
