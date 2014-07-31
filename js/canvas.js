define(function(){
    var Canvas = function(){
        this.width = null;
        this.height = null;
        this.color = null;
    }
    Canvas.prototype.init = function(width, height, color){
        this.width = width;
        this.height = height;
        this.color = color;

        var canvas = $('canvas')[0];
        canvas.width = width;
        canvas.height = height;
        this.clearCanvas();
    }
    Canvas.prototype.clearCanvas = function(){
        var canvas = $('canvas')[0];
        if (!canvas.getContext) {
            console.error('No canvas support!');
        } else {
            ctx = canvas.getContext('2d');
            //clear the canvas
            ctx.fillStyle = this.color;
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
    return Canvas;
});
    
