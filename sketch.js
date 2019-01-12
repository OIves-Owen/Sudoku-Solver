let boxes = [];
var cols = 9;
var rows = 9;
var s = 40;
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
var seeder = sudoku1;
var defaultbox = [1,2,3,4,5,6,7,8,9];
var cnv;
var btn;
var started = false;
var fps = 60;
let grid = new Grid(seeder, sections);
//p5's setup function is called once on load
function setup() {
  cnv = createCanvas(rows*s, rows*s+50);
  cnv.parent('sketch-holder');

  btn = document.getElementById('button');
  btn.addEventListener('click', () => {
    console.log("let's go");
    grid = new Grid(seeder, sections);
    loop();
    done = false;
    started = true;
  });

  frameRate(60);
}

//p5's draw function is called every frame
function draw() {
    background(255);
  if(started == true){
    grid.readGrid();
    grid.find_soleCandidate(sections);
    grid.find_sameLine();
  }
  display();
}





// Look at every square and declare the possible values for it.
// function createValues()
// {
//
//   // Remove impossible values from Box values
//   for (let x = 0; x < cols; x++){
//     for (let y = 0; y < rows; y++){
//
//       if( grid.boxes[x][y].is_set() ){
//         let num = grid.boxes[x][y].getValue();
//         // newArray.push(num);
//         // Remove this number from the grid.boxes in the same row / column;
//         for (let i = 0; i < cols; i++){
//           if( !grid.boxes[i][y].is_set() ){
//             let array = grid.boxes[i][y];
//             grid.boxes[i][y].removePossibility(num);
//           }
//
//           if( !grid.boxes[x][i].is_set() ){
//             let array = grid.boxes[x][i];
//             grid.boxes[x][i].removePossibility(num);
//           }
//         }
//       }
//
//     }
//   }
// }



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
          boxes[x][y].setValue(i);
          return;
        }
      }
    }
  }
  //if no values worked, call guess again
  guess();
}

// Place values
// function placeValues(){
//   let available = [];
//   let av;
//   let placed = false;
//
//   // Loop through the sections
//   for(let n = 0; n < sections.length; n++){
//     let numbers = [];
//
//     // Get list of currently taken numbers in a 3x3 grid section
//     for(let x = sections[n][0]; x < sections[n][0]+3; x++){
//       for(let y = sections[n][1]; y < sections[n][1]+3; y++){
//         if( grid.boxes[x][y].is_set() ){
//           numbers.push(grid.boxes[x][y].getValue());
//         }
//       }
//     }
//
//     // Create an array of currently untaken numbers in that section
//     let untaken = [1,2,3,4,5,6,7,8,9];
//     untaken = untaken.filter(function(value, index, arr) {
//         for(let number of numbers) {
//             if(value == number) {return false}
//         }
//         return true;
//     });
//
//     //console.log(a);
//
//     for(let u of untaken) {
//         for(let x = sections[n][0]; x < sections[n][0]+3; x++){
//             for(let y = sections[n][1]; y < sections[n][1]+3; y++){
//                 if(!grid.boxes[x][y].is_set()){
//
//                     // If the untaken number can go in the slot, add the position to the available list.
//                     if(grid.boxes[x][y].has(u)){
//                         available.push([x,y,u]);
//                     }
//                 }
//             }
//         }
//
//         console.log(available);
//         // If the number can only go in one place. Then place that number in the slot.
//         if(available.length == 1){
//             grid.boxes[available[0][0]][available[0][1]].setValue(u);
//             console.log('PLACED NUMBER ' + available);
//             placed = true;
//             //throw new Error("Placed a number!!" + available);
//             return;
//         }
//         available = [];
//       }
//     }
//     if(placed != true){
//         matchingRow();
//     }
// }


// Display grid and text
function display(){

  //grid
  for(let x = 1; x < cols+1; x++){
    if(x == 0 || x == 3 || x == 6 || x == 9){
      stroke(0);
    } else {
      stroke(150);
    }
    line(x*s,0,x*s,cols*s);
  }
  for(let y = 1; y < rows+1; y++){
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
      if(grid.boxes[x][y].is_set()){
        noStroke();
        fill(0);
        textSize(25);
        text(grid.boxes[x][y].getValue(), x*s+s/3, y*s+s/7, (x*s)+s, (y*s)+s);
      }
    }
  }
  //finished text
  if(done==true){
    console.log(finText);
    fill(0,150,0);
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
      if(boxes[x][y].is_set()){total++}
    }
  }
  // Check for duplicates in 3x3 sections
  if(total < 81){return -1}
  for(let n = 0; n < sections.length; n++){
    for(let i = 1; i < rows+1; i++){
      let amount = 0;
      for(let x = sections[n][0]; x < sections[n][0]+3; x++){
        for(let y = sections[n][1]; y < sections[n][1]+3; y++){
          if(!boxes[x][y].is_set()){return -1}
          if(boxes[x][y].getValue() == i){
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
