// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection

let submitButton;
let textInput;
let chatBox;
let TimeSinceLast = 1000;
let Text = "";
let rainbow = {
  hue: 0,
  toggle: false,
  speed: 1,
  getColor() {
    this.hue += this.speed
    if (this.hue > 359) {
      this.hue = 0;
    }
    return this.hue;
  }
}
function setup() {
  function btnMessage() {
    sendMessage()
  }
  colorMode(HSB)
  createCanvas(windowWidth, windowHeight);
  background(0);
  submitButton = createButton(TimeSinceLast);
  textInput = createInput('');
  textInput.position(20, 20);
  submitButton.position(25 + textInput.width, 20);
  submitButton.mousePressed(btnMessage);

  socket = io.connect("https://chatserver-dershreder.onrender.com/");
 // socket = io.connect('http://localhost:3000');
  socket.on('message',
    function (data) {
      Text += data += "\n";
    }
  );
  if (localStorage.getItem("name") == undefined) { localStorage.setItem("name", "Guest#" + floor(100 + random(899))) }
  sendMessage("/name " + localStorage.getItem("name"))
}
function draw() {

  if (keyIsDown(13)) {
    sendMessage()
  }
  background(0);
  text("/name [name] /clear /rainbowToggle /rainbowSpeed [x]", 0, 15)
  rainbow.toggle ? fill(rainbow.hue, 100, 100) : fill(0, 0, 100)
  rainbow.hue = rainbow.getColor()
  text(Text, 25, 35 + textInput.height)
  TimeSinceLast += deltaTime;

  TimeSinceLast - 1000 > 0 ? submitButton.style('background-color', "green") : submitButton.style('background-color', "red  ")
  submitButton.html(floor(constrain(1000 - TimeSinceLast, 0, 1000)))
}
function sendMessage(msg = textInput.value()) {
  if (typeof msg !== 'string') return;
  if (TimeSinceLast < 1000 || msg == "") { return }
  switch (msg) {
    case "/clear":
      Text = ""
      break;
    case "/rainbowToggle":
      rainbow.toggle = !rainbow.toggle;
      break;
    default:
      if (msg.slice(0, 14) == "/rainbowSpeed ") {
        rainbow.speed = +msg.slice(14)

        break;
      }
      if (msg.slice(0, 6) == "/name ") {
        localStorage.setItem("name", msg.slice(6, 16))
      }
      socket.emit('message', msg);
      TimeSinceLast = 0;
      break;
  }
  textInput.value("")
}


