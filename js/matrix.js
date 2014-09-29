define(function(){
    var Matrix = function(){
        this.rows = null;
        this.cols = null;
        this.color = null;
        this.state = [];
        this.status = {
            'void': 0,
            'lane': 1,
            'conquering': 2,
            'conquered': 3
        };
    }
    Matrix.prototype.init = function(rows, cols, color){
        this.rows = rows;
        this.cols = cols;
        this.color = color;
        for (var i = 0; i < rows; i++) {
            var row = [];
            for (var j = 0; j < cols; j++) {
                if (i === 0 || i === rows-1){
                    row.push(this.status['lane']);
                } else {
                    if (j === 0 || j === cols-1) {
                        row.push(this.status['lane']);
                    } else {
                        row.push(this.status['void']);
                    }
                }
            }
            this.state.push(row);
        }
    }
    Matrix.prototype.voidLength = function(rowIndex, colStart, direction){
        var colIndex = colStart,
            length = 0;        
        do {
            switch (direction) {
                case 'left':
                    colIndex -= 1;
                    break;
                case 'right':
                    colIndex += 1;
                    break;
            }
            length += 1;
        } while (this.state[rowIndex][colIndex] = this.status["void"]);
        return length;
    }
    Matrix.prototype.updateRow = function(rowIndex){
        var that = this,
            conqueringCoords = [],
            voidLeft = null,
            voidRight = null;
        //check for conquering coords
        $.each(this.state[rowIndex], function(index, col) {
            if (col === that.status['conquering']) {
                conqueringCoords.push(index);
            };
        });
        if (conqueringCoords.length > 1) {
            if(conqueringCoords.length = 2) {
                for (var i = conqueringCoords[0]; i <= conqueringCoords[1]; i++) {
                    if(i == conqueringCoords[0] || i === conqueringCoords[1]){
                        this.state[rowIndex][i] = this.status['lane'];
                    } else {
                        this.state[rowIndex][i] = this.status['conquered'];
                    }
                }
            } else {
                //I assume it's the bottom line of conquering cells
                $.each(conqueringCoords, function(index, col){
                    that.state[rowIndex][col] = this.status['lane'];
                });
            }
        } else {
            voidLeft = this.voidLength(rowIndex, conqueringCoords[0], 'left');
            voidRight = this.voidLength(rowIndex, conqueringCoords[0], 'right');
            if(voidLeft < voidRight) {

            } else if(voidRight < voidLeft){

            } else {
                console.log('@2do: defer');
            }
        }
    }
    Matrix.prototype.layFoundation = function(){
        var that = this;
        console.log('laying foundation!');
        $.each(this.state, function(rowIndex, row) {
            console.log(rowIndex);
            that.updateRow(rowIndex);
        });
    }
    return Matrix;
});
