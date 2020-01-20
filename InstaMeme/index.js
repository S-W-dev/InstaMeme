const Twit = require('twit');
const fs = require('fs');
const puppy = require('random-puppy');
const request = require('request');
const keys = require('./keys')
const Jimp = require("jimp");

let arr = require('./MemeText.json');
let arr2 = require('./MemeImageLinks.json');
let Thetext = "";
let b64content;
let loadedImage;
let Thelink;
let T = new Twit(keys.keys)

getText();
getLink();
getMeme();

function random(mn, mx) {
        return Math.random() * (mx - mn) + mn;
}
function download(uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            ////console.log('content-type:', res.headers['content-type']);
            ////console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
};
function getMeme() {
        download(Thelink, 'google.png', function () {
            ////console.log('done downloading')

             Jimp.read('google.png')
                 .then(async function (image) {
                     loadedImage = image;
                     return await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                 })
                 .then(async function (font) {
                   textWidth = Jimp.measureText(font, Thetext);
                     if(Jimp.measureText(font, Thetext) > loadedImage.bitmap.width - 50) {
                       await loadedImage.resize(textWidth+50,Jimp.AUTO);
                     }
                     await loadedImage.print(font, (loadedImage.bitmap.width/2)-(textWidth/2), loadedImage.bitmap.height-50, Thetext).write('googlee.png');
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
T.post('media/upload', {
    media_data: b64content
}, function (err, data, response) {
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
           var params = {
                status: Thetext,
                media_ids: [mediaIdStr]
            }

            T.post('statuses/update', params, function (err, data, response) {
                console.log(data.text);
            })
        }
    })
})
}
