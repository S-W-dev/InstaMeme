console.log('Starting up!');

const Twit = require('twit');
const fs = require('fs');
const puppy = require('random-puppy');

    const request = require('request');

    var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
    };

    
let T = new Twit({
    consumer_key: "2RMOfGuJNvv2ftD0BIJTgMQo1",
    consumer_secret: "eopLdWv6Gouj7DSgCdvbsUgrwJAdvG7NdSSB8LwyVqyaLdq6W1",
    access_token: "1218731766480945154-7QevfjiiX7UUX7zIwgRIBzWoZFJijs",
    access_token_secret: "EEwFgYE4S1QJlEezgFaFPTeivRqYHaGZU0kX3fAoqnovd"
})
getMeme();
var b64content;
setTimeout(() => {
    b64content = fs.readFileSync("./google.png", {
        encoding: 'base64'
    });
}, 5000);


function getMeme() {
    puppy().then(url => {
        download(url, 'google.png', function () {
            console.log('done');
        });

    })
    setTimeout(() => {
        return "./google.png"
    }, 5000)


}

function getText() {

    return "When you realize WWIII isn't a game";

}

function post() {
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
}




setTimeout(() => {
    post();
}, 15000);
