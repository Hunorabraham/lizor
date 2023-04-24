let g = 10;
let c = document.getElementById("canvas1");
let draw = c.getContext("2d");
let deltaTime = 100;
let planc = deltaTime/1000;


class batfly{
    constructor(){
        this.vel = [0,0];
        this.pos = [300,300];
        this.accel = [0,0];
        this.hov = false;
        this.col = 0;
    }

    initiatehover(){
        //checkpred()
        this.hov = true;
        let cent = this.pos[1];
    }

    update(){
        this.vel[0] += this.accel[0]*planc*10;
        this.vel[1] += this.accel[1]*planc*10;
        this.pos[0] += this.vel[0]*planc*10;
        this.pos[1] += this.vel[1]*planc*10;
        this.accel = [Math.random()-0.5,Math.random()-0.5];
    }
    render(){
        draw.beginPath();
        draw.ellipse(this.pos[0],this.pos[1],3,5,Math.PI/4,0,2*Math.PI);
        draw.stroke();
        draw.closePath();
        draw.fillStyle = "rgb("+this.col+","+this.col+","+this.col+")";
        draw.fill();
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


let bats = [];
for(let i = 0; i < 100; i++){
    bats[i] = new batfly();
    bats[i].col = Math.random()*100;
}


function start(){
    setInterval(() => {
        update();
    }, deltaTime);
}

function update(){
    draw.strokeStyle = "rgba(0,0,0,0)";
    draw.clearRect(0,0,c.width,c.height)
    for(let i =0;i<bats.length;i++){
        bats[i].update();
        bats[i].render();

    }
}