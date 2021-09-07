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
  var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apikey}`;

  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    var company = data['Meta Data']['2. Symbol'];
    data=data['Time Series (Daily)'];
    var num=0;   
    for(var key in data)
    {
      if(num==365*10){
        break;
      }

      var date = '';
      date=key.replace('-','');
      date=date.replace('-','');
      // console.log(date); 
      var sql=`INSERT IGNORE INTO daily_all (company,date,close,volume) VALUES ('${company}','${date}',${data[key]["4. close"]},${data[key]["5. volume"]})`;
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

