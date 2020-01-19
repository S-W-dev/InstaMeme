console.log('Starting up!');

const Twit = require('twit');
const fs = require('fs');
const puppy = require('random-puppy');


let T = new Twit({
    consumer_key: "2RMOfGuJNvv2ftD0BIJTgMQo1",
    consumer_secret: "eopLdWv6Gouj7DSgCdvbsUgrwJAdvG7NdSSB8LwyVqyaLdq6W1",
    access_token: "1218731766480945154-7QevfjiiX7UUX7zIwgRIBzWoZFJijs",
    access_token_secret: "EEwFgYE4S1QJlEezgFaFPTeivRqYHaGZU0kX3fAoqnovd"
})

var b64content = fs.readFileSync(getMeme(), {
    encoding: 'base64'
})

// first we must post the media to Twitter
T.post('media/upload', {
    media_data: b64content
}, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = ""
    var meta_params = {
        media_id: mediaIdStr,
        alt_text: {
            text: altText
        }
    }

    T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = {
                status: getText(),
                media_ids: [mediaIdStr]
            }

            T.post('statuses/update', params, function (err, data, response) {
                console.log(data)
            })
        }
    })
})


let getMeme = () => {



}

let getText = () => {



}