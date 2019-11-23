
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const width = canvas.width;
const height = canvas.height
const INTERVAL = 25;

function ellipse(x, y, r){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function rect(x, y, w, h){
  ctx.fillRect(x,y,w,h);
}

var n = 0;
function call(){
  console.log("here" + n++)
}

function Particle(x, y, s, r){
  this.x = x;
  this.y = y;
  this.speed = s;
  this.stuck = false;
  this.radius = r; //+ random()*5;
  this.update = function(){
    if(!this.stuck){//if NOT stuck...
      this.x += random(0) * this.speed;
      this.y += this.speed;

    }else{//stuck...

    }
  };

  this.show = function(){
    if(!this.stuck){//if NOT stuck...
      ctx.fillStyle="#8800FF";
      ellipse(this.x, this.y, this.radius);
    }else{//stuck...
      ctx.fillStyle="#6600CC";
      ellipse(this.x, this.y, this.radius);
    }
  };
}

function random(pos){
  if(pos == 0){
    return (Math.random() * 2) - 1;
  }else{
    return Math.random();
  }
}

function dist(x1, y1, x2, y2){
  return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)))
}

var mapRange = function(from, to, s) {
  return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};

function line(a,b,c,d){
  ctx.beginPath();
  ctx.moveTo(a,b);
  ctx.lineTo(c,d);
  ctx.stroke();
}

var particles = [];
var spawnActive = true;
var spawnHeight = 0;
var size = 15;
var globalSpeed = 1;
var color = "white"

particles.push(new Particle(random() * width/3 + width/3, spawnHeight, globalSpeed, size))
ctx.fillStyle="rgb(0,0,0)";
rect(0,0,width,height);

ctx.lineWidth = 3;
ctx.strokeStyle = color;
ctx.fillStyle = color
function loop(){ //main function loop to be ran every INTERVAL ms
  // ctx.fillStyle="rgb(0,0,0)";
  // rect(0,0,width,height);
  // p.update();
  // p.show();
  // if(p.y >= height-p.radius){
  //   p.y = height-p.radius;
  //   p.stuck = true;
  // }
  for(let i = 0; i < particles.length; i++){
    let p = particles[i];
    while(!p.stuck ){//run update calculations ONLY if current particle is not stuck

      for(let j = 0; j < particles.length; j++){
        if(particles[j].y <= spawnHeight + 50 && particles[j].stuck){
          spawnActive = false;
        }
      }

      //collision check
      //-----floor collision
      if(p.y >= height-p.radius ){
        p.y = height-p.radius;
        p.stuck = true;
        if(spawnActive){
          particles.push(new Particle(random() * width/2 + width/4, spawnHeight, globalSpeed, size));
          break;
        }

      }

      //-----other particle collision
      for(let j = 0; j < particles.length; j++){
        let p2 = particles[j];
        if(j != i){
          if(dist(p.x, p.y, p2.x, p2.y) <= p.radius + p2.radius && p2.stuck ) {
            p.stuck = true;
            let w = Math.ceil(mapRange([0, height], [1, 10], p.y));
            ctx.lineWidth = w;
            ellipse(p.x, p.y, w/2);
            ellipse(p2.x, p2.y, w/2);
            line(p.x, p.y, p2.x, p2.y)
            if(spawnActive){
              particles.push(new Particle(random() * width, spawnHeight, globalSpeed,
                Math.ceil(mapRange([0, height], [5,25], p2.y))
              ));
              break;
            }
          }
        }
      }

      //finally update position
      p.update();




    }
    //p.show();//independent of anything
  }

}


// setInterval(loop, INTERVAL); //looping calback
loop();
