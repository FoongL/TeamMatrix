// scale on resize
function fontResize() {
  var resolution = 1440;
  var font = 10;

  var width = $(window).width();

  var newFont = font * (width / resolution);
  $("html").css("font-size", newFont);
}

$(document).ready(function() {
  fontResize();
  $(window).bind("resize", function() {
    fontResize();
  });
});


var options = {
  bottom: '64px', // default: '32px'
  right: 'unset', // default: '32px'
  left: '16px', // default: 'unset'
  time: '0.5s', // default: '0.3s'
  mixColor: '#fff', // default: '#fff'
  backgroundColor: '#fff',  // default: '#fff'
  buttonColorDark: '#100f2c',  // default: '#100f2c'
  buttonColorLight: '#fff', // default: '#fff'
  saveInCookies: false, // default: true,
  label: "🌓", // default: ''
  autoMatchOsTheme: true // default: true
}

const darkmode = new Darkmode(options);
darkmode.showWidget();

