let g = 10;
let c = document.getElementById("canvas1");
let draw = c.getContext("2d");
let deltaTime = 100;
let planc = deltaTime/1000;


class batfly{
    constructor(){
        this.vel = [float(0),float(0)];
        this.pos = [float(300),float(300)];
        this.accel = [float(0),float(0)];
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


let bats = [];
for(let i = 0; i < 10; i++){
    bats[i] = new batfly();
}


function start(){
    console.log("aaaa")
    setInterval(() => {
        update();
    }, deltaTime);
}

function update(){
    draw.clearRect(0,0,c.width,c.width);
    console.log("iiii");

    draw.beginPath();
    for(let i =0;i<bats.length;i++){
        console.log(bats[i].pos);
        bats[i].update();
        bats[i].render();

    }
}