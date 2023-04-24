let g = 10;
let c = document.getElementById("canvas1");
let draw = c.getContext("2d");
let deltaTime = 100;
let planc = deltaTime/1000;

class segment{
    constructor(){

    }
}

class batfly{
    constructor(){
        this.vel = [0,0];
        this.pos = [300,300];
        this.accel = [0,0];
        this.hov = false;
    }

    initiatehover(){
        //checkpred()
        this.hov = true;
        let cent = this.pos[1];
    }

    update(){
        this.vel[0] += this.accel[0]*planc;
        this.vel[1] += this.accel[1]*planc;
        this.pos[0] += this.vel[0]*planc;
        this.pos[1] += this.vel[1]*planc;
        this.accel = (Math.random,Math.random);
    }
    render(){
        draw.arc(this.pos[0],this.pos[1],20,0,2*Math.PI);
    }
}

class surface{
    constructor(location, size, colour){
        this.locx = location[0];
        this.locy = location[1];
        this.sizex = size[0];
        this.sizey = size[1];
        this.colour = colour;
    }
}

class lizard{
    constructor(){
        
    }
}

let bats = [];
for(let i = 0; i < 10; i++){
    bats[i] = batfly();
}


function start(){
    setInterval(() => {
        update();
    }, deltaTime);
}

function update(){
    draw.clearRect(0,0,c.width,c.width);
    draw.beginPath();
    for(let i =0;i<bats.length;i++){
        bats[i].update
    }
}