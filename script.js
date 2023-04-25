let g = 6;
let c = document.getElementById("canvas1");
let draw = c.getContext("2d");
let deltaTime = 42;
let speedup = 1;
let planc = deltaTime/400*speedup;
let maxvel = 6;
let maxvvel = 4;
let j = 0;
let wingstr = 3;
let treshold = 1;

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

class vineplantsegment{
    constructor(pos,angle){
        this.pos=pos;
        this.len=Math.random()*2;
        this.angle=angle+Math.random()-0.5;
    }
}
class vineplant{
    constructor(){
        this.segments=[];
    }
}

class batfly{
    constructor(){
        this.vel = [0,0];
        this.pos = [300,300];
        this.accel = [0,0];
        this.hov = false;
        this.col = 0;
        this.birbheight = 5+(Math.random()-0.5)*6;
        this.rotation = 0;
        this.flapl = false;
        this.flapr = false;
        this.wingrl = -Math.PI*3/4;
        this.wingrr = Math.PI*3/4;
        this.wingspdl = 0;
        this.wingspdr = 0;
    }

    flap(rl){
        //if true, right wing flaps
        if(rl){
            this.vel[0]-=wingstr*(Math.random()+0.5);
            this.vel[0]-=wingstr;
            this.vel[1]-=wingstr*1.5;
            this.flapr = true;
        }
        else{
            this.vel[0]+=wingstr*(Math.random()+0.5);
            this.vel[0]+=wingstr;
            this.vel[1]-=wingstr*1.5;
            this.flapl = true;
        }
    }

    update(){
        //random jittering
        this.accel = [(Math.random()-0.5)/4,(Math.random()-0.5)/4];
        

        //random flaps
        if(Math.random()>1-treshold*planc && !this.flapr){
            this.flap(true);
        }
        if(Math.random()<treshold*planc && !this.flapl){
            this.flap(false);
        }

        //rightwing
        if(this.flapr && this.wingrr>=Math.PI*3/4){
            if(this.wingspdr == 1){
                this.flapr = false;
                this.wingspdr = 0;
                this.wingrr = Math.PI*3/4;
            }
            else{
                this.wingspdr = -1;
            }
        }
        if(this.flapr && this.wingrr<=Math.PI*3/4-Math.PI/2){
            this.wingspdr = 1;
            this.wingrr = Math.PI*3/4-Math.PI/2+0.1;
        }

        //leftwing
        if(this.flapl && this.wingrl<=-Math.PI*3/4){
            if(this.wingspdl == -1){
                this.flapl = false;
                this.wingspdl = 0;
                this.wingrl = -Math.PI*3/4;
            }
            else{
                this.wingspdl = 1;
            }
        }
        if(this.flapl && this.wingrl>=-Math.PI*3/4+Math.PI/2){
            this.wingspdl = -1;
            this.wingrl = -Math.PI*3/4+Math.PI/2-0.1;
        }

        this.wingrr += this.wingspdr*planc*8;
        this.wingrl += this.wingspdl*planc*8;
        
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
            this.vel[0]*=-1;
        }
        if(this.pos[0]>c.width && this.vel[0]>0){
            this.vel[0]*=-1;
        }
        if(this.pos[1]<0 && this.vel[1]<0){
            this.vel[1]*=-1;
        }
        if(this.pos[1]>c.height && this.vel[1]>0){
            this.vel[1]*=-1;
        }
    }


    render(){
        let yoff = Math.cos(this.rotation)*this.birbheight*3/4;
        let xoff = Math.sin(this.rotation)*this.birbheight*3/4;

        //body
        draw.beginPath();
        draw.ellipse(this.pos[0]+xoff,this.pos[1]+yoff,this.birbheight*3/5,this.birbheight,-this.rotation,0,2*Math.PI);
        draw.stroke();
        draw.closePath();
        draw.fillStyle = "rgb("+this.col+","+this.col+","+this.col+")";
        draw.fill();

        //wings
        //right
        drawhalfstuff(this.pos[0],this.pos[1]+this.birbheight/2,this.birbheight*5/6,this.birbheight*2,this.wingrr,-Math.PI/2,Math.PI/2,this.birbheight*2,this.col);
        //left
        drawhalfstuff(this.pos[0],this.pos[1]+this.birbheight/2,this.birbheight*5/6,this.birbheight*2,this.wingrl,Math.PI/2,-Math.PI/2,this.birbheight*2,this.col);
        

        //right eye
        drawstuff(this.pos[0]+this.birbheight*3/10,this.pos[1],this.birbheight*3/20,this.birbheight*3/20,0,0,"rgb(255,255,255)");
        //left eye
        drawstuff(this.pos[0]-this.birbheight*3/10,this.pos[1],this.birbheight*3/20,this.birbheight*3/20,0,0,"rgb(255,255,255)");
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
for(let i = 0; i < 200; i++){
    bats[i] = new batfly();
    bats[i].col = Math.random()*180;
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