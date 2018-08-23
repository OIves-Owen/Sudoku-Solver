let boxes = [];
var cols = 9;
var rows = 9;
var s = 40;
let memory;
var moves = [];
var guessed = false;
var guessLoop = 0;
var finText;
var done = false;

//Sections of the puzzle (3x3 squares)
var sections = [
  [0,0],
  [0,3],
  [0,6],
  [3,0],
  [3,3],
  [3,6],
  [6,0],
  [6,3],
  [6,6]
];

//Array representation of sudoku
var sudoku1 = [
  0,0,6,0,0,0,0,3,4,
  0,0,0,0,2,0,0,0,0,
  0,1,8,5,0,3,0,7,9,
  2,7,0,4,0,0,0,9,0,
  0,8,0,9,5,6,0,2,0,
  0,9,0,0,0,7,0,4,1,
  3,4,0,8,0,2,9,6,0,
  0,0,0,0,9,0,0,0,0,
  7,5,0,0,0,0,3,0,0,
];

var sudoku2 = [
  0,0,0,9,0,8,5,0,6,
  0,6,0,0,0,0,0,0,0,
  0,0,1,0,7,5,2,0,0,
  7,0,0,3,0,0,0,4,0,
  0,0,2,5,0,9,3,0,0,
  0,4,0,0,0,7,0,0,8,
  0,0,5,7,9,0,4,0,0,
  0,0,0,0,0,0,0,9,0,
  4,0,3,1,0,2,0,0,0,
]

var sudoku3 = [
  1,5,0,0,2,3,0,0,0,
  0,0,7,0,0,1,0,0,0,
  0,3,0,0,5,7,1,4,0,
  4,9,8,0,1,0,7,0,2,
  0,0,0,0,0,0,0,0,0,
  2,0,1,0,4,0,9,3,8,
  0,2,4,1,7,0,0,8,0,
  0,0,0,5,0,0,2,0,0,
  0,0,0,8,3,0,0,9,5
]

//Choose sudoku
var initial = sudoku3;

//p5's setup function is called once on load
function setup() {
  createCanvas(rows*s, rows*s+50);
  setupInitial();
}

//p5's draw function is called every frame
function draw() {
  background(200);
  createValues();
  placeValues();
  display();
  //noLoop();
}

// Uses the sudoku array to fill the boxes matrix
function setupInitial(){
  guessed = false;
  memory = [];
  for(let x = 0; x < cols; x++){
    boxes[x] = [];
    for(let y = 0; y < rows; y++){
      boxes[x][y] = [];
    }
  }
  for(i = 0; i < initial.length; i++){
    let x = i % rows;
    let y = Math.floor(i/rows);
    if(initial[i] != 0){
      boxes[x][y] = initial[i];
    }
  }
  //console.log(JSON.parse(JSON.stringify(boxes)));
}


// Look at every square and declare the impossible values for it.
function createValues(){
  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      if(typeof(boxes[x][y]) == "object"){
        boxes[x][y] = [];
      }
    }
  }
  for (let x = 0; x < cols; x++){
    for (let y = 0; y < rows; y++){
      if(typeof(boxes[x][y]) == "number"){
        let num = boxes[x][y];
        for (let i = 0; i < cols; i++){
          if(typeof(boxes[i][y]) == "object"){
            boxes[i][y].push(num);
            //console.log(i,y,num);
          }
          if(typeof(boxes[x][i]) == "object"){
            boxes[x][i].push(num);
            //console.log(x,i,num);
          }
        }
      }
    }
  }
}

// randomly guess a new value and apply it if it works (needs refining)
function guess(){

  // First check if guess has been looped too many times
  guessLoop++;
  if(guessLoop > 100){
    //console.log('too many');
    finished(0);
    guessed=false;
    guessLoop = 0;
    return;
  }
  guessed = false;
  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      if(typeof(boxes[x][y]) == "object"){
        let i = Math.floor(random(1,9));
        let av = true;
        for(let j = 0; j < boxes[x][y].length; j++){
          if(boxes[x][y][j] == i){av = false}
        }
        if(av == true){
          boxes[x][y] = i;
          memory = boxes;
          return;
        }
      }
    }
  }
  //if no values worked, call guess again
  guess();
}

// Place values
function placeValues(){
  let available = [];
  //console.log(JSON.parse(JSON.stringify(boxes)));
  let av;
  for(let n = 0; n < sections.length; n++){
    let numbers = [];
    for(let x = sections[n][0]; x < sections[n][0]+3; x++){
      for(let y = sections[n][1]; y < sections[n][1]+3; y++){
        if(typeof(boxes[x][y]) == "number"){
          numbers.push(boxes[x][y]);
        }
      }
    }
    for(let i = 1; i < cols+1; i++) {
      let taken = false;
      for(let o = 0; o < numbers.length; o++){
        if(i == numbers[o]){taken = true;}
      }
      if(!taken){
      for(let x = sections[n][0]; x < sections[n][0]+3; x++){
        for(let y = sections[n][1]; y < sections[n][1]+3; y++){
            if(typeof(boxes[x][y]) == "object"){
              av = true;
              for(let z = 0; z < boxes[x][y].length;z++){
                if(boxes[x][y][z] == i){
                  av = false;
                  //console.log('failed'+JSON.parse(JSON.stringify(boxes[x][y])));
                  break;
                } else {
                  //console.log('passed'+JSON.parse(JSON.stringify(boxes[x][y])));
                }
              }
              if(av == true){available.push([x,y,i]);}
              //console.log(JSON.parse(JSON.stringify(boxes[x][y])));
            }
          }
        }
      }
      if(available.length == 1){
        boxes[available[0][0]][available[0][1]] = i;
        moves.push(available[0][0],available[0][1],i);
        console.log('PLACED NUMBER ' + available);
        return;
      }
      available = [];
    }
  }
  let fin = checkFinished();
  finished(fin);
  if(fin == 0 || fin == 1 ){return;}
  if(!guessed){
    guess();
  } else {
    setupInitial();
    guessed = false;
  }
}

// Display grid and text
function display(){

  //grid
  for(let x = 0; x < cols+1; x++){
    if(x == 0 || x == 3 || x == 6 || x == 9){
      stroke(0);
    } else {
      stroke(150);
    }
    line(x*s,0,x*s,cols*s);
  }
  for(let y = 0; y < rows+1; y++){
    if(y == 0 || y == 3 || y == 6 || y == 9){
      stroke(0);
    } else {
      stroke(150);
    }
    line(0,y*s,cols*s,y*s);
  }

  //text
  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      if(typeof(boxes[x][y]) == "number"){
        noStroke();
        fill(0);
        textSize(25);
        text(boxes[x][y],x*s+s/3,y*s+s/7,(x*s)+s,(y*s)+s);
      }
    }
  }
  //finished text
  if(done==true){
    console.log(finText);
    fill(0,255,0);
    text(finText,width/2-60,height-40,100,100);
  }
}

//If not succeeded, reset
function finished(val){
  if(val == -1){
    return;
  }
  if(val == 1){
    done=true;
    finText = 'succeeded';
    noLoop();
  }
  if(val == 0){
    setupInitial();
  }

}

// Check whether the sudoku has been solved
function checkFinished(){
  let total;
  // If there are any empty boxes left, not finished
  for(let x = 0; x < cols; x++){
    for(let y = 0; y < rows; y++){
      if(typeof(boxes[x][y]) == "number"){total++}
    }
  }
  // Check for duplicates in 3x3 sections
  if(total < 81){return -1}
  for(let n = 0; n < sections.length; n++){
    for(let i = 1; i < rows+1; i++){
      let amount = 0;
      for(let x = sections[n][0]; x < sections[n][0]+3; x++){
        for(let y = sections[n][1]; y < sections[n][1]+3; y++){
          if(typeof(boxes[x][y])=="object"){return -1}
          if(boxes[x][y]==i){
            amount++
          }
        }
      }
      if(amount > 1){return 0}
    }
    // Check for duplicates in rows or columns
    for(let i = 1; i < rows+1; i++){
      for(let x = 0; x < rows; x++){
        let amount = 0;
        for(let y = 0; y < rows; y++){
          if(boxes[x][y]==i){amount++}
        }
        if(amount > 1){return 0}
      }
      for(let x = 0; x < rows; x++){
        let amount = 0;
        for(let y = 0; y < rows; y++){
          if(boxes[y][x]==i){amount++}
        }
        if(amount > 1){return 0}
      }
    }
  }
  return 1;
}
