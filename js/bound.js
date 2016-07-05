var bound = function(origin, destiny, ethereal, options){
    this.orig = new canvas.vector(0,0);
    this.dest = new canvas.vector(0,0);   
    this.ethereal = false;
    this.visible = false;
    this.boundName = ''; 
    this.is_ethereal = function(){
        return this.ethereal;
    }
    this.create = function(origin, destiny, ethereal, options){
        if(origin instanceof canvas.vector && destiny instanceof canvas.vector) {
            this.orig = origin;
            this.dest = destiny;
        }
        if(typeof(options.visible) != "undefined" ) {
            this.visible = options.visible;
        }
        if(typeof(options.name) != "undefined" ) {
            this.boundName = options.name;
        }        
        this.ethereal = ethereal;
        return this;
    };
    return this.create(origin, destiny, ethereal, options);
};