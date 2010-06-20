$(document).ready(function() {    
    // $(".project").click(function() {
    //     // $(".projects canvas").remove();
    //     // var canvas = $("<canvas width='315' height='182' id='highlight'></canvas>");
    //     // $(this).append(canvas);
    //     // draw_highlight();
    //     
    //     alert("aoeu");
    // });
});

function draw_highlight(ctx) {
    var canvas = document.getElementById('highlight');
    if(canvas.getContext) {
    // if(true) {
        var ctx = canvas.getContext('2d');
        
        x = 10;
        y = 10;
        width = canvas.clientWidth - 20; //230;
        height = canvas.clientHeight - 30; //220;
        weight = 7;
        radius = 6;
        
        // draw main rect
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur    = 8;
        ctx.shadowColor   = "rgba(0, 0, 0, .4)";
        ctx.fillStyle = "#4696f7";
        roundedRect(ctx, x, y, width, height, radius);
        
        var grd = ctx.createLinearGradient(0,y,0,y+height);
        grd.addColorStop(0,'#78b5fa');
        grd.addColorStop(0.01,'#4696f7');
        grd.addColorStop(.98,'#1562d1');
        grd.addColorStop(1,'#1151ab'); 
        ctx.fillStyle = grd;
        ctx.fill();
        
        // embossing
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(0, 0, 0, .6)";
        ctx.fillStyle = "#fff";
        ctx.fillRect(x+weight, y+weight, width-weight*2, 1);
        
        ctx.shadowBlur = 2;
        ctx.shadowColor = "rgba(255, 255, 255, .3)";
        ctx.fillStyle = "#4d8fe0";
        ctx.fillRect(x+weight, y+height-weight, width-weight*2, 1);            
        
        // knockout middle box
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.clearRect(x+weight, y+weight, width-weight*2, height-weight*2);
        
        // mask for inner shadow
        ctx.beginPath();
        ctx.moveTo(x+weight, y+weight);
        ctx.lineTo(x+width-radius, y+weight);
        ctx.lineTo(x+width-radius, y+height-weight);
        ctx.lineTo(x+weight, y+height-weight);
        ctx.lineTo(x+weight, y+weight);
        ctx.clip();
        
        // inner shadow
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+width, y);
        ctx.lineTo(x+width, y+height);
        ctx.lineTo(x, y+height);
        ctx.lineTo(x, y);
        ctx.lineTo(x+weight, y+weight);
        ctx.lineTo(x+weight, y+height-weight);
        ctx.lineTo(x+width-weight, y+height-weight);
        ctx.lineTo(x+width-weight, y+weight);
        ctx.lineTo(x+weight, y+weight);    

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(0, 0, 0, .5)";
        ctx.fill();
    }
}

function roundedRect(ctx,x,y,width,height,radius) {
    correction = 0;

    ctx.beginPath();
    ctx.moveTo(x, y+radius);
    ctx.lineTo(x, y+height-radius);
    ctx.quadraticCurveTo(x, y+height, x+radius, y+height);
    ctx.lineTo(x+width-radius, y+height);
    ctx.quadraticCurveTo(x+width, y+height, x+width, y+height-radius);  
    ctx.lineTo(x+width, y+radius);
    ctx.quadraticCurveTo(x+width, y, x+width-radius, y);
    ctx.lineTo(x+radius, y);
    ctx.quadraticCurveTo(x, y, x, y+radius);
    ctx.fill();
}