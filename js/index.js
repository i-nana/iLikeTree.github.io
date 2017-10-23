function Ball3d() {
    this.radius = Math.random() * 20;
    this.x = 0;
    this.y = 0;
    this.xpos = Math.random() * 3000 - 1500;
    this.ypos = Math.random() * 1000 - 500;
    this.zpos = Math.random() * 5000;
    this.vz = 0;
    this.vx = 0;
    this.vy = 0;
    this.rotation = 0;
    this.mass = 1;
    this.scaleX = 1;
    this.scaleY = 1;
    this.name = "";
    this.lineWidth = 1;

}

Ball3d.prototype.draw = function (context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.lineWidth = this.lineWidth;
    var gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    gradient.addColorStop(0, "rgba(248, 232, 0, 1)");
    gradient.addColorStop(0.6, "rgba(248, 232, 0, 1)");
    gradient.addColorStop(1, "rgba(248,232,0, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    context.restore();
}

window.onload = function () {
    initBalls();
    function initBalls() {
        var width = document.documentElement.clientWidth,
            height = document.documentElement.clientHeight,
            canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        var context = canvas.getContext('2d'),
            balls = [],
            numBalls = 100,
            fl = 500,
            vpX = canvas.width / 2,
            vpY = canvas.height / 3 * 2,
            floor = 200,
            ax = 0,
            ay = 0,
            az = 0,
            vx = 0,
            vy = 0,
            vz = 0.5,
            gravity = 0.3,
            friction = 0.64;

        for (var ball, i = 0; i < numBalls; i++) {
            ball = new Ball3d();
            balls.push(ball);
        }

        function move(ball) {
            ball.xpos += vx;
            ball.ypos += vy;
            ball.zpos += vz;
    
            if (ball.ypos < -500) {
                ball.ypos = 500;
            }
    
            if (ball.zpos < -fl) {
                ball.zpos += 10000;
            }
            if (ball.zpos > 10000 - fl) {
                ball.zpos -= 10000;
            }
            var scale = fl / (fl + ball.zpos);
            ball.scaleX = ball.scaleY = scale;
            ball.x = vpX + ball.xpos * scale;
            ball.y = vpY + ball.ypos * scale;
            ball.alpha = scale;
        }
    
        function zSort(a, b) {
            return (b.zpos - a.zpos);
        }
    
        function draw(ball) {
            ball.draw(context);
        }
    
    
        (function drawFrame() {
            window.requestAnimationFrame(drawFrame, canvas);
            context.clearRect(0, 0, canvas.width, canvas.height);
    
    
            vx += ax;
            vy += ay;
            vz += az;
            vy -= gravity;
            balls.forEach(move);
            vx *= friction;
            vy *= friction;
            vz *= friction;
            balls.sort(zSort);
            balls.forEach(draw);
        }())
    }
}
