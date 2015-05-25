define(['./utils'], function(Utils){
    var Ball = function (id, size, x, y, acceleration, direction) {
        this.id = id;
        this.size = size;
        this.position = {
            x: x,
            y: y
        };
        this.acceleration = acceleration;
        this.direction = direction;
        //start ball movement
        var me = this;
        this.clock = setInterval(function(){
            me.move();
        }, acceleration*100); //@2do: elaborate multiplier
        //bind events
        var me = this;
        $(document).on('matrixBallResponse', function(e, data){
            if (data.id === me.id) {
                if(data.status === undefined) {
                    console.log('me: ');
                    console.log(me);
                    clearInterval(me.clock);
                } else {
                    me.evaluateMovement(Utils.mapMatrixStatusResponse[data.status]);
                }
            }
        });
    }
    Ball.prototype.deflectDirection = function (direction) {
        switch (direction) {
            case 1:
                //top-right
                direction += 1; //top-left
                break;
            case 2:
                //right-bottom
                direction += 1; //bottom-left
                break;
            case 3:
                //bottom-left
                direction += 1; //top-left
                break;
            case 4:
                //left-top
                direction = 1; //top-left
                break;
        }

        return direction;
    }
    Ball.prototype.evaluateMovement = function (status) {
        switch(status){
            case 'void':
                //go on little one
                break;
            case 'lane':
                this.direction = this.deflectDirection(this.direction);
                // clearInterval(this.clock);
                break;
            case 'conquering':
                clearInterval(this.clock);
                console.log("you've been balled");
                //@2do: UI message here
                break;
            case 'conquered':
                //should not be able to collide with these type of cells
                break;
        }
    }
    Ball.prototype.move = function () {
        if(this.direction === undefined) {
            console.log(this);
            clearInterval(this.clock);
        }
        switch (this.direction) {
            case 1:
                //top-right
                this.position.y -= 1;
                this.position.x += 1;
                break;
            case 2:
                //right-bottom
                this.position.x += 1;
                this.position.y += 1;
                break;
            case 3:
                //bottom-left
                this.position.y += 1;
                this.position.x -= 1;
                break;
            case 4:
                //left-top
                this.position.x -= 1;
                this.position.y -= 1;
                break;
        }
        $(document).trigger('ballMoved', {
            id: this.id,
            x: this.position.x,
            y: this.position.y
        });
    }

    return Ball;
});
