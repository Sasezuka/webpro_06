"use strict";

let number = 0; // 現在の投稿数
const bbs = document.querySelector('#bbs');

function fetchPosts() {
  const limit = document.getElementById('limit').value;
  const params = {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  fetch("/check", params)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then((response) => {
      const value = response.number;

      if (number !== value) {
        fetch("/read", {
          method: "POST",
          body: `limit=${limit}`, // 選択された表示件数を送信
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          return response.json();
        })
        .then((response) => {
          bbs.innerHTML = ""; // 古い投稿をクリア
          number = response.messages.length;
          const messages = response.messages.slice(-limit); // 最後のlimit件だけを表示
          for (const mes of messages) {
            const cover = document.createElement('div');
            cover.className = 'cover';

            const postNumber = document.createElement('span');
            postNumber.className = 'post-number';
            postNumber.innerText = mes.id;

            const nameArea = document.createElement('span');
            nameArea.className = 'name';
            nameArea.innerText = mes.name;

            const mesArea = document.createElement('span');
            mesArea.className = 'mes';
            mesArea.innerText = mes.message;

            const timeArea = document.createElement('span');
            timeArea.className = 'timestamp';
            timeArea.innerText = new Date(mes.timestamp).toLocaleString();

            cover.appendChild(postNumber);
            cover.appendChild(nameArea);
            cover.appendChild(mesArea);
            cover.appendChild(timeArea);

            bbs.appendChild(cover);
          }
        });
      }
    });
}

document.querySelector('#post').addEventListener('click', () => {
  const name = document.querySelector('#name').value;
  const message = document.querySelector('#message').value;

  const params = {
    method: "POST",
    body: 'name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  fetch("/post", params)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(() => {
      document.querySelector('#message').value = "";
      fetchPosts();
    });
});

document.querySelector('#check').addEventListener('click', fetchPosts);