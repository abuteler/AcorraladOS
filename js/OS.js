requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery: '../libs/jquery-2.1.1.min'
    }
});

requirejs(['jquery', 'cursor', 'matrix', 'canvas'],
function($, Cursor, Matrix, Canvas){
    var OS = {
        cursor: new Cursor(),
        matrix: new Matrix(),
        canvas: new Canvas(),
        init: function(cursorSize, cursorColor, matrixRows, matrixCols, matrixColor, canvasColor){
            this.matrix.init(matrixRows, matrixCols, matrixColor);
            this.cursor.init(cursorSize, Math.floor(matrixRows/2), cursorColor);
            this.canvas.init(matrixCols*cursorSize, matrixRows*cursorSize, canvasColor);
            this.bindControls();

            this.drawMatrix();
            this.drawCursor();
        },
        bindControls: function() {
            var that = this,
                gameKeyPressed = null;
            $(document).keydown(function(eventObj) {
                gameKeyPressed = true;
                switch(eventObj.which) {
                    case 37: //left arrow
                        eventObj.preventDefault();
                        that.matrix = that.cursor.moveLeft(that.matrix);
                        break;
                    case 38: //up arrow
                        eventObj.preventDefault();
                        that.matrix = that.cursor.moveUp(that.matrix);
                        break;
                    case 39: //right arrow
                        eventObj.preventDefault();
                        that.matrix = that.cursor.moveRight(that.matrix);
                        break;
                    case 40: //down arrow
                        eventObj.preventDefault();
                        that.matrix = that.cursor.moveDown(that.matrix);
                        break;
                    default:
                        gameKeyPressed = false;
                        break;
                };
                if(gameKeyPressed) {
                    that.canvas.clearCanvas();
                    that.drawMatrix();
                    that.drawCursor();
                }
            });
        },
        drawMatrix: function(){
            var positionX = null,
                positionY = null,
                that = this;
            $.each(this.matrix.state, function(key, row){
                positionY = key*that.cursor.size;
                $.each(row, function(key, col){
                    positionX = key*that.cursor.size;
                    if (col) {
                        that.canvas.drawSquare(positionX,
                            positionY,
                            that.cursor.size,
                            that.matrix.color);
                    }
                });
            });
        },
        drawCursor: function(){
            this.canvas.drawSquare(this.cursor.position.x*this.cursor.size,
                            this.cursor.position.y*this.cursor.size,
                            this.cursor.size,
                            this.cursor.color);
        }
    }

    $(document).ready(function(){
        OS.init(9, 'rgb(255, 255, 0)', 40, 70, 'rgb(120,120,0)', 'rgb(0,0,0)');
    });
});
