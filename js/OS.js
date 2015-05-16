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
            this.cursor.init(cursorSize, Math.floor(matrixCols/2), cursorColor);
            this.canvas.init(matrixCols*cursorSize, matrixRows*cursorSize, canvasColor);
            this.bindControls();

            var me = this;
            $(document).trigger('redrawCanvas', {
                'matrix': me.matrix,
                'cursor': me.cursor
            });
        },
        bindControls: function() {
            //@2do: try an event oriented approach, because this logic is better placed in the Cursor object.
            var me = this,
                gameKeyPressed = null;
            $(document).keydown(function(eventObj) {
                gameKeyPressed = true;
                switch(eventObj.which) {
                    case 37: //left arrow
                    case 65: //A key
                        eventObj.preventDefault();
                        me.cursor.moveLeft(me.matrix);
                        break;
                    case 38: //up arrow
                    case 87: //W key
                        eventObj.preventDefault();
                        me.cursor.moveUp(me.matrix);
                        break;
                    case 39: //right arrow
                    case 68: //D key
                        eventObj.preventDefault();
                        me.cursor.moveRight(me.matrix);
                        break;
                    case 40: //down arrow
                    case 83: //S key
                        eventObj.preventDefault();
                        me.cursor.moveDown(me.matrix);
                        break;
                    default:
                        gameKeyPressed = false;
                        break;
                };
                if(gameKeyPressed) {
                    $(document).trigger('redrawCanvas', {
                        'matrix': me.matrix,
                        'cursor': me.cursor
                    });
                }
            });
        }
    }

    $(document).ready(function(){
        OS.init(9, 'rgb(255, 255, 0)', 40, 70, 'rgb(120,120,0)', 'rgb(0,0,0)');
        window.os = OS;
    });
});
