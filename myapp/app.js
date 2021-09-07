var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

var template = require('./template.js'); //html

const {swaggerUi, specs} = require('./swagger.js'); //추가

//db추가
var mysql = require('mysql');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  port     : 3306,
  database : 'stock' 
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* swagger  -----*/
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

//추가
app.get('/stock', (req, res) => {
  connection.query(`SELECT * FROM daily_all`, (err, results, fields) => {
    if (err) throw err;
    res.json(results); // json
  });
});


app.get('/stock/:company', (req, res) => {
  var company=req.params.company;
  connection.query(`SELECT * FROM daily_all WHERE company='${company}' ORDER BY date DESC`, (err, results, fields) => {
    if (err) throw err;
    res.json(results); // json
  });
});

var today=new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + (today.getDate()-2)).slice(-2);
var dateString = year+month+day;

var day_week = ('0' + (today.getDate()-11)).slice(-2);
var dateString_week = year+month+day_week;

var month_1 = ('0' + (today.getMonth())).slice(-2);
var dateString_1month = year+month_1+day;

var month_3 = ('0' + (today.getMonth()-2)).slice(-2);
var dateString_3month = year+month_3+day;

var year_1 = today.getFullYear()-1;
var dateString_1year = year_1+month+day;

var year_3 = today.getFullYear()-3;
var dateString_3year = year_3+month+day;

var year_5 = today.getFullYear()-5;
var dateString_5year = year_5+month+day;

var year_10 = today.getFullYear()-10;
var dateString_10year = year_10+month+day;

app.get('/stock/:company/:timescale', (req, res) => {
  var company=req.params.company;
  var timescale=req.params.timescale;
  var sql;
  if (timescale=='daily')
  {
    sql = 'SELECT * FROM intraday_'+`${company} where date='${dateString}' ORDER BY date DESC;`;
  }
  if (timescale=='week')
  {
    sql = 'SELECT * FROM intraday_'+`${company} where date between '${dateString_week}' and '${dateString}' ORDER BY date DESC;`;
  }
  if (timescale=='1month')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_1month}' and '${dateString}') ORDER BY date DESC`;
  }
  if (timescale=='3month')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_3month}' and '${dateString}') ORDER BY date DESC`;
  }
  if (timescale=='1year')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_1year}' and '${dateString}') ORDER BY date DESC`;
  }
  if (timescale=='3year')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_3year}' and '${dateString}') ORDER BY date DESC`;
  }
  if (timescale=='5year')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_5year}' and '${dateString}') ORDER BY date DESC`;
  }
  if (timescale=='10year')
  {
    sql = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_10year}' and '${dateString}') ORDER BY date DESC`;
  }
  connection.query(sql, (err, results, fields) => {
    if (err) throw err;
    res.json(results); // json
  });
});


app.get('/stock/:company/date/:date', (req, res) => {
  var company=req.params.company;
  var date=req.params.date;
  connection.query(`SELECT * FROM daily_all WHERE company='${company}' and date='${date}'`, (err, results, fields) => {
    if (err) throw err;
    res.json(results); // json
  });
});

app.get('/chart', (req,res,next)=>{
  var company=req.params.company;
    var html=template.HTML(dateString);
    res.send(html);
  });

app.get('/chart/:company', (req,res,next)=>{
  var company=req.params.company;
    var html=template.HTML(dateString,company);
    res.send(html);
  });

  app.get('/chart/:company/daily', (req,res)=>{
    var company=req.params.company;
    var sql = 'SELECT * FROM intraday_'+`${company} where date='${dateString}' ORDER BY date DESC;`;
    connection.query(sql, function(err, results, fields) {
      if(err) throw err;
      var x=[], y=[];
      for(var i = 0; i <results.length; i++) {
        x[i]=results[i].time;
        y[i]=results[i].open;
      }
      var html=template.HTML(dateString,company,x,y);
      res.send(html);
    });
  });
  
  app.get('/chart/:company/week', (req,res)=>{
    var company=req.params.company;
    var sql = 'SELECT * FROM intraday_'+`${company} where date between '${dateString_week}' and '${dateString}' ORDER BY date DESC;`;
    connection.query(sql, function(err, results, fields) {
      if(err) throw err;
      var x=[], y=[];
      for(var i = 0; i < results.length; i++) {
        x[i]=results[i].time;
        y[i]=results[i].open;
      }
      var html=template.HTML(dateString,company,x.reverse(),y.reverse());
      res.send(html);
    });
  });

app.get('/chart/:company/1month', (req,res,next)=>{
  var company=req.params.company;
  var queryString = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_1month}' and '${dateString}') ORDER BY date DESC`;
  connection.query(queryString, function(err, results, fields) {
    if(err)
      next(err);
    var x= [], y = [];
    for(var i = 0; i < results.length; i++) {
      x[i]=results[i].date;
      y[i]=results[i].close;
    }
    var html=template.HTML(dateString,company,x.reverse(),y.reverse());
    res.send(html);
  });
});

app.get('/chart/:company/3month', (req,res,next)=>{
  var company=req.params.company;
  var queryString = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_3month}' and '${dateString}') ORDER BY date DESC`;
  connection.query(queryString, function(err, results, fields) {
    if(err)
      next(err);
    var x= [], y = [];
    for(var i = 0; i < results.length; i++) {
      x[i]=results[i].date;
      y[i]=results[i].close;
    }
    var html=template.HTML(dateString,company,x.reverse(),y.reverse());
    res.send(html);
  });
});

app.get('/chart/:company/1year', (req,res,next)=>{
  var company=req.params.company;
  var queryString = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_1year}' and '${dateString}') ORDER BY date DESC`;
  connection.query(queryString, function(err, results, fields) {
    if(err)
      next(err);
    var x= [], y = [];
    for(var i = 0; i < results.length; i++) {
      x[i]=results[i].date;
      y[i]=results[i].close;
    }
    var html=template.HTML(dateString,company,x.reverse(),y.reverse());
    res.send(html);
  });
});

app.get('/chart/:company/3year', (req,res,next)=>{
  var company=req.params.company;
  var queryString = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_3year}' and '${dateString}') ORDER BY date DESC`;
  connection.query(queryString, function(err, results, fields) {
    if(err)
      next(err);
    var x= [], y = [];
    for(var i = 0; i < results.length; i++) {
      x[i]=results[i].date;
      y[i]=results[i].close;
    }
    var html=template.HTML(dateString,company,x.reverse(),y.reverse());
    res.send(html);
  });
});

app.get('/chart/:company/5year', (req,res,next)=>{
  var company=req.params.company;
  var queryString = `SELECT * FROM daily_all WHERE (company='${company}') and (date between '${dateString_5year}' and '${dateString}') ORDER BY date DESC`;
  connection.query(queryString, function(err, results, fields) {
    if(err)
      next(err);
    var x= [], y = [];
    for(var i = 0; i < results.length; i++) {
      x[i]=results[i].date;
      y[i]=results[i].close;
    }
    var html=template.HTML(dateString,company,x.reverse(),y.reverse());
    res.send(html);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
