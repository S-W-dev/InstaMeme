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
        try {
          download(Thelink, 'google.png', function () {
              ////console.log('done downloading')

               Jimp.read('google.png')
                   .then(async function (image) {
                       loadedImage = image;
                       return await Jimp.loadFont('./InstaMeme/ComicSans.fnt');
                   })
                   .then(async function (font) {
                     textWidth = Jimp.measureText(font, Thetext);
                     textHeight = Jimp.measureTextHeight(font, Thetext);
                       if(textWidth > loadedImage.bitmap.width - 50) {
                         await loadedImage.resize(textWidth+50,Jimp.AUTO);
                       } else if (textWidth < loadedImage.bitmap.width/2) {
                         await loadedImage.resize(textWidth*2,Jimp.AUTO);
                       }
                       var back = await Jimp.read(loadedImage.bitmap.width, loadedImage.bitmap.height+textHeight+4, 0x000000FF);
                       loadedImage = await back.blit(loadedImage,0,0);
                       await loadedImage.print(font, (loadedImage.bitmap.width/2)-(textWidth/2), loadedImage.bitmap.height-textHeight-4, Thetext).write('googlee.png');
                       var data = await fs.readFileSync('./InstaMeme/MemeImageLinks.json');
                       var json = await JSON.parse(data);
                       var links = json.links;
                       json.links = await links.filter((link) => { return link !== Thelink });
                       await fs.writeFileSync('./InstaMeme/MemeImageLinks.json', JSON.stringify(json, null, 2));
                    })
                   .catch(function (err) {
                       console.error(err);
                   });

              setTimeout(()=>{

                      b64content = fs.readFileSync('googlee.png', {
                          encoding: 'base64'
                      })

                  post();

              }, 1000);
          });
        } catch(err) {
          console.error(err)
          console.log("There was an error getting the meme. Please try again.");
        }

}
function getText() {

    arr = require('./MemeText.json');
    arr2 = require('./MemeImageLinks.json');

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
        media_id: mediaIdStr
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
