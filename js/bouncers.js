define(['./ball'], function(Ball){
    var Bouncers = function(){
        this.quantity = null;
        this.balls = [];
    }
    Bouncers.prototype.initialize = function (quantity, ballSize, matrixRows, matrixCols, usrLvl, refreshInterval) {
        this.quantity = quantity;
        var ball = null;
        for (var i = 0; i < quantity; i++) {
            ball = new Ball(
                i,
                ballSize,
                Math.floor(Math.random()*matrixCols),
                Math.floor(Math.random()*matrixRows),
                usrLvl,
                Math.ceil(Math.random()*4)
            );
            this.balls.push(ball);
        };
    }

    return Bouncers;
});
