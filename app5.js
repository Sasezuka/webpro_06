const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win ) || 0;
  let total = Number( req.query.total ) || 0;

  console.log( {hand, win, total});
  
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  
  // ここに勝敗の判定を入れる
  let judgement = '';
  if (hand === 'グー' && cpu === 'チョキ' ||
    hand === 'チョキ' && cpu === 'パー' ||
    hand === 'パー' && cpu === 'グー') {
    judgement = '勝ち';
    win += 1;
  } else if (hand === cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});


app.get("/highlow", (req, res) => {
  let Hi_L = req.query.Hi_L; // プレイヤーが選択した High (0) または Low (1)
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;
  let computerCard = req.query.computerCard; // コンピュータのカードを保持

  if (!computerCard) {
    // 初回リクエスト時にコンピュータのカードを生成
    computerCard = Math.floor(Math.random() * 10 + 1);
    return res.render('highlow', {
      computerCard: computerCard,
      playerCard: null,
      playerChoice: null,
      playerChoiceText: null,
      judgement: null,
      win: win,
      total: total,
    });
  }
  // プレイヤーが選択した後の処理
  const playerCard = Math.floor(Math.random() * 10 + 1);
  let judgement = '';
  if (Hi_L == 0) {
    // Highの処理
    if (playerCard > computerCard) {
      judgement = '勝ち';
      win++;
    } else if (playerCard === computerCard) {
      judgement = '引き分け';
    } else {
      judgement = '負け';
    }
  } else {
    // Lowの処理
    if (playerCard < computerCard) {
      judgement = '勝ち';
      win++;
    } else if (playerCard === computerCard) {
      judgement = '引き分け';
    } else {
      judgement = '負け'
    }
  }
  total++;

  const display = {
    computerCard: computerCard,
    playerCard: playerCard,
    playerChoice: Hi_L,
    playerChoiceText: Hi_L == 0 ? 'High' : 'Low',
    judgement: judgement,
    win: win,
    total: total,
  };

  res.render('highlow', display);
});

let targetNumber = Math.floor(Math.random() * 100) + 1; // グローバルに保持するランダムな数
let attempts = 0; // グローバルに保持する試行回数

app.get("/guess", (req, res) => {
  const guess = Number(req.query.guess); // ユーザーの推測値
  let message = ""; // 表示するメッセージ

  if (!guess) {
    // 初回アクセスまたは未入力
    message = "1から100の数字を入力してください";
  } else {
    attempts++; // 推測がある場合のみ試行回数を増加

    if (guess < targetNumber) {
      message = "もっと大きい数です";
    } else if (guess > targetNumber) {
      message = "もっと小さい数です";
    } else {
      message = `正解！ ${attempts}回で当てました！ 新しいゲームを開始します。`;
      // 新しいゲームのために状態をリセット
      targetNumber = Math.floor(Math.random() * 100) + 1;
      attempts = 0;
    }
  }

  res.render("guess", {
    message: message,
    guess: guess || null,
    attempts: attempts,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));