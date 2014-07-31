define(function(){
    var Matrix = function(){
        this.rows = null;
        this.cols = null;
        this.color = null;
        this.state = [];
        this.status = {
            'void': 0,
            'lane': 1,
            'conquering': 2,
            'conquered': 3
        };
    }
    Matrix.prototype.init = function(rows, cols, color){
        this.rows = rows;
        this.cols = cols;
        this.color = color;
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
    }
    Matrix.prototype.layFoundation = function(){
        console.log('laying foundation!');
    }
    return Matrix;
});
