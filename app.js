const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.floor(Math.random() * 10) + 3;
        this.velocity = {
            x: Math.random() * 4 - 2,
            y: Math.random() * 4 - 2
        };
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    update(){
        //WALL COLLISION
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x *= -1;
        } else if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y *= -1;
        }
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.draw();
        this.checkCollision();
    }
    checkCollision(){
        //COLLISION BETWEEN PARTICLES
        particlesArray.forEach(particle => {
            if (particle === this) return;

            const dx = this.x - particle.x;
            const dy = this.y - particle.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.radius + particle.radius) {
                const tempX = this.velocity.x;
                const tempY = this.velocity.y;
                this.velocity.x = particle.velocity.x;
                this.velocity.y = particle.velocity.y;
                particle.velocity.x = tempX;
                particle.velocity.y = tempY;
            }  
        });
    }
};

const particlesArray = [];

function createParticle(e){
    let posX = e.clientX;
    let posY = e.clientY;
    const colorArray = ['crimson', 'white', 'blue', 'purple', 'gold'];
    const color = colorArray[Math.floor(Math.random() * colorArray.length)]
    const particle = new Particle(posX, posY, color);
    particlesArray.push(particle);
}

canvas.addEventListener('click', createParticle);

function gameLoop(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(particle => {
        particle.update();
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();

