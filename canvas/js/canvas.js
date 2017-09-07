	var width=document.body.clientWidth;
	var height=document.body.clientHeight;
	var mouseDown=false;
	var lastLoca={x:0,y:0};
	var lastTimeStep=0;
	var lastLineWidth=-1;
	var canvas=document.getElementById('canvas');
	canvas.width=width;
	canvas.height=height-50;
	var context=canvas.getContext("2d");
	draw();
	//清除
	$("#clear").click(function(e){
		context.clearRect(0,0,canvas.width,canvas.height);
		draw();
	})
//
function beginStroke(point){
	mouseDown=true;
	lastLoca=windowCanvas(point.x,point.y);
	lastTimeStep=new Date().getTime();
}
function endStroke(){
	mouseDown=false;
}
function moveStroke(point){
	var curLoca=windowCanvas(point.x,point.y);
	var curTimeStep=new Date().getTime();
	var distance=pointClient(curLoca,lastLoca);
	var timeDistance=curTimeStep-lastTimeStep;
	var lineWidth=calcLineWidth(timeDistance,distance);

	context.beginPath();
	context.moveTo(lastLoca.x,lastLoca.y);
	context.lineTo(curLoca.x,curLoca.y);
	context.strokeStyle="#000";
	context.lineWidth=lineWidth;
	context.lineCap="round";
	context.lineJoin="round";
	context.stroke();

	lastLoca=curLoca;
	lastTimeStep=curTimeStep;
	lastLineWidth=lineWidth;
}
//触摸
canvas.addEventListener("touchstart",function(e){
	e.preventDefault();
	touch=e.touches[0];
	console.log(touch);
	beginStroke({x:touch.pageX,y:touch.pageY});
})
canvas.addEventListener("touchmove",function(e){
	e.preventDefault();
	if(mouseDown){
		touch=e.touches[0];
		moveStroke({x:touch.pageX,y:touch.pageY});
	}
})
canvas.addEventListener("touchend",function(e){
	e.preventDefault();
	endStroke();
})

//鼠标
canvas.onmousedown=function(e){
	e.preventDefault();
	beginStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup=function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmouseout=function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmousemove=function(e){
	e.preventDefault();
	if(mouseDown){
		// drawWord();
		moveStroke({x:e.clientX,y:e.clientY});
	}
}
//根据速度设置线条宽度
function calcLineWidth(t,s){
	var v=s/t;
	var resultWidth;
	if (v<0.1) {
		resultWidth=20;
	}else if (v>=10) {
		resultWidth=1;
	}else{
		resultWidth=20-(v-0.1)/(10-0.1)*(20-1);
	}
	if (lastLineWidth==-1) {
		return resultWidth
	}
	return lastLineWidth*2/3+resultWidth*1/3;
}

//两点距离
function pointClient(loca1,loca2){
	return Math.sqrt((loca1.x-loca2.x)*(loca1.x-loca2.x)+(loca1.y-loca2.y)*(loca1.y-loca2.y))
}

//canvas和window距离
function windowCanvas(x,y){
	var canvasBox=canvas.getBoundingClientRect();
	return {x:Math.round(x-canvasBox.left),y:Math.round(y-canvasBox.top)}
}

//画方框
function draw(){
	context.save();
	context.strokeStyle="red";
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(width-3,3);
	context.lineTo(width-3,height-53);
	context.lineTo(3,height-53);
	context.closePath();
	context.lineWidth=6;
	context.stroke();

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(width,height-53);

	context.moveTo(width,0);
	context.lineTo(0,height-53);

	context.moveTo(width/2,0);
	context.lineTo(width/2,height-53);

	context.moveTo(0,(height-53)/2);
	context.lineTo(width,(height-53)/2);
	context.lineWidth=1;
	context.stroke();

	context.restore();
}