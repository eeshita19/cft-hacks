var express = require('express');
var app = express();

app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

function daysInMonth(month) {
  var year = (new Date()).getFullYear();
  return new Date(year, month, 0).getDate();
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var grid = {};
for (var i = 0; i < months.length; i++) {
  grid[months[i]] = daysInMonth(i+1);
}

var moodOptions = {
  5: 'Amazing',
  4: 'Happy',
  3: 'Average',
  2: 'Stressed',
  1: 'Sadness',
  0: 'None'
};

app.get("/", function (req, res) {
  res.render('index', { grid: grid, moodOptions: moodOptions } );
});

var listener = app.listen(4000, function () {
  console.log('Your app is listening on port 4000 ');
});
