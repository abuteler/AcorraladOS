define(function(){
    var Cursor = function(){
        this.position = null
        this.size = null;
        this.color = null;
        this.acceleration = null;
        this.status = {
            'conquering': null
        };
        this.mapMatrixResponse = {
            0: 'void',
            1: 'lane',
            2: 'conquering',
            3: 'conquered'
        };
    }
    Cursor.prototype.init = function(size, x, color){
        this.size = size;
        this.acceleration = size;
        this.position = {
            x: x,
            y: 0
        }
        this.color = color;
        this.status = {
            'conquering': {
                'start': {
                    x: null,
                    y: null
                },
                'end': {
                    x: null,
                    y: null
                },
                'min-x': null,
                'max-x': null,
                'min-y': null,
                'max-y': null
            }
        };
        var me = this;
        //bind cursor movement response
        $(document).on('matrixResponse', function(e, data){
            me.evaluateMovement(me.mapMatrixResponse[data.status], data.newX, data.newY);
        });
    }
    Cursor.prototype.evaluateMovement = function(status, newX, newY){
        try {
            console.log(status);
            console.log(this.status.conquering['min-x']);
            console.log(this.status.conquering['max-x']);

            switch (status) {
                case 'lane':
                    //check if we're coming back to the lane from conquering
                    if (this.status.conquering.start.x) {
                        console.log('success!');
                        $(document).trigger('layFoundation');
                        this.resetCursorStatus();
                    }
                    this.position.x = newX;
                    this.position.y = newY;
                    break;
                case 'void':
                    //check if we´re starting to conquer
                    //Into the darkness... ^^
                    if (this.status.conquering.start.x === null) {
                        this.status.conquering.start.x = newX;
                        this.status.conquering.start.y = newY;
                    } else {
                        //save the furthest coordinates from the conquering start position
                        var deltaX = newX - this.status.conquering.start.x;
                        if (deltaX > 0) {
                            if(newX > this.status.conquering['max-x'])
                                this.status.conquering['max-x'] = newX;
                        } else if (deltaX < 0) {
                            if(newX < this.status.conquering['min-x'] || this.status.conquering['min-x'] === null)
                                this.status.conquering['min-x'] = newX;
                        }
                    }
                    $(document).trigger('conquering', { x: newX, y: newY});
                    this.position.x = newX;
                    this.position.y = newY;
                    break;
                case 'conquered':
                    //ignores movement request
                    break;
                case 'conquering':
                    console.log('death by crash');
                    //@2do: UI message: Oops! You seem to have crashed into yourself!
                    break;
            }
        } catch (error){
            console.error(error);
            //@2do: UI message: Whopsy daisies! There seems to have occured an error on initialization time.
        };
    }
    Cursor.prototype.moveLeft = function(){
        //trigger movement
        $(document).trigger('cursorMove', { x: this.position.x-1, y: this.position.y});
    }
    Cursor.prototype.moveRight = function(){
        //trigger movement
        $(document).trigger('cursorMove', { x: this.position.x+1, y: this.position.y});
    }
    Cursor.prototype.moveUp = function(){
        //trigger movement
        $(document).trigger('cursorMove', { x: this.position.x, y: this.position.y-1});
    }
    Cursor.prototype.moveDown = function(){
        //trigger movement
        $(document).trigger('cursorMove', { x: this.position.x, y: this.position.y+1});
    }
    Cursor.prototype.resetCursorStatus = function(){
        this.status = {
            'conquering': {
                'start': {
                    x: null,
                    y: null
                },
                'end': {
                    x: null,
                    y: null
                },
                'min-x': null,
                'max-x': null,
                'min-y': null,
                'max-y': null
            }
        };
    }
    return Cursor;
});
