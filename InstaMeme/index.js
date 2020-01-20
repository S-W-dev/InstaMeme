const Twit = require('twit');
const fs = require('fs');
const puppy = require('random-puppy');
const request = require('request');
const keys = require('./keys')
const Jimp = require("jimp");

var arr = require('./MemeText.json');
var arr2 = require('./MemeImageLinks.json');
var Thetext = "skrt";

function random(mn, mx) {
        return Math.random() * (mx - mn) + mn;
}
var Thelink;
var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            ////console.log('content-type:', res.headers['content-type']);
            ////console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
};
let T = new Twit(keys.keys)
var b64content;
var loadedImage;

getText();
getLink();
getMeme();

function getMeme() {
        download(Thelink, 'google.png', function () {
            ////console.log('done downloading');
             Jimp.read('google.png')
                 .then(function (image) {
                     loadedImage = image;
                     return Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
                 })
                 .then(function (font) {
                     loadedImage.print(font, Jimp.HORIZONTAL_ALIGN_CENTER, Jimp.VERTICAL_ALIGN_BOTTOM, Thetext)
                         .write('googlee.png');
                 })
                 .catch(function (err) {
                     console.error(err);
                 });

            setTimeout(()=>{
                
                    b64content = fs.readFileSync('./googlee.png', {
                        encoding: 'base64'
                    })

                post();

            }, 2000);
        });
}


function getText() {

    Thetext = arr.text[Math.floor(random(1, arr.text.length))-1];
    //////console.log(Thetext)

}

function getLink() {

    Thelink = arr2.links[Math.floor(random(1, arr2.links.length))-1];
    //////console.log(Thelink);

}

function post() {
// first we must post the media to Twitter
T.post('media/upload', {
    media_data: b64content
}, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = "A funny meme."
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
                status: Thetext,
                media_ids: [mediaIdStr]
            }

            T.post('statuses/update', params, function (err, data, response) {
                ////console.log(data)
                console.log(data.text);
            })
        }
    })
})
}
