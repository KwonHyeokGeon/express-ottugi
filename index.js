const express = require('express');
const path = require('path');
const app = express();

app.listen(5000, function(){
  console.log('server is open');
})

app.use(express.static(path.join(__dirname, 'Ottugi/dist')))
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'Ottugi/dist/index.html'))
})

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html')
//   // dirname === 현재 파일의 경로
// })

// app.get('/about', function(req, res){
//   res.sendFile(__dirname + '/about.html')
// })
// app.get('/about/question', function (req, res) {
//   res.sendFile(__dirname + '/aboutquestion.html')
// })

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, 'Ottugi/dist/index.html'))
})
module.exports = app;