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
    Matrix.prototype.voidLength = function(rowIndex){
        var counting = false,
            length = 0;
        $.each(this.state[rowIndex], function(index, col) {
            if (col === this.status['void']) {
                counting = true;
                length += 1;
            } else if (counting && (col === this.status['lane'] || col === this.status['conquering'])) {
                return false;
            };
        });
        return length;
    }
    Matrix.prototype.updateRow = function(rowIndex){
        var conqueringCoords = []
            voidLeft = null,
            voidRight = null;
        //check for conquering coords
        $.each(this.state[rowIndex], function(index, col) {
            if (col === this.status['conquering']) {
                conqueringCoords.push(index);
            };
        });
        if (conqueringCoords.length > 1) {
            for (var i = conqueringCoords[0]; i <= conqueringCoords[1]; i++) {
                if(i == conqueringCoords[0] || i === conqueringCoords[1]){
                    this.state[rowIndex][i] = this.status['lane'];
                } else {
                    this.state[rowIndex][i] = this.status['conquered'];
                }
            }
        } else {
            voidLeft = this.voidLength(rowIndex, col, 'left');
            voidRight = this.voidLength(rowIndex, col, 'right');
            if(voidLeft < voidRight) {

            } else if(voidRight < voidLeft){

            } else {
                console.log('@2do: defer');
            }
        }
    }
    Matrix.prototype.layFoundation = function(){
        console.log('laying foundation!');
        /*$.each(this.state, function(rowIndex, row) {
            $.each(row, function(colIndex, col){
                if (col === this.status['conquering']) {
                    col = this.status['lane'];
                    if (index >= this.cols) {};
                }
            });
        });*/
    }
    return Matrix;
});
