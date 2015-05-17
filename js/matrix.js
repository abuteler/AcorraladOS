define(function(){
    var Matrix = function(){
        this.rows = null;
        this.cols = null;
        this.state = [];
        this.status = {
            'void': 0,
            'lane': 1,
            'conquering': 2,
            'conquered': 3
        };
    }
    Matrix.prototype.init = function(rows, cols){
        this.rows = rows;
        this.cols = cols;
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
        var me = this;
        //bind cursor move event
        $(document).on('cursorMove', function(e, data){
            var status = me.state[data.y][data.x];
            $(document).trigger('matrixResponse', {
                'status': status,
                'newX': data.x,
                'newY': data.y
            });
        });
        //bind conquering event
        $(document).on('conquering', function(e, data){
            me.state[data.y][data.x] = me.status['conquering'];
        });
        //bind back to lane event
        $(document).on('layFoundation', function(e, data){
            me.layFoundation(data);
        });
    }
    Matrix.prototype.layFoundation = function(conquerData){
        console.log('laying foundation!');
        for (var i = conquerData['min-y']; i <= conquerData['max-y']; i++) {
            for (var j = conquerData['min-x']; j <= conquerData['max-x']; j++) {
                this.transformCell(j, i, conquerData);
            };
        };
    }
    Matrix.prototype.transformCell = function(x, y, conquerData){
        if (this.state[y][x] === this.status['conquering']) {
            this.state[y][x] = this.status['lane'];
        } else {
            if (this.state[y][x] === this.status['lane']) {
                //mmm... leave these be?
            } else {
                //deal with the void
                /* possible scenarios from the cell's point of view
                    1) the cell is enclosed between a lane and a conquering cell
                    2) the cell is enclosed between two conquering cells
                    3) the cell is enclosed by two lanes (advanced state of the game when closing a gap) 
                */
                var enclosedLeft = this.evaluateCellBoundaries(x, y, 'left', conquerData),
                    enclosedRight = this.evaluateCellBoundaries(x, y, 'right', conquerData),
                    boundByTotal = enclosedLeft.concat(enclosedRight);
                if (boundByTotal.length > 1) {
                    this.state[y][x] = this.status['conquered'];
                } else {
                    console.log('x: '+x);
                    console.log(boundByTotal);

                }
            }
        };
    }
    Matrix.prototype.evaluateCellBoundaries = function(x, y, direction, conquerData){
        var currentX = x,
            hitLimit = false,
            boundBy = [],
            limit = (direction === 'left') ? conquerData['min-x'] : conquerData['max-x'];
        do {
            if (this.state[y][currentX] === 1 || this.state[y][currentX] === 2 ) {
                boundBy.push(this.state[y][currentX]);
            }
            hitLimit = currentX === limit;
            currentX = (direction === 'left') ? currentX-1 : currentX+1;
        } while (hitLimit === false);

        return boundBy;
    }
    return Matrix;
});
