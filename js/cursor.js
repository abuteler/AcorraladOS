define(function(){
    var Cursor = function(){
        this.position = null
        this.size = null;
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
    Cursor.prototype.init = function(size, x){
        this.size = size;
        this.acceleration = size;
        this.position = {
            x: x,
            y: 0
        }
        this.status = {
            'conquering': {
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
    Cursor.prototype.initializeConquer = function(){
        this.status.conquering['min-x'] = this.position.x;
        this.status.conquering['max-x'] = this.position.x;
        this.status.conquering['min-y'] = this.position.y;
        this.status.conquering['max-y'] = this.position.y;
    }
    Cursor.prototype.evaluateMovement = function(status, newX, newY){
        try {
            switch (status) {
                case 'lane':
                    //check if we're coming back to the lane from conquering
                    if (this.status.conquering['min-x'] !== null) {
                        //update min and max coordinates with last position
                        if (newX > this.status.conquering['max-x']) {
                            this.status.conquering['max-x'] = newX;
                        };
                        if (newX < this.status.conquering['min-x']) {
                            this.status.conquering['min-x'] = newX;
                        };
                        if (newY > this.status.conquering['max-y']) {
                            this.status.conquering['max-y'] = newY;
                        };
                        if (newY < this.status.conquering['min-y']) {
                            this.status.conquering['min-y'] = newY;
                        };

                        $(document).trigger('layFoundation', this.status.conquering);
                        this.resetCursorStatus();
                    }
                    this.position.x = newX;
                    this.position.y = newY;
                    break;
                case 'void':
                    //check if we´re starting to conquer
                    //Into the darkness... ^^
                    if (this.status.conquering['min-x'] === null) {
                        this.initializeConquer();
                    } else {
                        //save the furthest coordinates from the conquering start position
                        // X axis
                        if (newX > this.status.conquering['max-x']) {
                            this.status.conquering['max-x'] = newX;
                        } else if (newX < this.status.conquering['min-x']) {
                            this.status.conquering['min-x'] = newX;
                        }
                        // Y axis
                        if (newY > this.status.conquering['max-y']) {
                            this.status.conquering['max-y'] = newY;
                        } else if (newY < this.status.conquering['min-y']) {
                            this.status.conquering['min-y'] = newY;
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
    Cursor.prototype.resetCursorStatus = function(newX, newY){
        this.status = {
            'conquering': {
                'min-x': null,
                'max-x': null,
                'min-y': null,
                'max-y': null
            }
        };
    }
    return Cursor;
});
