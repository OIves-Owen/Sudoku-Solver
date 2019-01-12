class Box {
    constructor() {
        this.value = null;
        this.possibilities = [1,2,3,4,5,6,7,8,9];
    }

    setValue(number) {
        this.value = number;
        this.possibilites = [];
    }

    getValue() {
        return this.value;
    }

    removePossibility(number) {
        if(this.has(number)){
            this.possibilities.splice(this.possibilities.indexOf(number), 1);
        }
    }

    is_set() {
        return this.value != null;
    }

    has(number) {
        return (this.possibilities.indexOf(number) != -1);
    }
}
