let images = [
  './images/alien.jpeg',
  './images/batman.png',
  './images/cyclip.png',
  './images/megaman.jpeg',
  './images/powerUP.jpeg',
  './images/spiderman.jpeg',
  './images/superman.png',
  './images/wolverine.png',
  './images/alien.jpeg',
  './images/batman.png',
  './images/cyclip.png',
  './images/megaman.jpeg',
  './images/powerUP.jpeg',
  './images/spiderman.jpeg',
  './images/superman.png',
  './images/wolverine.png'
]

function tableBuilder(){
  let num = 0;
  let body = document.getElementsByTagName('body')[0];
  let table = document.createElement('table');
  let tableBody = document.createElement('tb');
  for (let rows = 0; rows < 4; rows++){
    let tableRow = document.createElement('tr');
      for (let columns = 0; columns < 4; columns++) {
        let cells = document.createElement('td');
        let image = document.createElement('img');
        image.src='./images/questionmark.jpeg'
        image.id=num.toString()
        num++;
        tableRow.appendChild(cells);
        cells.appendChild(image);
      }
      tableBody.appendChild(tableRow);
    }
  table.appendChild(tableBody);
  body.appendChild(table);
};

let firstCardFlipped = null;
let secondCardFlipped = null;
let clickCount = 0;

function clickListener() {
  let containers = document.getElementsByTagName('img')
  let clickCountDisplay = document.getElementsByTagName('h2')[0]
  for (let i = 0; i < images.length; i++) {
    let image = containers[i];
    let src = images[i];
    image.addEventListener("click", function() {
      if (!firstCardFlipped && !secondCardFlipped && image.src.includes('questionmark')) {
        clickCount++
        if(clickCount > 99) {
          clickCount = 99
        }
        clickCountDisplay.textContent=clickCount;
        image.src = src;
        let timer = setTimeout(function() {
                                            image.src='./images/questionmark.jpeg';
                                            firstCardFlipped = null;
                                          }, 2000);
        firstCardFlipped = {timer: timer, image: image};
        return
      }
      if (firstCardFlipped && !secondCardFlipped && (firstCardFlipped.image !== image) && image.src.includes('questionmark')) {
        clickCount++
        if(clickCount > 99) {
          clickCount = 99
        }
        clickCountDisplay.textContent=clickCount;
        image.src = src;
        let timer = setTimeout(function() {
                                            image.src='./images/questionmark.jpeg';
                                            secondCardFlipped = null;
                                          }, 2000);
        secondCardFlipped = {timer: timer, image: image};
      }
      if (firstCardFlipped && secondCardFlipped) {
        if (firstCardFlipped.image.src === secondCardFlipped.image.src ){
          clearTimeout(firstCardFlipped.timer);
          clearTimeout(secondCardFlipped.timer);
          firstCardFlipped = null;
          secondCardFlipped = null;
          gameOver(containers);
        }
      }
    });
  };
};

totalCards = 16;
cardsPaired = 0;

function gameOver(imgElements) {
  for (let i = 0; i < imgElements.length; i++) {
    let image = imgElements[i];
    if (!image.src.includes('questionmark')) {
      cardsPaired++
    }
  }
  if (cardsPaired < totalCards) {
    cardsPaired = 0;
    return;
  }
  greetPlayer(clickCount);
  save(clickCount);
};

save = (clickCount) => {
  let score = {'score': clickCount};
  $.ajax({
    url: "/scores",
    type: "POST",
    data: JSON.stringify(score),
    contentType: 'application/json'
  });
};

function greetPlayer(clickCount){
  let cells = document.getElementsByTagName('td')
  let letters = ['G','A','M','E','O','V','E','R','G','O','O','D','G','A','M','E'];
  if (clickCount > 40) {
    letters = ['G','A','M','E','O','V','E','R','B','A','D','-','G','A','M','E'];
  }

  for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    let img = document.getElementById(i);
    cell.removeChild(img);
    let paragraph = document.createElement("p");
    let letter = document.createTextNode(letters[i]);
    paragraph.appendChild(letter);
    cell.appendChild(paragraph);
  }
};

function shuffle(imagesArray) {
  for (let i = imagesArray.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [imagesArray[i - 1], imagesArray[j]] = [imagesArray[j], imagesArray[i - 1]];
  };
};

document.addEventListener("DOMContentLoaded", function() {
  shuffle(images);
  tableBuilder();
  clickListener();
});

let scoreListRequest = new XMLHttpRequest();
scoreListRequest.open('GET', '/scores');
scoreListRequest.send(null);

scoreListRequest.onreadystatechange = function () {
  let DONE = 4; // readyState 4 means the request is done.
  let OK = 200; // status 200 is a successful return.
  if (scoreListRequest.readyState === DONE) {
    if (scoreListRequest.status === OK) {
      let scores = JSON.parse(scoreListRequest.response);
      let ul = document.getElementsByTagName('ul')[0];
      for (let i = 0; i < scores.length; i++) {
        let score = document.createTextNode(scores[i].score);
        let li = document.createElement('li');
        let p = document.createElement('p');
        p.appendChild(score);
        li.appendChild(p);
        ul.appendChild(li);
      }
    } else {
      console.log('Error: ' + scoreListRequest.status); // An error occurred during the request.
    }
  }
};
