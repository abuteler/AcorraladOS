define(function(){
    var Cursor = function(){
        this.position = null
        this.size = null;
        this.color = null;
        this.acceleration = null;
        this.status = {
            'conquering': null
        };
    }
    Cursor.prototype.init = function(size, x, color){
        this.size = size;
        this.acceleration = size;
        this.position = {
            x: x,
            y: 0
        }
        this.color = color;
        this.status = {
            'conquering': {
                'start': {
                    x: null,
                    y: null
                },
                'end': {
                    x: null,
                    y: null
                }
            }
        };
    }
    Cursor.prototype.updatePosition = function(matrix, newX, newY){
        if (matrix.state[newY]) {
            switch (matrix.state[newY][newX]) {
                case matrix.status['lane']:
                    //check if we're coming back to the lane from conquering
                    if (matrix.state[this.position.y][this.position.x] === matrix.status['conquering']) {
                        console.log('success!');
                        matrix.layFoundation();
                        //@2do: reset cursor.status
                    }
                    this.position.x = newX;
                    this.position.y = newY;
                    break;
                case matrix.status['void']:
                    //check if we´re starting to conquer
                    if (this.status.conquering.start.x === null) {
                        this.status.conquering.start.x = this.position.x;
                        this.status.conquering.start.y = this.position.y;
                    };
                    this.position.x = newX;
                    this.position.y = newY;
                    matrix.state[newY][newX] = matrix.status['conquering'];
                    break;
                case matrix.status['conquering']:
                    console.log('death by crash');
                    break;
            }
        };
        return matrix;
    }
    Cursor.prototype.moveLeft = function(matrix){
        return this.updatePosition(matrix, this.position.x-1, this.position.y);
    }
    Cursor.prototype.moveRight = function(matrix){
        return this.updatePosition(matrix, this.position.x+1, this.position.y);
    }
    Cursor.prototype.moveUp = function(matrix){
        return this.updatePosition(matrix, this.position.x, this.position.y-1);
    }
    Cursor.prototype.moveDown = function(matrix){
        return this.updatePosition(matrix, this.position.x, this.position.y+1);
    }
    return Cursor;
});
