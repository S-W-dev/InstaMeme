const Sentencer = require('sentencer')
const fs = require('fs')

var data = "I am very {{ adjective }}"

var standard_input = process.stdin;
standard_input.setEncoding('utf-8');

Sentencer.configure({
  //nounList: [],
  //adjectiveList: [],

  actions: {
    verb: function(){
      return "something";
    }
  }
});
var myText;
console.log("Enter a sentence format: ")
standard_input.on('data', function (data) {
  if(data === 'exit\n'){
      // Program exit.
      console.log("User input complete, program exit.");
      process.exit();
  } else {
    myText = Sentencer.make(data).replace("\n","").replace("\r","")
    var json = fs.readFileSync('./MemeText.json')
    json = JSON.parse(json)
    json.text.push(myText)
    var json = JSON.stringify(json)
    fs.writeFileSync("./MemeText.json", json)
  }
})
