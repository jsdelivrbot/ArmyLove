/**
 * Created by Astora on 2015-10-19.
 */
var Child_node = new Array();
var theCanvas=document.getElementById("GameCanvas");
var Context=theCanvas.getContext("2d");
function node(_id,_path){
    this.img=new Image();
    this.img.src=_path;
    this.id=_id;
    this.x=0;
    this.y=0;
    this.visible=true;
    this.scaleX=1.0;
    this.scaleY=1.0;
    this.width= this.img.width*this.scaleX;
    this.height= this.img.height*this.scaleY;
}
node.prototype.AddScale= function(_z){
    this.scaleX+=_z;
    this.scaleY+=_z;
}
node.prototype.AddScaleX= function(_x){
    this.scaleX+=_x;
}
node.prototype.AddScaleY= function(_y){
    this.scaleY+=_y;
}
node.prototype.SetScale=function(_z){
    this.scaleX=_z;
    this.scaleY=_z;
}
node.prototype.SetScaleX= function(_x){
    this.scaleX=_x;
}
node.prototype.SetScaleY= function(_y){
    this.scaleY=_y;
}
node.prototype.SetPos= function(_x,_y){
    this.x=_x;
    this.y=_y;
}
node.prototype.SetPosX= function(_x){
    this.x=_x;
}
node.prototype.SetPosY= function(_y){
    this.y=_y;
}
node.prototype.AddPosX=function(_x){
    this.x+=_x;
}
node.prototype.AddPosY=function(_y){
    this.y+=_y;
}
node.prototype.SetVisibility=function(_option){
    this.visible=_option;
}
node.prototype.Render=function(){
    Context.save();
    Context.scale(this.scaleX,this.scaleY);
    Context.drawImage(this.img,this.x,this.y);
    Context.restore();
}
function AddChild(_id,_path){
    var tempNode= new node(_id,_path);
    Child_node.push(tempNode);
}
function findChildGetById(_id){
    for(var i=0;i<Child_node.length;i++){
        var temp=Child_node[i];
        if(temp.id==_id) return temp;
    }
}
/* init */
 var line = 4;
var angLine=2;
var handLine=2;
var time =0.0;
var score=0;
var effectTime=1.1;
var gameReady=true;
var gameOver=false;
var SoundReady;
var SoundStart;
var SoundSuccess;
/*init*/
function Init(){
 AddChild("bg","img/background.png");
 AddChild("ang","img/ang.png");
 findChildGetById("ang").SetPos(306,0);
 AddChild("soap","img/soap.png");
 findChildGetById("soap").SetPos(296+line*80,160);
 AddChild("hand","img/hand.png");
 findChildGetById("hand").AddPosY(768-245);
 findChildGetById("hand").SetPosX(50);
 AddChild("catch","img/catch.png");
 findChildGetById("catch").SetPos(300,250);
 AddChild("gameover","img/gameover.jpg");
 AddChild("gameready","img/gameready.png");
 SoundReady=new Audio();
 SoundReady.src="img/ready.mp3";
 SoundReady.roop=true;
 SoundReady.play();
 SoundSuccess= new Audio();
 SoundSuccess.src="img/success.mp3";
 SoundSuccess.roop=false;
    SoundStart=new Audio();
    SoundStart.src="img/bg.wav";
    SoundStart.roop=true;
}
Init();
function Update(){
    if(gameReady){
         findChildGetById("gameready").Render();
    }else {
        time += 0.016;
        if (time > 1) {
            time = 0.0;
            angLine = Math.floor(Math.random() * 4.9);
            findChildGetById("ang").SetPosX(306 + angLine * 81.8);
        }
        findChildGetById("bg").Render();
        findChildGetById("ang").Render();
        var standard = line - 2;
        findChildGetById("soap").AddPosY(5);
        console.log("" + standard + "\n");
        findChildGetById("soap").AddScaleX(0.0025 * Math.abs(standard));
        if (standard == 0) {
            findChildGetById("soap").AddScaleX(0.008);
            findChildGetById("soap").AddPosX(-2);
        }
        if (standard <= 0) findChildGetById("soap").AddPosX(-2 * Math.abs(standard));
        findChildGetById("soap").AddScaleY(0.005);
        if (findChildGetById("soap").y >= 768) {
            line = Math.floor(Math.random() * 4.9);
            if (line < 2) {
                findChildGetById("soap").SetScaleX(-3);
            }
            findChildGetById("soap").SetPosX(296 + line * 80);
            findChildGetById("soap").SetPosY(160);
            findChildGetById("soap").SetScale(1);
        }
        findChildGetById("soap").Render();
        findChildGetById("hand").SetPosX(50 + handLine * 200);
        findChildGetById("hand").Render();
        effectTime += 0.03;
        if (effectTime < 1) findChildGetById("catch").Render();
    }
    if(gameOver) findChildGetById("gameover").Render();
}
function Input(e){
    var code;
    if(e.keyCode){
        code= e.keyCode;
    }
    switch(code){
        case 97:
            handLine--;
            if(handLine<0) handLine=0;
            break;
        case 100:
            handLine++;
            if(handLine>4) handLine=4;
            break;
        case 13:
            if(!gameOver&&!gameReady&&handLine==angLine){
                gameOver=true;
                break;
            }
            if(findChildGetById("soap").y>450&&(line==handLine)&&(handLine!=angLine)){
                effectTime=0;
                score+=100;
                SoundSuccess.pause();
                SoundSuccess.play();
                break;
            }
            if(gameOver){
                gameOver=false;
                gameReady=true;
                SoundStart.pause();
                SoundReady.play();
                break;
            }
            if(gameReady){
                SoundReady.pause();
                SoundStart.play();
                gameOver=false;
                gameReady=false;
                handLine=2;
                angLine=5;
                line=2;
                break
            }
            break;
    }

}
window.addEventListener("keypress",Input,false);
var IntervalID=setInterval(Update,1000.0/60.0);
