requirejs.config({
    baseUrl: 'js/',
    paths: {
        jquery: '../libs/jquery-2.1.1.min'
    }
});

requirejs(['jquery', 'cursor', 'matrix', 'canvas', 'bouncers'],
function($, Cursor, Matrix, Canvas, Bouncers){
    var OS = {
        cursor: new Cursor(),
        matrix: new Matrix(),
        canvas: new Canvas(),
        bouncers: new Bouncers(),
        initialize: function(cursorSize, ballSize, matrixRows, matrixCols, colors){
            this.matrix.initialize(matrixRows, matrixCols);
            this.cursor.initialize(cursorSize, Math.floor(matrixCols/2));
            this.canvas.initialize(matrixCols*cursorSize, matrixRows*cursorSize, colors);
            this.bindControls();
            var me = this,
                usrLvl = 1,
                refreshInterval = 100;
            //@2Do: implement user level
            this.bouncers.initialize(3, ballSize, matrixRows, matrixCols, usrLvl, refreshInterval);
            this.clock = setInterval(function(){
                me.triggerRedrawCanvas();
            }, refreshInterval);
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
                        me.cursor.moveLeft();
                        break;
                    case 38: //up arrow
                    case 87: //W key
                        eventObj.preventDefault();
                        me.cursor.moveUp();
                        break;
                    case 39: //right arrow
                    case 68: //D key
                        eventObj.preventDefault();
                        me.cursor.moveRight();
                        break;
                    case 40: //down arrow
                    case 83: //S key
                        eventObj.preventDefault();
                        me.cursor.moveDown();
                        break;
                    default:
                        gameKeyPressed = false;
                        break;
                };
                if(gameKeyPressed) {
                    me.triggerRedrawCanvas();
                }
            });
        },
        triggerRedrawCanvas: function () {
            var me = this;
            $(document).trigger('redrawCanvas', {
                'matrix': me.matrix,
                'cursor': me.cursor,
                'bouncers': me.bouncers
            });
        }
    }

    $(document).ready(function(){
        //colors are arrays to be able to do sets, and change colors according to level or by selection from the UI
        var cursorSize = 9,
            ballSize = 9,
            matrixRows = 40,
            matrixCols = 70,
            colors = {
                'cursor': ['rgb(255,0,0)'],
                'void': ['rgb(0,0,0)'],
                'lane': ['rgb(160,160,0)'],
                'conquering': ['rgb(255,160,0)'],
                'conquered': ['rgba(255,160,0,0.5)'],
                'bouncers': ['rgb(255,255,255)']
            };
        OS.initialize(cursorSize, ballSize, matrixRows, matrixCols, colors);
        window.os = OS;
    });
});
