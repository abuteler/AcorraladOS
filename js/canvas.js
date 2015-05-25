define(function(){
    var Canvas = function(){
        this.width = null;
        this.height = null;
        this.colors = null;
    }
    Canvas.prototype.initialize = function(width, height, colors){
        this.width = width;
        this.height = height;
        this.colors = colors;

        var canvas = $('canvas')[0];
        canvas.width = width;
        canvas.height = height;
        this.clearCanvas();

        var me = this;
        //bind redraw event
        $(document).bind('redrawCanvas', function(e, data){
            me.clearCanvas();
            me.drawMatrix(data.matrix, data.cursor.size);
            me.drawCursor(data.cursor);
            me.drawBouncers(data.bouncers);
        });
    }
    Canvas.prototype.clearCanvas = function(){
        var canvas = $('canvas')[0];
        if (!canvas.getContext) {
            console.error('No canvas support!');
        } else {
            ctx = canvas.getContext('2d');
            //clear the canvas
            ctx.fillStyle = this.colors['void'];
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
    Canvas.prototype.drawSquare = function(x, y, size, color){
        var canvas = $('canvas')[0];
        if (!canvas.getContext) {
            console.error('No canvas support!');
        } else {
            ctx = canvas.getContext('2d');
            //render rectangle
            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size);
        }
    }
    Canvas.prototype.drawMatrix = function(matrix, cursorSize){
        var positionX = null,
            positionY = null,
            color = null,
            me = this;
        $.each(matrix.state, function(key, row){
            positionY = key*cursorSize;
            $.each(row, function(key, col){
                positionX = key*cursorSize;
                switch (col) {
                    case 0:
                        color = me.colors["void"];
                        break;
                    case 1:
                        color = me.colors["lane"];
                        break;
                    case 2:
                        color = me.colors["conquering"];
                        break;
                    case 3:
                        color = me.colors["conquered"];
                        break;
                }
                me.drawSquare(positionX,
                    positionY,
                    cursorSize,
                    color
                );
            });
        });
    }    
    Canvas.prototype.drawCursor = function(cursor){
        this.drawSquare(cursor.position.x*cursor.size,
                        cursor.position.y*cursor.size,
                        cursor.size,
                        this.colors.cursor);
    }
    Canvas.prototype.drawBouncers = function(bouncers){
        // console.log(bouncers.balls[0]);
        var me = this;
        $.each(bouncers.balls, function(key, ball){
            me.drawSquare(ball.position.x*ball.size,
                            ball.position.y*ball.size,
                            ball.size,
                            me.colors.bouncers);
        });
    }
    return Canvas;
});
    
