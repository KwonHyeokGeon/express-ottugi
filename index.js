const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
const methodOverride = require('method-override');

app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

let db;
let save;

const MongoClient = require('mongodb').MongoClient
MongoClient.connect("mongodb+srv://admin:qwer1234@cluster0.6pc4fpp.mongodb.net/", function (err, client) {
  if (err) { return console.log(err) }

  db = client.db('sample_mflix');
  save = client.db('test2')



  app.listen(5000, function () {
    console.log('server is open');
  })
})

app.get('/write', function (req, res) {
  res.render('write.ejs')
})

app.post('/newpost', function (req, res) {
  console.log(req.body);

  const data = {
    name: req.body.name,
    age: req.body.age
  }

  save.collection('test2').insertOne(data, function (err, result) {
    res.redirect('/list');
  })
})

app.get('/list', function (req, res) {
  save.collection('test2').find().toArray(function (err, result) {
    res.render('list.ejs', { data: result })
  })
})
// 해당 앱의 주소가 list로 접근했다면, test2데이터베이스에서 모든 문서를 찾고 그 문서를 배열로 만든 뒤 list.ejs로 데이터를 넘긴다.

const ObjectId = require('mongodb').ObjectId

app.delete('/delete', function (req, res) {

  save.collection('test2').deleteOne({
    _id: ObjectId(req.body.id)
  }, function (err, result) {
    if (err) {
      return console.log(err);
    }
    res.redirect('/list')
  })
})

app.post('/edit/:id', function (req, res) {
  save.collection('test2').findOne({ _id: ObjectId(req.params.id) }, function (err, result) {
    res.render('edit.ejs', { data: result })
  })
})
app.put('/edit', function (req, res) {
  console.log(req.body.name, req.body.age);
  save.collection('test2').updateOne({ _id: ObjectId(req.body.id) }, {}, {
    $set: {
      name: req.body.name,
      age: req.body.age
    }
  }, function (err, result) {
    res.redirect('/list')
  })
})
app.get('/search', function (req, res) {
  save.collection('test2').find({ name: req.query.value }).toArray(function (err, result) {
    console.log(result.length);
    if (result.length > 0) {
      // 구조분해할당
      // 배열 첫번째 요소는 선언한 변수에 값을 넣고 나머지 모든 요소를 새 배열로 할당한다.
      const [list, ...lists] = result;

      res.render('search.ejs', { data: list })
    } else {
      res.send('no data')
    }
  })
})

app.get('/api/movie', function (req, res) {
  const category = Number(req.query.year) ? Number(req.query.year) : '';
  const countrie = req.query.countrie ? req.query.countrie : '';
  const limit = 10;
  const page = Number(req.query.page) ? Number(req.query.page) * limit : 1;

  if (req.originalUrl == '/api/movie') {
    db.collection('movies').find().limit(limit).skip(page).toArray(function (err, result) {
      const data2 = JSON.stringify(result, null, 2);
      res.render('api.ejs', { data: data2 })
    })
  } else if (category == '' || countrie == '') {
    db.collection('movies').find({ $or: [{ year: category }, { countries: countrie }] }).limit(limit).skip(2).toArray(function (err, result) {
      const data2 = JSON.stringify(result, null, 2);
      res.render('api.ejs', { data: data2 })
    })
  } else {
    db.collection('movies').find({ $and: [{ year: category }, { countries: countrie }] }).limit(limit).skip(page).toArray(function (err, result) {
      const data2 = JSON.stringify(result, null, page);
      res.render('api.ejs', { data: data2 })
    })
  }
})


// app.use(express.static(path.join(__dirname, 'Ottugi/dist')))
// app.get('/', function(req, res){
//   res.sendFile(path.join(__dirname, 'Ottugi/dist/index.html'))
// })

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

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'Ottugi/dist/index.html'))
})
module.exports = app;

