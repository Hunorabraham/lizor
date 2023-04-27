let g = 6;
let c = document.getElementById("LayerTop");
let draw = c.getContext("2d");
let cb = document.getElementById("LayerBottom");
let drawb = cb.getContext("2d");
let deltaTime = 42;
let speedup = 1;
let planc = deltaTime/400*speedup;
let maxvel = 10;
let maxvvel = 4;
let j = 0;
let wingstr = 3;
let treshold = 1;
let golden = (1+Math.sqrt(5))/2;
draw.strokeStyle = "rgba(0,0,0,0)";
drawb.strokeStyle = "rgba(0,0,0,0)";

class physics{
    constructor(){
    }
    applyForce(obj,force){
        obj.forces[0] += force[0];
        obj.forces[1] += force[1];
    }
    calcaccel(obj){
        obj.accel[0] = obj.forces[0]/obj.weight;
        obj.accel[1] = obj.forces[1]/obj.weight;
    }
}
let phys = new physics();

class point{
    constructor(pos,weight){
        this.pos = pos;
        this.weight = weight;
        this.vel = [];
        this.accel = [];
        this.forces = [];
    }
    update(){
        this.vel[0] += this.accel[0];
        this.vel[1] += this.accel[1];
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.forces = [];
    }
}
let points = [];
class strut{
    constructor(endpoints,defaultlength,elasticconstant){
        this.ends = endpoints;
        this.dlen = defaultlength;
        this.econst = elasticconstant;
    }
    update(){
        //get the two points the strut is connected to from the array
        let point1 = points[this.ends[0]];
        let point2 = points[this.ends[1]];
        //calculate the vector between the two points
        let diff = [point2.pos[0]-point1.pos[0],point2.pos[1]-point1.pos[1]];
        //absolute value of the diff vector
        let diffabs = Math.sqrt(diff[0]*diff[0]+diff[1]*diff[1]);
        //calculate the unitvector pointing in the same direction as the diff vector
        let diffunit = [diff[0]/diffabs,diff[1]/diffabs];
        //calculate the deviation from the default lenght
        let forceabs = this.econst*(this.dlen-diffabs);
        //calculate the force for the point2, this is in the direction of diff if the current lenght is smaller than the default length, otherwise it's in the other direction. The strenght is given by the forceabs.
        let force2 = [diffunit[0]*forceabs,diffunit[1]*forceabs];
        //the fornce needed for point one is the pair of force2, exact opposite, same strength, so only a multipication by -1 is needed
        let force1 = [force2[0]*-1,force2[1]*-1];
        //apply the two forces to the corresponding points
        phys.applyforce(points[this.ends[0]],force1);
        phys.applyforce(points[this.ends[1]],force2);
    }
}
let struts = [];


//posx,y obviously position, lengx,y obviously ellipse, angle is angle, centeroffset how far the centero f the ellipse is from the posx,y, colour rgb in text
function drawstuffb(positionx,positiony,lenghtx,lengthy,angle,centeroffset,colour){ 
    let yoff = Math.cos(angle)*centeroffset;
    let xoff = Math.sin(angle)*centeroffset;

    drawb.beginPath();
    drawb.ellipse(positionx+xoff,positiony+yoff,lenghtx,lengthy,-angle,0,2*Math.PI);
    drawb.stroke();
    drawb.closePath();
    drawb.fillStyle = colour;
    drawb.fill();
}
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

function drawtriange(point1,point2,point3,color){
    draw.beginPath();
    draw.moveTo(point1[0],point1[1]);
    draw.lineTo(point2[0],point2[1]);
    draw.lineTo(point3[0],point3[1]);
    draw.closePath();
    draw.fillStyle = color;
    draw.fill();
}

class batflybrain{
    constructor(size,pos){
        //Senses:
        this.sight=size*25;
        
        //Desires:
        //Energy:
        this.energy=1000;
        this.epriority=1+Math.random()-0.5;
        this.ethreshold=1000/3*this.epriority;
        //Fear:
        this.fear=0;
        this.fpriority=this.sight;
        this.fthreshold=100+100*(Math.random()-0.5);

        //Extras:
        this.Memory= [undefined,undefined,undefined];
        this.Lmem=[];
        this.Smem=pos;
        this.Nmem=[];
        this.Tmem=undefined;
        this.state="any";

        //Brain states:
    }

    stateswitch(){
        if(this.energy<this.ethreshold*this.epriority){
            
            this.state="to";
            while(this.Tmem==undefined){
                this.Tmem = this.Memory[Math.round(Math.random()*this.Memory.length)];
                if(this.Memory[2]==undefined){
                    this.state = "any";
                    break;
                }
            }
        }
        else{
            this.state="any";
        }
    }

    bounder(){
        let boundingbox = [];
        flowers.forEach(flower => {
            if(this.Smem[0]-this.sight<flower.pos[0]<this.Smem[0]+this.sight && this.Smem[1]-this.sight<flower.pos[1]<this.Smem[1]+this.sight){
                boundingbox.push(flower.pos);
            }
        })
        return boundingbox;
    }
    update(){
        this.bounder().forEach(flowerpos => {
            if((flowerpos[0]-this.Smem[0])**2+(flowerpos[1]-this.Smem[1])**2<=this.sight**2 && !this.Memory.includes(flowerpos)){
                this.Memory.shift();
                this.Memory[2]=flowerpos;
            }
        });
        this.stateswitch();
    }
}

class vineplantsegment{
    constructor(pos,angle,huh){
        this.pos=pos;
        this.len=10+(Math.random()-0.5)*5;
        this.angle=angle;
        if(huh){this.col="hsl("+(Math.round(30-(Math.random()-0.5)*40)+(cb.height-this.pos[1])/5)+",80%,"+Math.round(50-(Math.random()-0.5)*20)+"%)";}
        else{
            this.col="hsl("+(Math.round(100-(Math.random()-0.5)*40)+(cb.height-this.pos[1])/4)+",80%,"+(Math.round(30-(Math.random()-0.5)*20)+(cb.height-this.pos[1])/16)+"%)";
        }
    }
    
    

    render(){
        drawstuffb(this.pos[0],this.pos[1],2,this.len,this.angle,this.len,this.col);
    }
}


class flower{
    constructor(pos,angle,size){
        this.pos = pos;
        this.angle = angle;
        this.size = size;
        this.col = (30+(cb.height-this.pos[1])/10);
    }
    render(){
        let y = this.pos[1];
        let x = this.pos[0];
        let s = this.size;
        let a = this.angle;
        let cool = 58-8*3;
        for(let i = 0; i < 8;i++){
            drawstuffb(x,y,s,s,a,0,"hsla("+cool+",90%,"+this.col+"%,0.9)");
            s -= s/6;
            a += (a-Math.PI)/5;
            y += Math.cos(a)*s*1.5;
            x += Math.sin(a)*s*1.5;
            cool += 3;
        }
    }
}

let flowers = [];

class vineplant{
    constructor(pos,angle,huh){
        this.segments=[];
        this.segments[0]=new vineplantsegment(pos,angle,huh);
        this.huh = huh;
    }
    addLeaf(){
        let startsegment = this.segments[Math.round(Math.random()*(this.segments.length*3/4-1)+this.segments.length/4)];
        let j = 0;
        for(let i = 1; i < Math.round(Math.random()*35); i++){
            this.segments[this.segments.length]= new vineplantsegment(
                [startsegment.pos[0] +6/4*(Math.sin(startsegment.angle)*startsegment.len),
                startsegment.pos[1]+6/4*(Math.cos(startsegment.angle)*startsegment.len)],
                startsegment.angle+(0.2+j)*(Math.random()-0.5),this.huh);
            startsegment = this.segments[this.segments.length-1];
            j+=0.1;
        }
        if(Math.random()<0.01){
            flowers[flowers.length] = new flower(startsegment.pos,startsegment.angle+Math.random()-0.5,3.5+(Math.random()-0.5*3+startsegment.pos[1]/200));
        }
    }
    makevine(){
        for(let i = 0;i<2000;i++){
            this.addLeaf();
        }
        this.render()
    }
    render(){
        this.segments.forEach(segment => {
            segment.render();
        });
    }
}



class lizard{
    constructor(){
        this.segments = [];
    }
}

class batfly{
    constructor(){
        this.vel = [0,0];
        this.pos = [300,c.height/2];
        this.accel = [0,0];
        this.hov = false;
        this.col = 0;
        this.birbheight = 5+(Math.random()-0.5)*2;
        this.rotation = 0;
        this.flapl = false;
        this.flapr = false;
        this.wingrl = -Math.PI*3/4;
        this.wingrr = Math.PI*3/4;
        this.wingspdl = 0;
        this.wingspdr = 0;
        this.brain= new batflybrain(this.birbheight,this.pos);
        this.tovector = [];
        this.tresholds = [treshold,treshold];
    }

    flap(rl,str){
        //if true, right wing flaps
        if(rl){
            this.vel[0]-=str+(Math.random()-0.5)*4;
            this.vel[1]-=str*1.5;
            this.flapr = true;
            this.brain.energy-=this.birbheight*2;
        }
        else{
            this.vel[0]+=str+(Math.random()-0.5)*4;
            this.vel[1]-=str*1.5;
            this.flapl = true;
            this.brain.energy-=this.birbheight*2;
        }
    }

    update(){
        //brain update
        this.brain.update()

        if(this.brain.state=="to"){
            this.tovector[0] = this.brain.Tmem[0]-this.pos[0];
            this.tovector[1] = this.brain.Tmem[1]-this.pos[1];
            try{
                if(this.tovector[1]<0){
                    this.tresholds[0] = treshold*4;
                    this.tresholds[1] = treshold*4;
                }
                else{
                    this.tresholds[0] = treshold/2;
                    this.tresholds[1] = treshold/2;
                }
                if(this.tovector[0]>0){
                    this.tresholds[0] = 0;
                }
                else{
                    this.tresholds[1] = 0;
                }
            }catch{}

            if(Math.random()<this.tresholds[0]*planc && !this.flapr){
                this.flap(true,wingstr);
                }
                if(Math.random()<this.tresholds[1]*planc && !this.flapl){
                this.flap(false,wingstr);
                }
        }
        else if (this.brain.state=="from"){

        }
        else{
        //random flaps
            if(Math.random()>1-treshold*planc && !this.flapr){
            this.flap(true,wingstr);
            }
            if(Math.random()<treshold*planc && !this.flapl){
            this.flap(false,wingstr);
            }
        }
        //random jittering
        this.accel = [(Math.random()-0.5)/4,(Math.random()-0.5)/4];

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
//HUNOR TE CSINÁLTAD -hunor
class surface{
    constructor(location, size, colour){
        this.locx = location[0];
        this.locy = location[1];
        this.sizex = size[0];
        this.sizey = size[1];
        this.colour = colour;
    }
}



let north = new vineplant([cb.width/1.5,cb.height+600],Math.PI+Math.PI/4,true);
let south = new vineplant([cb.width/3,cb.height+600],Math.PI-Math.PI/4,false);


let bats = [];
for(let i = 0; i < 100; i++){
    bats[i] = new batfly();
    bats[i].col = Math.random()*180;
}


function start(){
    north.makevine();
    south.makevine();
    let tempflow = [];
    flowers.forEach(flower => {
        if(!(flower.pos[1]>cb.height-50 || flower.pos[0]<0 || flower.pos[0]>cb.width)){
            tempflow.push(flower);
        }
    });
    flowers = tempflow;
    for(let i = 0;i<flowers.length;i++){
        flowers[i].render();
    }
    setInterval(() => {
        update();
    }, deltaTime);
}

function update(){
    draw.clearRect(0,0,c.width,c.height);
    for(let i =0;i<bats.length;i++){
        bats[i].update();
        bats[i].render();
    }
}
start();