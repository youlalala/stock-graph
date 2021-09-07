module.exports={
    HTML:function(dateString,company,x,y){
      return `
      <!doctype html>
      <html>
      <head>
        <title>${company}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
        <meta charset="utf-8">
      </head>
      <body>
        <div class="container my-5"> 
         <div>
          <div class="mb-4">
            <h1>${company}</h1>
            <div>
            <a href="/chart/ibm/daily">ibm</a>
            <a href="/chart/orcl/daily">orcl</a>
            <a href="/chart/uber/daily">uber</a>
            </div>
          </div>

          <h3 class="mb-3">today ${dateString}</h3>
          <div>
            <ul>
              <li><a href="/chart/${company}/daily">1일 chart</a></li>
              <li><a href="/chart/${company}/week">1주 chart</a></li>
              <li><a href="/chart/${company}/1month">1달 chart</a></li>
              <li><a href="/chart/${company}/3month">3달 chart</a></li>
              <li><a href="/chart/${company}/1year">1년 chart</a></li>
              <li><a href="/chart/${company}/3year">3년 chart</a></li>
              <li><a href="/chart/${company}/5year">5년 chart</a></li>
            </ul>
          </div>
        </div>
        <canvas id="myChart"></canvas>     
        </div> 

        <!-- 부트스트랩 --> 
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> 

        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script> 
        
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script> 

        <!-- 차트 --> 
        <script> 
          var ctx = document.getElementById('myChart').getContext('2d'); 
          var chart = new Chart(
            ctx, { 
              // 챠트 종류를 선택 
              type: 'line', 
              // 챠트를 그릴 데이타 
              data: { 
                labels:[${x}],
                datasets: [{ 
                  label: '',
                  backgroundColor: 'transparent', 
                  borderColor: 'blue', 
                  data:[${y}],
                }] 
              }, 
              // 옵션 
              options: {
              } 
            }); 
        </script>
      </body>
      </html>
      `;
    },
  }
  