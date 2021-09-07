'use strict';
var request = require('request');

//db추가
var mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  port     : 3306,
  database : 'stock' 
});


function url_request(symbol)
{
  var apikey='YOUR-API-KEY-HERE';
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=15min&outputsize=full&apikey=${apikey}`;

  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    var company = data['Meta Data']['2. Symbol'];
    
    data=data['Time Series (15min)'];
    var num=0;   
    for(var key in data)
    {
      
      if(num==200){
        break;
      }
      // var a = '';
      // a.replace 
      var date = key.slice(0,10);
      date=date.replace('-','');
      date=date.replace('-','');
      var time=key.slice(11,13)+key.slice(14,16);
      var sql=`INSERT IGNORE INTO intraday_${company} (date,time, open,volume) VALUES ('${date}','${time}',${data[key]["1. open"]},${data[key]["5. volume"]})`;
      console.log(sql);
      connection.query(sql, (err, results, fields) => {
      if (err) throw err;
      });
      num=num+1;
    }
    console.log(`${symbol} success !!`);
  });
}

url_request("IBM");
url_request("ORCL");
url_request("UBER");
