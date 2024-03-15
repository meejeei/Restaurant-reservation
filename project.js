// Express 기본 모듈 불러오기
var express = require('express');
var http = require('http');
var path = require('path');
var static = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'user333',
    password:'password333',
    database:'DB08',
    debug:false
});
//Express 객체 생성
var app = express(); 

//기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);
app.use(static(path.join(__dirname)));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


var router = express.Router();
var username='';
var res_name='';
var res_time='';


//사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req,res){
     console.log('/process/adduser 라우팅 함수 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : ' + paramId + ', '+ paramPassword);

    if(paramId == null && paramPassword == null){
                  res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                  res.write('<h1>아이디와 비밀번호를 입력해주세요</h1>');
                  res.write('<button onclick="window.location.href = \'/public/adduser.html\'">돌아가기</button>');
                  res.end();
    }
    else if (paramId == null){
                  res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                  res.write('<h1>아이디를 입력해주세요</h1>');
                  res.write('<button onclick="window.location.href = \'/public/adduser.html\'">돌아가기</button>');
                  res.end();
    }
    else if (paramPassword == null){
                  res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                  res.write('<h1>비밀번호를 입력해주세요</h1>');
                  res.write('<button onclick="window.location.href = \'/public/adduser.html\'">돌아가기</button>');
                  res.end();
    }
    else {
        //pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
        addUser(paramId, paramPassword, function(err, addedUser){
            //동일한 id로 추가할 때 오류 발생
                if(err){
                    console.error('사용자 추가 중 오류 발생: '+err.stack);
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.write('<h2>이미 있는 계정입니다.</h2>');
                    res.write('<button onclick="window.location.href = \'/public/adduser.html\'">돌아가기</button>');
                    res.end();
                    
                    return;
                }

                //결과 객체가 있으면 성공 응답 전송
                if (addedUser){
                    console.dir(addedUser);
        
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.write('<h1>회원가입 완료</h1>');
                    res.write('<button onclick="window.location.href = \'/public/login.html\'">돌아가기</button>');
                    
                    res.end();
                }
                else {
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.write('<h1>회원가입 실패</h1>');
                    res.write('<button onclick="window.location.href = \'/public/login.html\'">돌아가기</button>');
                    res.end();
                }
            });
          }
    });

    //로그인 라우팅
    router.route('/process/login').post(function(req, res) {
        console.log('/process/login 라우팅 함수에서 받음.');
    
        var paramId = req.body.id || req.query.id;
        var paramPassword = req.body.password || req.query.password;
        username=paramId;
        console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
        console.log(username);
    
        // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
        authUser(paramId, paramPassword, function(err, rows) {
            // 오류 발생 시
            if (err) {
                console.error('사용자 로그인 중 오류 발생 : ' + err.stack);
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
    
            if (rows) {
                console.dir(rows);
            
                username = paramId;
            
                res.writeHead(302, { 'Location': '/public/search.html' });
                res.end();
            }
            
             else {
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>아이디와 패스워드를 다시 확인하십시오.</p>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    });
    
  
    //로그인 라우팅
    router.route('/process/login').post(function(req, res) {
        console.log('/process/login 라우팅 함수에서 받음.');
    
        var paramId = req.body.id || req.query.id;
        var paramPassword = req.body.password || req.query.password;
        username=paramId;
        console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
        console.log(username);
    
        // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
        authUser(paramId, paramPassword, function(err, rows) {
            // 오류 발생 시
            if (err) {
                console.error('사용자 로그인 중 오류 발생 : ' + err.stack);
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
    
            if (rows) {
                console.dir(rows);
            
                username = paramId;
            
                res.writeHead(302, { 'Location': '/public/search.html' });
                res.end();
            }
            
             else {
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>로그인 실패</h2>');
                res.write('<p>아이디와 패스워드를 다시 확인하십시오.</p>');
                res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();
            }
        });
    });

// 예약내역 확인
router.route('/process/myres').post(function(req, res) {
  console.log('/process/myres 라우팅 함수에서 받음.');
  // pool 객체가 초기화된 경우, checkRes 함수 호출하여 예약 내역 확인
  checkRes(username, function(err, result) {
    // 오류 발생 시
    if (err) {
      console.error('예약 내역 확인 중 오류 발생 : ' + err.stack);
      res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
      res.write('<h2>예약 내역 확인 중 오류 발생</h2>');
      res.write('<p>' + err.stack + '</p>');
      res.end();
      return;
    }

    if (result) {

      console.dir(result);
      res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
      res.write('<div style="display: inline-block;">');
      res.write(username + '님의 예약 내역');
      res.write('<table>');
      res.write('<tr><th>시간</th><th>음식점</th><th>전화번호</th><th>테이블번호</th></tr>');
      for (var i = 0; i < result.length; i++) {
        for (var j =1; j < 11; j++){
          if(result[i]['table' + j] == username) {
            res.write('<tr>');
            res.write('<td>' + result[i].res_time.slice(4, 7) + ':00 | </td>');
            res.write('<td>' + result[i].rest_id + ' | </td>');
            res.write('<td>' + result[i].phone + ' | </td>');
            res.write('<td>'+j+'번 테이블</td>');
            res.write('<td><form method="post" action="/process/tabeldel/' + result[i].res_time.slice(4, 7) + j + result[i].rest_id+'"><button type="submit">예약 취소</button></form></td>');
            res.write('</tr>');
          }
        }

      }
      res.write('</table>');
      res.write('</div>');
      res.write('<div style="display: inline-block; margin-left: 20px;">');
      res.write('<button onclick="window.location.href=\'/public/search.html\'">이전</button>');
      res.write('</div>');
      res.end();
    } else {
      res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
      res.write('<h2>예약 내역이 없습니다.</h2>');
      res.write('<div style="margin-top: 20px;">');
      res.write('<button onclick="window.location.href=\'/public/search.html\'">이전</button>');
      res.write('</div>');
      res.end();
    }
  });
});

      //예약 취소 라우팅
      router.route('/process/tabeldel/:table').post(function(req, res) {
        console.log('/process/tabeldel 라우팅 함수에서 받음.');
    
        var table = req.params.table;
        console.log('table='+table);
        var paramTime = table.slice(0, 2);
        var paramTable = table.slice(2, 3);
        var paramRest = table.slice(3);
        
        console.log('paramTime=' + paramTime);
        console.log('paramTable=' + paramTable);
        console.log('paramRest=' + paramRest);
    
        // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
        delTable(paramTime, paramTable, paramRest, function(err, result) {
            // 오류 발생 시
            if (err) {
                console.error('예약 취소 중 오류 발생 : ' + err.stack);
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>예약 취소 중 오류 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();
                return;
            }
    
            if (result) {
                console.dir(result);
            
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>예약 취소 완료</h2>');
                res.write('<button onclick="window.history.back()">이전</button>');
                res.end();
            }
            
            else {
                res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
                res.write('<h2>예약 취소 실패</h2>');
                res.write('<button onclick="window.history.back()">이전</button>');
                res.end();
            }
        });
    });




//예약 내용 저장 라우팅
router.route('/process/res/:table').post(function(req,res){
  console.log('/process/res 라우팅 함수 호출됨.');
  console.log('res_time:'+res_time);

  var paramTableRes = req.body.table || req.query.table;

  console.log('요청 파라미터 : ' + paramTableRes);

  // pool 객체가 초기화된 경우, addRes 함수 호출하여 예약 시간 저장
  addRes(paramTableRes, function(err, result){
    if(err){
      console.error('예약 시간 저장 중 오류 발생: ' + err.stack);
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h2>예약 시간 저장 중 오류 발생</h2>');
      res.write('<p>'+ err.stack+'</p>');
      res.end();
      return;
    }

    if(result){
      console.dir(result);
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h1>'+username+'님 '+res_name+' 식당 '+res_time+'시에 예약 완료되었습니다.</h1>');
      res.write('<button onclick="window.location.href = \'/public/search.html\'">돌아가기</button>');
      res.end();
    }
    else{
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h1>이미 예약된 테이블 입니다.</h1>');
      res.write('<button onclick="window.location.href = \'/public/search.html\'">돌아가기</button>');
      res.end();
    }
  });
});



//식당 검색
router.route('/process/search').post(function(req, res){
    console.log('/process/search 라우팅 함수 호출됨.');
  
    var paramfoodKind = req.body.foodKind || req.query.foodKind;
    var paramrest_id = req.body.rest_id || req.query.rest_id;

    if (paramfoodKind ==null){
      paramfoodKind ='';
    }
    else{
      paramrest_id='';
    }
  
    console.log('요청 파라미터 : ' + paramfoodKind);
    console.log('요청 파라미터 : ' + paramrest_id);
    if(paramrest_id){
        console.log('rest_id 실행');
    searchName(paramrest_id, function(err, result){
        if(err){
          console.error('식당 이름으로 검색 중 오류 발생: ' + err.stack);
          res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
          res.write('<h2>식당 이름으로 검색 중 오류 발생</h2>');
          res.write('<p>'+ err.stack+'</p>');
          res.end();
          return;
        }
    
        if (result) {
            console.dir(result);
            res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
            res.write('<h2>"' + paramrest_id + '" 검색 결과&emsp;&emsp;&emsp;&emsp;<button onclick="window.location.href = \'/public/search.html\'">이전</button></h2>');
            res.write('<table>');
            res.write('<tr><th>음식점 이름</th><th>음식 종류</th><th>전화번호</th></tr>');
            
            for (var i = 0; i < result.length; i++) {
                res.write('<tr>');
                res.write('<td>' + result[i].rest_id + '</td>');
                res.write('<td>' + result[i].food_kind + '</td>');
                res.write('<td>' + result[i].phone + '</td>');
                res.write('<td><form action="/process/restaurant" method="post"><input type="hidden" name="rest_id" value="' + result[i].rest_id + '"><button type="submit">예약하기</button></form></td>');
                res.write('</tr>');
        }

        res.write('</table>');
        res.end();
        }
        else{
          res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
          res.write('<h1>식당 이름으로 검색 실패</h1>');
          res.end();
        }
      });
}
else{
    console.log('foodKind 실행');
     // pool 객체가 초기화된 경우, food_kind_search 함수 호출하여 예약 시간 저장
     food_kind_search(paramfoodKind, function(err, result){
    if(err){
      console.error('음식 종류로 검색 중 오류 발생: ' + err.stack);
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h2>음식 종류로 검색 중 오류 발생</h2>');
      res.write('<p>'+ err.stack+'</p>');
      res.end();
      return;
    }

    if (result) {
        console.dir(result);
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h2>' + paramfoodKind.slice(0, -1) + ' 식당 리스트&emsp;&emsp;<button onclick="window.location.href = \'/public/search.html\'">이전</button></h2>');
        res.write('<table>');
        res.write('<tr><th>음식점 이름</th><th>음식 종류</th><th>전화번호</th></tr>');

        for (var i = 0; i < result.length; i++) {
            res.write('<tr>');
                res.write('<td>' + result[i].rest_id + '</td>');
                res.write('<td>' + result[i].food_kind + '</td>');
                res.write('<td>' + result[i].phone + '</td>');
                res.write('<td><form action="/process/restaurant" method="post"><input type="hidden" name="rest_id" value="' + result[i].rest_id + '"><button type="submit">예약하기</button></form></td>');
                res.write('</tr>');
        }

        res.write('</table>');
        res.end();
    }
    else{
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h1>음식 종류로 검색 실패</h1>');
      res.end();
    }
  });
}

  });
  

//식당 별 사이트 이동
router.route('/process/restaurant').post(function(req, res) {
    console.log('/process/restaurant 라우팅 함수 호출됨.');
  
    var restId = req.body.rest_id || req.query.rest_id;
    res_name=restId;
    searchTime(restId, function(err, result) {
      if (err) {
        console.error('식당 사이트 불러오기 중 오류 발생: ' + err.stack);
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write('<h2>식당 사이트 불러오기 중 오류 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();
        return;
      }
  
      if (result) {
        console.dir(result);
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write('<h2 style="text-align: center;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;' + restId + '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<button onclick="window.history.back()">이전</button></h2>');
        
        const imageUrlMap = {
          '정통집': '/public/images/정통집.jfif',
          '청춘우동까스': '/public/images/청춘우동까스.jfif',
          '궁동 아저씨': '/public/images/궁동 아저씨.jfif',
          '역전우동': '/public/images/역전우동.jfif',
          '맛존매콤닭불고기': '/public/images/맛존매콤닭불고기.jfif',
          '뎅뎅뎅': '/public/images/뎅뎅뎅.jfif',
          'Ato': '/public/images/Ato.jfif',
          '별리달리': '/public/images/별리달리.jfif',
          '라꼬레': '/public/images/라꼬레.jfif',
          '최진엽샤브샤브': '/public/images/최진엽샤브샤브.jfif',
          '경성가': '/public/images/경성가.jfif',
          '천복순대국밥': '/public/images/천복순대국밥.jfif'
      };

      const imageUrl = imageUrlMap[restId];

      if (imageUrl) {
        res.write(`<img src="${imageUrl}" style="display: block; margin: 0 auto; width: 300px; height: 200px;">`);
        }
    
        res.write('<div></div>');
        res.write('<div style="text-align: center;">대표 메뉴: ' + result[0].best_menu + '</div>');
        res.write('<div></div>');
        const buttonColorMap = {
            Full: '#FFFF00', //노란색
            notFull: '#FF0000' //분홍색
          };
          const html = `
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .time-group {
                  display: inline-block;
                  margin: 10px; //상하좌우
                  margin-top: 40px; //위아래
                }
          
                input[type="submit"] {
                  width: 80px;
                  height: 30px;
                  font-size: 16px;
                  font-weight: bold;
                  border: none;
                  color: #000;
                  cursor: pointer;
                }
          
                input[type="submit"][value="11:00"] {
                  background-color: ${result[0].count === result[0].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="12:00"] {
                  background-color: ${result[1].count === result[1].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="13:00"] {
                  background-color: ${result[2].count === result[2].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="14:00"] {
                  background-color: ${result[3].count === result[3].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="15:00"] {
                  background-color: ${result[4].count === result[4].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="16:00"] {
                  background-color: ${result[5].count === result[5].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="17:00"] {
                  background-color: ${result[6].count === result[6].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="18:00"] {
                  background-color: ${result[7].count === result[7].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="19:00"] {
                  background-color: ${result[8].count === result[8].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="20:00"] {
                  background-color: ${result[9].count === result[9].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="21:00"] {
                  background-color: ${result[10].count === result[10].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
          
                input[type="submit"][value="22:00"] {
                  background-color: ${result[11].count === result[11].table_num ? buttonColorMap.notFull : buttonColorMap.Full};
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="time-group">
                  <form method="post" action="/process/table/11">
                    <input type="hidden" name="time" value="11">
                    <input type="submit" value="11:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/12">
                    <input type="hidden" name="time" value="12">
                    <input type="submit" value="12:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/13">
                    <input type="hidden" name="time" value="13">
                    <input type="submit" value="13:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/14">
                    <input type="hidden" name="time" value="14">
                    <input type="submit" value="14:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/15">
                    <input type="hidden" name="time" value="15">
                    <input type="submit" value="15:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/16">
                    <input type="hidden" name="time" value="16">
                    <input type="submit" value="16:00">
                  </form>
                </div>
              </div>
              <div>
              </div>
              <div class="container">
                <div class="time-group">
                  <form method="post" action="/process/table/17">
                    <input type="hidden" name="time" value="17">
                    <input type="submit" value="17:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/18">
                    <input type="hidden" name="time" value="18">
                    <input type="submit" value="18:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/19">
                    <input type="hidden" name="time" value="19">
                    <input type="submit" value="19:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/20">
                    <input type="hidden" name="time" value="20">
                    <input type="submit" value="20:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/21">
                    <input type="hidden" name="time" value="21">
                    <input type="submit" value="21:00">
                  </form>
                </div>
                <div class="time-group">
                  <form method="post" action="/process/table/22">
                    <input type="hidden" name="time" value="22">
                    <input type="submit" value="22:00">
                  </form>
                </div>
              </div>
              <form action="/process/map" method="post">
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        <button type="submit">위치보기</button>
    </form>
            </body>
            </html>
          `; 
        res.write(html);
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
        res.write('<h1>식당 사이트 불러오기 실패</h1>');
        res.end();
      }
    });
  
  });


  //테이블 페이지 이동
  router.route('/process/table/:time').post(function(req, res) {
    console.log('/process/table/:time 라우팅 함수 호출됨.');
    var time = req.body.time || req.query.time;
    console.log(username + '님이 ' + time + '시에 ' + res_name + '의 테이블 예약');
    
    var targetTime = parseInt(time);
    res_time=targetTime;
    console.log('targetTime:'+res_time);
    if (targetTime >= 11 && targetTime <= 23) {
      searchTable(res_name, targetTime, function(err, result) {
        if (err) {
          console.error('예약 시간 저장 중 오류 발생: ' + err.stack);
          res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
          res.write('<h2>예약 시간 저장 중 오류 발생</h2>');
          res.write('<p>' + err.stack + '</p>');
          res.end();
          return;
        }
  
        if (result) {
          console.dir(result);
          res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
          res.write('<h2 style="text-align: center;">' + res_name + '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<button onclick="window.history.back()">이전</button></h2>');
          const buttonColorMap = {
            null: '#FFFF00', // 값이 null일 때 노란색
            notNull: '#FF0000' // 값이 있을 때 분홍색
          };
          if(result[0].table_num == '7'){
          const html = `
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .table-group {
                  display: inline-block;
                  margin: 10px;
                }
          
                input[type="submit"] {
                  background-color: #FFFFE0;
                  padding: 10px 20px;
                  font-size: 18px;
                }
                .box {
                  background-color: #e0f5ff;
                  padding: 10px 20px;
                  font-size: 18px;
                  display: inline-block;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/1">
                    <input type="hidden" name="table" value="table1">
                    <input type="submit" style="background-color: ${result[0].table1 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table1">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/2">
                    <input type="hidden" name="table" value="table2">
                    <input type="submit" style="background-color: ${result[0].table2 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table2">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/3">
                    <input type="hidden" name="table" value="table3">
                    <input type="submit" style="background-color: ${result[0].table3 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table3">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/4">
                    <input type="hidden" name="table" value="table4">
                    <input type="submit" style="background-color: ${result[0].table4 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table4">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/5">
                    <input type="hidden" name="table" value="table5">
                    <input type="submit" style="background-color: ${result[0].table5 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table5">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/6">
                    <input type="hidden" name="table" value="table6">
                    <input type="submit" style="background-color: ${result[0].table6 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table6">
                  </form>
                </div>
              </div>
              <div class="container">
              <div class="box">문</div>
              <div class="table-group"></div>
              <div class="table-group"></div>
              <div class="table-group"></div>
              <div class="table-group"></div>
              <div class="table-group"></div>
              <div class="table-group"></div>
              <div class="table-group"></div>
                <div class="table-group">
                  <form method="post" action="/process/res/7">
                    <input type="hidden" name="table" value="table7">
                    <input type="submit" style="background-color: ${result[0].table7 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table7">
                  </form>
                </div>
              </div>
            </body>
            </html>
          `;
          
          res.write(html);
              }
              else if(result[0].table_num=='6'){
                const html = `
                <html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .table-group {
                  display: inline-block;
                  margin: 10px;
                }
          
                input[type="submit"] {
                  background-color: #FFFFE0;
                  padding: 10px 20px;
                  font-size: 18px;
                }
                .box {
                  background-color: #e0f5ff;
                  padding: 10px 20px;
                  font-size: 18px;
                  display: inline-block;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/1">
                    <input type="hidden" name="table" value="table1">
                    <input type="submit" style="background-color: ${result[0].table1 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table1">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/2">
                    <input type="hidden" name="table" value="table2">
                    <input type="submit" style="background-color: ${result[0].table2 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table2">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/3">
                    <input type="hidden" name="table" value="table3">
                    <input type="submit" style="background-color: ${result[0].table3 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table3">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/4">
                    <input type="hidden" name="table" value="table4">
                    <input type="submit" style="background-color: ${result[0].table4 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table4">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/5">
                    <input type="hidden" name="table" value="table5">
                    <input type="submit" style="background-color: ${result[0].table5 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table5">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/6">
                    <input type="hidden" name="table" value="table6">
                    <input type="submit" style="background-color: ${result[0].table6 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table6">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="box">문</div>
                </div>
            </body>
            </html>
            `;
          
            res.write(html);
              }
              else if (result[0].table_num == '5'){
                const html = `
                <html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .table-group {
                  display: inline-block;
                  margin: 10px;
                }
          
                input[type="submit"] {
                  background-color: #FFFFE0;
                  padding: 10px 20px;
                  font-size: 18px;
                }
                .box {
                  background-color: #e0f5ff;
                  padding: 10px 20px;
                  font-size: 18px;
                  display: inline-block;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/1">
                    <input type="hidden" name="table" value="table1">
                    <input type="submit" style="background-color: ${result[0].table1 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table1">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/2">
                    <input type="hidden" name="table" value="table2">
                    <input type="submit" style="background-color: ${result[0].table2 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table2">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/3">
                    <input type="hidden" name="table" value="table3">
                    <input type="submit" style="background-color: ${result[0].table3 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table3">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/4">
                    <input type="hidden" name="table" value="table4">
                    <input type="submit" style="background-color: ${result[0].table4 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table4">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="box">문</div>
                &emsp;&emsp;&emsp;
                <div class="table-group">
                    <form method="post" action="/process/res/5">
                      <input type="hidden" name="table" value="table5">
                      <input type="submit" style="background-color: ${result[0].table5 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table5">
                    </form>
                  </div>
                </div>
            </body>
            </html>
                `;
          
                res.write(html);
              }
              else {
                const html = `
                <html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .table-group {
                  display: inline-block;
                  margin: 10px;
                }
          
                input[type="submit"] {
                  background-color: #FFFFE0;
                  padding: 10px 20px;
                  font-size: 18px;
                }
                .box {
                  background-color: #e0f5ff;
                  padding: 10px 20px;
                  font-size: 18px;
                  display: inline-block;
                }
              </style>
<html>
            <head>
              <meta charset="UTF-8">
              <style>
                .container {
                  text-align: center;
                }
          
                .table-group {
                  display: inline-block;
                  margin: 10px;
                }
          
                input[type="submit"] {
                  background-color: #FFFFE0;
                  padding: 10px 20px;
                  font-size: 18px;
                }
                .box {
                  background-color: #e0f5ff;
                  padding: 10px 20px;
                  font-size: 18px;
                  display: inline-block;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/1">
                    <input type="hidden" name="table" value="table1">
                    <input type="submit" style="background-color: ${result[0].table1 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table1">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/2">
                    <input type="hidden" name="table" value="table2">
                    <input type="submit" style="background-color: ${result[0].table2 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table2">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="table-group">
                  <form method="post" action="/process/res/3">
                    <input type="hidden" name="table" value="table3">
                    <input type="submit" style="background-color: ${result[0].table3 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table3">
                  </form>
                </div>
                <div class="table-group">
                  <form method="post" action="/process/res/4">
                    <input type="hidden" name="table" value="table4">
                    <input type="submit" style="background-color: ${result[0].table4 === null ? buttonColorMap.null : buttonColorMap.notNull}" value="Table4">
                  </form>
                </div>
              </div>
              <div class="container">
                <div class="box">문</div>
                &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                </div>
            </body>
            </html>
                `;
          
                res.write(html);
              }
        } else {
          res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
          res.write('<h1>예약 시간 저장 실패</h1>');
          res.end();
        }
      });
    } else {
      res.writeHead(200, { "Content-Type": "text/html;charset=utf8" });
      res.write('<h1>잘못된 시간 입력</h1>');
      res.end();
    }
  });
  
//구글지도 활용
router.route('/process/map').post(function(req,res){
  console.log('/process/map 라우팅 함수 호출됨.');

  // pool 객체가 초기화된 경우, addRes 함수 호출하여 예약 시간 저장
  appMap(res_name, function(err, result){
    if(err){
      console.error('구글 지도 사용 중 오류 발생: ' + err.stack);
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h2>구글 지도 사용 중 오류 발생</h2>');
      res.write('<p>'+ err.stack+'</p>');
      res.end();
      return;
    }

    if(result){
      console.dir(result);
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      const html = `
      <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" id="viewport" content="width=device-width, height=device-height, initial-scale=1" >
    <title>구글맵 1</title>
        
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        
        html, body {
            width: 100%;
            height: 100%;
        }
        
        #map {
            width: 100%;
            height: 95%;
        }
    </style>
    
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCLGvsMIUrwOVWuFr_cNYwR2jbijNFXgjs"></script>
    
    <script>
        function onLoad() {
            initMap();
        }
        
        var map;
        var centerLocation = {lat: ${result[0].lat}, lng: ${result[0].lng}};

         
        function initMap() {
             
            map = new google.maps.Map(document.getElementById('map'), {
                center: centerLocation,
                zoom: 17
            });
            
            var marker = new google.maps.Marker({
                position:centerLocation,
                icon:'/public/mylocation.png',
                animation:google.maps.Animation.BOUNCE
            });

            marker.setMap(map);
        }
        
    </script>
    
</head>
<body onload="onLoad()">
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
        &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
    <button onclick="window.history.back()">이전</button>
    <div id="map"></div>
</body>
</html>
          `;
          res.write(html);
      res.end();
    }
    else{
      res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
      res.write('<h1>구글지도 오류.</h1>');
      res.end();
    }
  });
});
  

//라우터 객체 등록
app.use('/',router);


// 사용자를 등록하는 함수
var addUser = function (id, password, callback) {
    console.log('addUser 호출됨.');

    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결의 스레드 아이디 : ' + conn.threadId);

        // 데이터를 객체로 만듦
        // SQL문 실행
        var exec = conn.query('insert into users set id= ?, password = ?', [id, password], function (err, result) {
            conn.release();
            console.log('실행된 SQL : ' + exec.sql);

            if (err) {
                console.log('SQL 실행 시 에러 발생.');
                console.dir(err);
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    });
};



    
//사용자를 인증하는 함수
var authUser = function(id, password, callback) {
    console.log('authUser 호출됨.');

    // 커넥션 풀에서 연결 객체를 가져옴
    pool.getConnection(function(err, conn){
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 :'+conn.threadId);

        var columns = ['id'];
        var tablename='users';

        //SQL문을 실행합니다.
        var exec = conn.query ("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows){
            conn.release();
            console.log('실행 대상 SQL: '+exec.sql);

            if(rows.length>0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.',id, password);
                callback(null,rows);
            }
            else{
                console.log("일치하는 사용자를 찾지 못함.");
                callback(null,null);
            }
        });
    });
};

// 예약 내역 확인
var checkRes = function (id, callback) {
  console.log('checkRes 호출됨.');

  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }
      console.log('데이터베이스 연결의 스레드 아이디 : ' + conn.threadId);

      // 데이터를 객체로 만듦
      // SQL문 실행
      var exec = conn.query('Select table_res.rest_id, res_time, table1, table2, table3, table4, table5, table6, table7, table8, table9, table10, phone from table_res, restaurant where restaurant.rest_id = table_res.rest_id and (table1 = ? or table2 = ? or table3 = ? or table4 = ? or table5 = ? or table6 = ? or table7 = ? or table8 = ? or table9 = ? or table10 = ?)', [id, id, id, id, id, id, id, id, id, id], function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('내역확인 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result);
      });
  });
};

// 음식점 이름 검색
var searchName = function (restaurantName, callback) {
  console.log('호출됨.');

  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }

      // SQL문 실행
      var exec = conn.query('Select rest_id, food_kind, phone FROM restaurant WHERE rest_id = ?', restaurantName, function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('식당 이름으로 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result);
      });
  });
};

//음식 종류 설정
var food_kind_search = function (food_kind, callback) {
    console.log('음식 종류 설정 호출됨.');
  
    pool.getConnection(function (err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
  
        // SQL문 실행
        var exec = conn.query('Select rest_id, food_kind, phone FROM restaurant WHERE food_kind = ?', food_kind, function (err, result) {
            conn.release();
            console.log('실행된 SQL : ' + exec.sql);
  
            if (err) {
                console.log('음식 종류 설정 SQL 실행 시 에러 발생.');
                console.dir(err);
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    });
  };

// 시간 검색
var searchTime = function (restaurantName, callback) {
  console.log('searchTime 호출됨.');

  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }

      // SQL문 실행
      var exec = conn.query('Select * FROM table_res, restaurant WHERE table_res.rest_id = restaurant.rest_id and table_res.rest_id = ?', restaurantName, function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('식당 이름으로 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result);
      });
  });
};

// 테이블 검색
var searchTable = function (res_name, time, callback) {
  console.log('searchTable 호출됨.');

  var param = [res_name, 'time'+time];
  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }

      // SQL문 실행
      var exec = conn.query('Select table_res.rest_id, res_time, table1, table2, table3, table4, table5, table6, table7, table8, table9, table10, count, table_num FROM table_res, restaurant WHERE table_res.rest_id = restaurant.rest_id and table_res.rest_id = ? and res_time = ?', param, function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('식당 이름으로 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result);
      });
  });
};

// 예약된 사람 수 세기
var countUser = function (restaurantName, res_time, callback) {
  console.log('예약된 사람 수 호출됨.');

  var param = [restaurantName, 'time'+res_time];
  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }

      // SQL문 실행
      var exec = conn.query('SELECT (COUNT(table1) + COUNT(table2) + COUNT(table3) + COUNT(table4) + COUNT(table5) + COUNT(table6) + COUNT(table7)) AS count FROM table_res WHERE rest_id = ? AND res_time = ?', param, function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('식당 이름으로 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result[0].count);
      });
  });
};

//예약 취소
var delTable = function (resTime, tableNum, restName, callback) {
  console.log('예약 취소 호출됨.');

  var param = ['table'+tableNum, restName, 'time'+resTime];
  pool.getConnection(function (err, conn) {
    if (err) {
      if (conn) {
        conn.release();
      }
      callback(err, null);
      return;
    }

    // SQL문 실행
    var exec = conn.query('update table_res set ?? = null where rest_id = ? and res_time = ?', param, function (err, result) {
      console.log('실행된 SQL : ' + exec.sql);

      if (err) {
        console.log('식당 이름으로 SQL 실행 시 에러 발생.');
        console.dir(err);
        conn.release();
        callback(err, null);
        return;
      }
      countUser(restName, resTime, function(err, count) {
        console.log('count: '+count)
        if (err) {
          conn.release();
          console.log('예약된 사용자 수 가져오기 중 에러 발생.');
          console.dir(err);
          callback(err, null);
          return;
        }

        var exec2 = conn.query('UPDATE table_res SET count = ? WHERE rest_id = ? AND res_time = ?', [count, restName, 'time'+resTime], function(err, result2) {
          console.log('exec2 실행된 SQL: ' + exec2.sql);
          console.log(exec2.sql);

          if (err) {
            console.log('exec2 SQL 실행 시 에러 발생.');
            console.dir(err);
            callback(err, null);
            return;
          }

          conn.release();
          callback(null, result2);
        });
      });
    });
  });
};


// table에 예약 시간 저장
var addRes = function(table_num, callback) {
  console.log('addRes 호출됨.');
  var tableNum = table_num;
  pool.getConnection(function(err, conn) {
    if (err) {
      if (conn) {
        conn.release();
      }
      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결의 스레드 아이디: ' + conn.threadId);
    searchTable(res_name, res_time, function(err, result) {
      if (err) {
        console.error('예약 시간 저장 중 오류 발생: ' + err.stack);
        callback(err, null);
        return;
      }
      if (result) {
        console.dir(result);
        if (result[0][tableNum] === null) {
          // users 테이블에 예약한 식당 이름, 시간 저장하기
          var exec1 = conn.query('UPDATE users SET res_time = ?, store = ? WHERE id = ?', [res_time, res_name, username], function(err, result) {
            console.log('users 테이블에 예약한 식당 이름, 시간 저장 실행된 SQL: ' + exec1.sql);

            if (err) {
              conn.release();
              console.log('users 테이블에 예약한 식당 이름, 시간 저장 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
            }

            // table_res 테이블에 예약 시간, 테이블에 유저 이름 저장
            var exec2 = conn.query('UPDATE table_res SET ?? = ? WHERE rest_id = ? AND res_time = ?', [table_num, username, res_name, 'time' + res_time], function(err, result) {
              console.log('table_res 테이블에 예약 시간, 테이블에 유저 이름 저장 실행된 SQL: ' + exec2.sql);
              console.log(exec2.sql);

              if (err) {
                conn.release();
                console.log('table_res 테이블에 예약 시간, 테이블에 유저 이름 저장 SQL 실행 시 에러 발생.');
                console.dir(err);
                callback(err, null);
                return;
              }

            
              countUser(res_name, res_time, function(err, count) {
                console.log('count: '+count)
                if (err) {
                  conn.release();
                  console.log('예약된 사용자 수 가져오기 중 에러 발생.');
                  console.dir(err);
                  callback(err, null);
                  return;
                }

                var exec3 = conn.query('UPDATE table_res SET count = ? WHERE rest_id = ? AND res_time = ?', [count, res_name, 'time'+res_time], function(err, result) {
                  console.log('exec3 실행된 SQL: ' + exec3.sql);
                  console.log(exec3.sql);

                  if (err) {
                    conn.release();
                    console.log('exec3 SQL 실행 시 에러 발생.');
                    console.dir(err);
                    callback(err, null);
                    return;
                  }

                  conn.release();
                  callback(null, result);
                });
              });
            });
          });
        } else {
          console.log('이미 예약된 테이블입니다.');
          callback(err, null);
        }
      }
    });
  });
};

// 위도경도 찾기
var appMap = function (res_name, callback) {
  console.log('appMap 호출됨.');

  pool.getConnection(function (err, conn) {
      if (err) {
          if (conn) {
              conn.release();
          }
          callback(err, null);
          return;
      }

      // SQL문 실행
      var exec = conn.query('Select lat,lng FROM restaurant WHERE rest_id = ?', res_name, function (err, result) {
          conn.release();
          console.log('실행된 SQL : ' + exec.sql);

          if (err) {
              console.log('위도 경도 찾는 SQL 실행 시 에러 발생.');
              console.dir(err);
              callback(err, null);
              return;
          }
          callback(null, result);
      });
  });
};




app.all('*',function(req,res) {
    res.status(404).send('<h1> 요청하신 페이지는 없습니다.</h1>');
});


var errorHandler = expressErrorHandler({
    static: {
        '404':'./404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스 서버를 시작합니다. : '+app.get('port'));
});