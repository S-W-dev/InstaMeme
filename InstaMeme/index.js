const Twit = require('twit');
const fs = require('fs');
const puppy = require('random-puppy');
const request = require('request');
const keys = require('./keys')

var arr = ["When WWIII releases 2x XP weekend", "For When the Intensity Isn't Intense Enough", "The Most Accurate Way to Cry", "This Can't Be Right", "Closed-Caption Bullying", "Firefighters Are the Bravest Americans", "The Only Way the Deaf Can Understand Tennis", "LOL this reminds me of Donald Trump", "Or 'The Sounds of Cannibalistic Implications'", "Like a Real Man", "Doctor Who Villain Emulates Not Dogs", "D'Awww", "The Darkest, Most Violent Vegetable-Based Kids Show", "Stickin It to the Man", "Easily the Most Traumatizing Kind of Stealing", "[Insert Monster Mash Joke]", "This Is Called a Snart", "Because She Is That Much Worse Than Oliver", "This Is Now My Desktop Background", "Stupid Baby, Serves Him Right", "Your Own Recipe Right in the Comfort of Your Very Own Home!"];
var arr2 = ["http://via.placeholder.com/640x360", "https://www.fillmurray.com/640/360", "https://loremflickr.com/640/360", "https://baconmockup.com/640/360", "https://placekitten.com/640/360", "https://placebeard.it/640x360", "http://lorempixel.com/640/360", "https://www.placecage.com/640/360", "http://placeimg.com/640/360/any", "https://placebear.com/640/360", "https://picsum.photos/640/360"];
    function random(mn, mx) {
        return Math.random() * (mx - mn) + mn;
}
var thelink;
var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
            ////console.log('content-type:', res.headers['content-type']);
            ////console.log('content-length:', res.headers['content-length']);

            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
};  
let T = new Twit(keys.keys)
var b64content;
function getMeme() {
    puppy().then(url => {
        download(Thelink, 'google.png', function () {
            ////console.log('done downloading');
            b64content = fs.readFileSync('./google.png', {
                encoding: 'base64'
            })
            post();
        });

    })

}

var Thetext = "skrt";
getMeme();
getText();
getLink()

function getText() {

    Thetext = arr[Math.floor(random(1, arr.length))-1];
    //////console.log(Thetext)

}

function getLink() {

    Thelink = arr2[Math.floor(random(1, arr2.length))-1];
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
    var altText = "Small flowers in a planter on a sunny balcony, blossoming."
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