const canvas = document.getElementById('game_canvas');
const ctx = canvas.getContext('2d');

// Racoon assets on CC license, you can find graphics here:
// https://null-painter-error.itch.io/cute-raccoon-2d-game-sprite-and-animations

const img_back = new Image();
img_back.src = 'assets/background.png';

const img_idle = new Image();
img_idle.src = 'assets/idle.png';

const img_walk_r = new Image();
img_walk_r.src = 'assets/walk_r.png';

const img_walk_l = new Image();
img_walk_l.src = 'assets/walk_l.png';

const img_on = new Image();
img_on.src = 'assets/on.png';

const img_off = new Image();
img_off.src = 'assets/off.png';

///////////////////////////////////////////////////////////////////////////////////////////

let number_dec = Math.floor(Math.random() * 255) + 1;

function checkWin() {

    let current_dec_value = 0;
    for (let i = 0; i < 8; i++) {
        current_dec_value += buttons[i].value * Math.pow(2, 7-i);
    }

    ctx.fillStyle = "#FFD38D";
    ctx.font = "32px Arial";
    ctx.fillText(current_dec_value, 15, 40);

    if (current_dec_value == number_dec) {

        ctx.fillStyle = "#32140F";
        ctx.fillRect(300, 20, 630, 70);
        ctx.fillStyle = "#FFD38D";
        ctx.font = "48px Arial";
        ctx.fillText("Poprawna liczba! You Win!", 330, 70);
    }
}

///////////////////////////////////////////////////////////////////////////////////////////

const cursor = {
    x: 0,
    y: 0
}

canvas.addEventListener('click', function(evt) {
    
    let game_rect = canvas.getBoundingClientRect();
    cursor.x = evt.clientX - game_rect.left;
    cursor.y = evt.clientY - game_rect.top;

    if (cursor.x >= 1030 && cursor.x <= 1150 && cursor.y >= 730 && cursor.y <= 780) {
        number_dec = Math.floor(Math.random() * 255) + 1;
        drawUI();
    }
    
    // console.log(cursor.x, cursor.y);
});

canvas.addEventListener('mousemove', function(evt) {
    
    let game_rect = canvas.getBoundingClientRect();
    cursor.x = evt.clientX - game_rect.left;
    cursor.y = evt.clientY - game_rect.top;

    if (cursor.x >= 1030 && cursor.x <= 1150 && cursor.y >= 730 && cursor.y <= 780) 
        canvas.style.cursor = 'pointer';
    else canvas.style.cursor = 'default';

});

///////////////////////////////////////////////////////////////////////////////////////////

const key = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false }
}

let current_key = '';

window.addEventListener('keydown', function(evt) {
    
    if (evt.key == 'a') {
        key.a.pressed = true;
        current_key = 'a';
    }

    if (evt.key == 'd') {
        key.d.pressed = true;
        current_key = 'd';
    }

    if (evt.key == 'w') {
        key.w.pressed = true;
        current_key = 'w';
    }

    // console.log(evt);
});

window.addEventListener('keyup', function(evt) {
    
    if (evt.key == 'a') {
        key.a.pressed = false;
        racoon.state = 'idle';
    }

    if (evt.key == 'd') {
        key.d.pressed = false;
        racoon.state = 'idle';
    }

    if (evt.key == 'w') {
        key.w.pressed = false;
        racoon.state = 'idle';
    }

});

///////////////////////////////////////////////////////////////////////////////////////////

function drawUI() {
    
    ctx.font = "42px Arial";
    ctx.fillStyle = "#FFD38D";
    ctx.fillText("Liczba dziesiętna do przedstawienia binarnego: " + number_dec, 30, 770);

    ctx.fillStyle = "brown";
    ctx.fillRect(1030, 730, 120, 50);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#FFD38D";
    ctx.fillText("ZMIEŃ", 1045, 765);

}

///////////////////////////////////////////////////////////////////////////////////////////

class Character {

    constructor({img, pos}) {
        this.img = img;
        this.pos = pos;
        this.frame = 0;
        this.maxframes = 10;
        this.state = 'idle';
        this.velocity = 0;
        this.weight = 1;
        this.switched = false;
    }

    isStanding() {
        return this.pos.y >= 485;   
    }

    jump() {

        if (key.w.pressed && this.isStanding()) this.velocity = -19;

        this.pos.y += this.velocity;

        if (!this.isStanding()) {
            this.velocity += this.weight;
            this.switchButton();
        }
        else
        {
            this.velocity = 0;
            this.state = 'idle';
            this.switched = false;
        }

    }

    switchButton() {

        for (let i = 0; i < 8; i++) {

            let start = i * 150;
            let end = i * 150 + 150;

            if (this.pos.x + 80 >= start && this.pos.x + 80 <= end && this.pos.y <= 300 && !this.switched) {
                if (buttons[i].value == 0) {
                    buttons[i].value = 1;
                    buttons[i].img = img_on;
                }
                else {
                    buttons[i].value = 0;
                    buttons[i].img = img_off;
                }
                this.switched = true;
                // console.log('switched: ' + i);
            }
        }

    }

    draw() {

        ctx.drawImage(this.img, this.frame * 165, 0, 165, 200, this.pos.x, this.pos.y, 165, 200);

        if (key.d.pressed && current_key == 'd') {
            this.pos.x += 8;
            if (this.pos.x >= 1035) this.pos.x = 1035;
            this.state = 'walk_r';
        }

        else if (key.a.pressed && current_key == 'a') {
            this.pos.x -=8;
            if (this.pos.x <= 0) this.pos.x = 0;
            this.state = 'walk_l';
        }

        else if (key.w.pressed && current_key == 'w') {
            this.state = 'jump';
        }

        if (this.state == 'idle') this.img = img_idle;
        if (this.state == 'walk_r') this.img = img_walk_r;
        if (this.state == 'walk_l') this.img = img_walk_l;

        if (this.frame < this.maxframes) this.frame++;
        else this.frame = 0;

        this.jump();

    }

}

const racoon = new Character({
    img: img_idle,
    pos: {
        x: 500,
        y: 485
    }
});

///////////////////////////////////////////////////////////////////////////////////////////

class Button {

    constructor({img, pos, nr}) {
        this.img = img;
        this.pos = pos;
        this.nr = nr;
        this.value = 0;
    }

    draw() {
        ctx.drawImage(this.img, this.nr * 150, 110);
    }

}

let buttons = [];

for (let i = 0; i < 8; i++) {
    buttons.push(
        new Button({
            img: img_off,
            pos: { x: 150, y: 0 },
            nr: i
        })
    );
}

///////////////////////////////////////////////////////////////////////////////////////////

function animate() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img_back, 0, 0);

    drawUI();

    for (let i = 0; i < 8; i++) {
        buttons[i].draw();
    }

    racoon.draw();

    checkWin();

    requestAnimationFrame(animate);

}

animate();