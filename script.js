let g = 2;
let c = document.getElementById("canvas1");
let draw = c.getContext("2d");
let deltaTime = 42;
let planc = deltaTime/400;
let maxvel = 6;
let maxvvel = 4;
let j = 0;
let wingstr = 4;

//posx,y obviously position, lengx,y obviously ellipse, angle is angle, centeroffset how far the centero f the ellipse is from the posx,y, colour rgb in text
function drawstuff(positionx,positiony,lenghtx,lengthy,angle,centeroffset,colour){ 
    let yoff = Math.cos(angle)*centeroffset;
    let xoff = Math.sin(angle)*centeroffset;

    draw.beginPath();
    draw.ellipse(positionx+xoff,positiony+yoff,lenghtx,lengthy,-angle,0,2*Math.PI);
    draw.stroke();
    draw.closePath();
    draw.fillStyle = colour;
    draw.fill();
}
//startang endang for the elipses last two parameters
function drawhalfstuff(positionx,positiony,lenghtx,lengthy,angle,startang,endang,centeroffset,colour){ 
    let yoff = Math.cos(angle)*centeroffset;
    let xoff = Math.sin(angle)*centeroffset;

    draw.beginPath();
    draw.ellipse(positionx+xoff,positiony+yoff,lenghtx,lengthy,-angle,startang,endang);
    draw.stroke();
    draw.closePath();
    draw.fillStyle = colour;
    draw.fill();
}

class batfly{
    constructor(){
        this.vel = [0,0];
        this.pos = [300,300];
        this.accel = [0,0];
        this.hov = false;
        this.col = 0;
        this.birbheight = 5+(Math.random()-0.5)*2;
        this.rotation = 0;
        this.wingcoll = "rgb(0,0,0)";
        this.wingcolr = "rgb(0,0,0)";
    }

    initiatehover(){
        //checkpred()
        this.hov = true;
        let cent = this.pos[1];
    }

    flap(rl){
        //if true, right wing flaps
        if(rl){
            this.vel[0]-=wingstr;
            this.vel[1]-=wingstr;  
        }
        //if fale, left wing
        else{
            this.vel[0]+=wingstr;
            this.vel[1]-=wingstr;
        }
    }

    update(){

        this.accel = [Math.random()-0.5,Math.random()-0.5];

        //velocity according to accel and planc
        this.vel[0] += this.accel[0]*planc*10;
        this.vel[1] += this.accel[1]*planc*10;

        //cap velocity
        if(Math.abs(this.vel[0])>maxvel){
            this.vel[0] *= maxvel/Math.abs(this.vel[0]);
        }
        if(Math.abs(this.vel[1])>maxvvel){
            this.vel[1] *= maxvvel/Math.abs(this.vel[1]);
        }

        //position according to velocity and planc
        this.pos[0] += this.vel[0]*planc*10;
        this.pos[1] += this.vel[1]*planc*10;

        //rotation accorind to velocity
        this.rotation = this.vel[0]*Math.PI/-16;

        //gravity
        this.vel[1] += g*planc;

        //wallbounce
        if(this.pos[0]<0 && this.vel[0]<0){
            this.vel[0]*=-1.1;
        }
        if(this.pos[0]>c.width && this.vel[0]>0){
            this.vel[0]*=-1.1;
        }
        if(this.pos[1]<0 && this.vel[1]<0){
            this.vel[1]*=-1.1;
        }
        if(this.pos[1]>c.height && this.vel[1]>0){
            this.vel[1]*=-1.1;
        }
    }


    render(){
        let yoff = Math.cos(this.rotation)*this.birbheight*3/4;
        let xoff = Math.sin(this.rotation)*this.birbheight*3/4;

        //body
        draw.beginPath();
        draw.ellipse(this.pos[0]+xoff,this.pos[1]+yoff,3,this.birbheight,-this.rotation,0,2*Math.PI);
        draw.stroke();
        draw.closePath();
        draw.fillStyle = "rgb("+this.col+","+this.col+","+this.col+")";
        draw.fill();

        //wings
        //right
        drawhalfstuff(this.pos[0],this.pos[1],5,this.birbheight*2,Math.PI*3/4,-Math.PI/2,Math.PI/2,this.birbheight*2,this.wingcolr);
        //left
        drawhalfstuff(this.pos[0],this.pos[1],5,this.birbheight*2,-Math.PI*3/4,Math.PI/2,-Math.PI/2,this.birbheight*2,this.wingcoll);
        

        //debug center circle
        /*draw.beginPath();
        draw.arc(this.pos[0], this.pos[1],2,0,2*Math.PI);
        draw.stroke();
        draw.closePath();
        draw.fillStyle = "rgb(255,255,255)";
        draw.fill();*/
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
for(let i = 0; i < 5; i++){
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