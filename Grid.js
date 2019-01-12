class Grid {

    constructor(array, sections)
    {
        this.sections = sections;
        this.boxes = [];
        for(let x = 0; x < cols; x++){
            this.boxes[x] = [];
            for(let y = 0; y < rows; y++){
                this.boxes[x][y] = new Box;
            }
        }

        for(let i = 0; i < array.length; i++){
            let x = i % rows;
            let y = Math.floor(i/rows);
            if(array[i] != 0){
                this.boxes[x][y].setValue(array[i]);
            }
        }
    }

    readGrid()
    {

        // Remove impossible values from Box values
        for (let x = 0; x < cols; x++){
            for (let y = 0; y < rows; y++){
                console.log(this.boxes[x][y]);

                if( this.boxes[x][y].is_set() ){
                    let num = this.boxes[x][y].getValue();
                    // newArray.push(num);
                    // Remove this number from the boxes in the same row / column;
                    for (let i = 0; i < cols; i++){
                        if( !this.boxes[i][y].is_set() ){
                            let array = this.boxes[i][y];
                            this.boxes[i][y].removePossibility(num);
                        }

                        if( !this.boxes[x][i].is_set() ){
                            let array = this.boxes[x][i];
                            this.boxes[x][i].removePossibility(num);
                        }
                    }
                }
            }
        }
    }

    find_soleCandidate()
    {
        let available = [];
        let av;
        let placed = false;

        // Loop through the sections
        for(let n = 0; n < this.sections.length; n++){
          let numbers = [];

          // Get list of currently taken numbers in a 3x3 grid section
          for(let x = this.sections[n][0]; x < this.sections[n][0]+3; x++){
            for(let y = this.sections[n][1]; y < this.sections[n][1]+3; y++){
              if( grid.boxes[x][y].is_set() ){
                numbers.push(grid.boxes[x][y].getValue());
              }
            }
          }

          // Create an array of currently untaken numbers in that section
          let untaken = [1,2,3,4,5,6,7,8,9];
          untaken = untaken.filter(function(value, index, arr) {
              for(let number of numbers) {
                  if(value == number) {return false}
              }
              return true;
          });

          //console.log(a);

          for(let u of untaken) {
              for(let x = this.sections[n][0]; x < this.sections[n][0]+3; x++){
                  for(let y = this.sections[n][1]; y < this.sections[n][1]+3; y++){
                      if(!grid.boxes[x][y].is_set()){

                          // If the untaken number can go in the slot, add the position to the available list.
                          if(grid.boxes[x][y].has(u)){
                              available.push([x,y,u]);
                          }
                      }
                  }
              }

              console.log(available);
              // If the number can only go in one place. Then place that number in the slot.
              if(available.length == 1){
                  grid.boxes[available[0][0]][available[0][1]].setValue(u);
                  console.log('PLACED NUMBER ' + available);
                  placed = true;
                  //throw new Error("Placed a number!!" + available);
                  return;
              }
              available = [];
            }
          }
          if(placed != true){
              this.find_sameLine();
          }
    }


    find_sameLine() {
        console.log(sections);
        for(let n = 0; n < this.sections.length; n++){
            for(let number = 1; number < 10; number++) {

                let positions = [];
                //let failed = false;
                // Within current section
                function findRow(number, n, self) {
                    let c = -1;
                    let r = -1;
                    for(let x = self.sections[n][0]; x < self.sections[n][0]+3; x++){
                        for(let y = self.sections[n][1]; y < self.sections[n][1]+3; y++){
                            // Rule out
                            if(self.boxes[x][y].has(number)){
                                if(c != -1){
                                    c = (c == x) ? x : false;
                                    r = (r == y) ? y : false;
                                    if(c === false && r === false){
                                        return false
                                    }
                                } else {
                                    c = x;
                                    r = y;
                                }
                            }
                        }
                    }
                    if(c == -1 && r == -1){
                        return false;
                    }
                    return [c,r];
                }

                let success = findRow(number, n, this);

                console.log(success);

                if(success != false) {
                    if(success[0] !== false) {
                        for(let y = 0; y < rows; y++){
                            console.log('removed option '+success[0]+':'+y+':'+number);
                            boxes[success[0]][y].removePossibility(number);
                        }
                    } else if (success[1] !== false) {
                        for(let x = 0; x < cols; x++){
                            boxes[x][success[1]].removePossibility(number);
                        }
                    }
                }
            }
        }
    }

}
