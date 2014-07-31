define(function(){
    var Cursor = function(){
        this.position = null
        this.size = null;
        this.color = null;
        this.acceleration = null;
        this.status = {
            'toppest': null,
            'leftest': null,
            'rightest': null,
            'bottomest': null
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
            'toppest': true,
            'leftest': false,
            'rightest': false,
            'bottomest': false
        };
    }
    Cursor.prototype.moveLeft = function(matrix){
        if (matrix.state[this.position.y][this.position.x-1] === matrix.status['lane']) {
            //check if we're coming back to the lane from conquering
            if (matrix.state[this.position.y][this.position.x] === matrix.status['conquering']) {
                console.log('success!');
                this.position.x -= 1;
                matrix.layFoundation();
            } else {
                //regular movement
                this.position.x -= 1;
            }
        } else if (matrix.state[this.position.y][this.position.x-1] === matrix.status['void']){
            matrix.state[this.position.y][this.position.x-1] = matrix.status['conquering'];
            this.position.x -= 1;
        }
        return matrix;
    }
    Cursor.prototype.moveRight = function(matrix){
        if (matrix.state[this.position.y][this.position.x+1] === matrix.status['lane']){
            this.position.x += 1;
        } else if (matrix.state[this.position.y][this.position.x+1] === matrix.status['void']){
            matrix.state[this.position.y][this.position.x+1] = matrix.status['conquering'];
            this.position.x += 1;
        }
        return matrix;
    }
    Cursor.prototype.moveUp = function(matrix){
        if (matrix.state[this.position.y-1] && matrix.state[this.position.y-1][this.position.x] === matrix.status['lane']){
            this.position.y -= 1;
        } else if (matrix.state[this.position.y-1] && matrix.state[this.position.y-1][this.position.x] === matrix.status['void']) {
            matrix.state[this.position.y-1][this.position.x] = matrix.status['conquering'];
            this.position.y -= 1;
        }
        return matrix;
    }
    Cursor.prototype.moveDown = function(matrix){
        if (matrix.state[this.position.y+1] && matrix.state[this.position.y+1][this.position.x] === matrix.status['lane']){
            this.position.y += 1;
        } else if (matrix.state[this.position.y+1] && matrix.state[this.position.y+1][this.position.x] === matrix.status['void']) {
            matrix.state[this.position.y+1][this.position.x] = matrix.status['conquering'];
            this.position.y += 1;
        }
        return matrix;
    }
    return Cursor;
});
