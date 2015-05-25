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
    Matrix.prototype.initialize = function(rows, cols){
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
        this.bindCursorEvents();
        this.bindBallEvents();
    }
    Matrix.prototype.bindCursorEvents = function(){
        var me = this;
        //bind cursor move event
        $(document).on('cursorMove', function(e, data){
            var status = me.state[data.y] && me.state[data.y][data.x];
            $(document).trigger('matrixCursorResponse', {
                'status': status,
                'newX': data.x,
                'newY': data.y
            });
        });
        //bind cursor conquering event
        $(document).on('conquering', function(e, data){
            me.state[data.y][data.x] = me.status['conquering'];
        });
        //bind cursor back to lane event
        $(document).on('layFoundation', function(e, data){
            me.layFoundation(data);
        });
    }
    Matrix.prototype.bindBallEvents = function(){
        var me = this;
        //bind cursor move event
        $(document).on('ballMoved', function(e, data){
            if(data.x > me.cols-1 || data.x < 0 ||
                data.y > me.rows-1 || data.y < 0 ){
                $(document).trigger('matrixBallResponse', {
                    'id': data.id,
                    'status': undefined
                });
                console.error(data);
            } else {
                var status = me.state[data.y][data.x],
                    boundary = null;
                if (status === me.status['lane']) {
                    //evaluate boundaries
                    boundary = me.evaluateBallBoundaries(data.x, data.y, data.direction);
                }
                $(document).trigger('matrixBallResponse', {
                    'id': data.id,
                    'status': status,
                    'boundary': boundary
                });
            }
        });
    }
    Matrix.prototype.layFoundation = function(conquerData){
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
                    enclosedRight = this.evaluateCellBoundaries(x, y, 'right', conquerData);
                if (enclosedLeft.length > 0 && enclosedRight.length > 0) {
                    this.state[y][x] = this.status['conquered'];
                    /* DISCLAIMER \*
                    /* This logic leaves 1 scenario where the user closes a gap between two towers
                       and the newly enclosed void surface remains void, and a 2nd scenario where rare
                       shapes colors some void they shouldn't, that I'm, for now, leaving as design.
                       So let's get to those balls then. :)
                       17 de Mayo, 2015
                    */
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
    Matrix.prototype.evaluateBallBoundaries = function(x, y, direction){
        var boundary = null;
        switch (direction) {
            case 1:
                //top-right
                if (y-1 < 0 || 
                        this.state[y-1][x] === this.status['conquered'] ) {
                    boundary = 'top';
                } else {
                    boundary = 'right';
                }
                break;
            case 2:
                //right-bottom
                if (y+1 > this.rows-1 || 
                        this.state[y+1][x] === this.status['conquered'] ) {
                    boundary = 'bottom';
                } else {
                    boundary = 'right';
                }
                break;
            case 3:
                //bottom-left
                if (y+1 > this.rows-1 || 
                        this.state[y+1][x] === this.status['conquered'] ) {
                    boundary = 'bottom';
                } else {
                    boundary = 'left';
                }
                break;
            case 4:
                //left-top
                if (y-1 < 0 || 
                        this.state[y-1][x] === this.status['conquered'] ) {
                    boundary = 'top';
                } else {
                    boundary = 'left';
                }
                break;
        }
        return boundary;
    }

    return Matrix;
});
