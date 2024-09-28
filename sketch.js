let blueBackground;
let buildingImage1, buildingImage2;
let ghostImage;
let movingGhostImage;
let lampCity1, lampCity2;
let ghosthouseImage;
let triangleImage;
let showFirstBuilding = true;
let transitionDuration = 5000;
let transitionStartTime = 0;
let lampCityVisible = true;
let ghosthouseY = 0;
let ghosthouseDirection = 1;
let currentShape;
let shapeChangeInterval = 2000; 
let lastShapeChangeTime = 0;
// Credits:
// "Tlaiz" by Tim Kahn. Licensed under CC BY 4.0. Available at: https://freesound.org/people/timkahn/sounds/752782/
// "Button Click 3" by Mellau. Licensed under CC BY 4.0. Available at: https://freesound.org/people/mellau/sounds/506052/

//shape colours
let shapeColors = ['#FF5733', '#33FF57', '#5733FF', '#FF33A1', '#33FFF5', '#F5FF33', '#FF8C33', '#8CFF33'];

//properties of shootings stars
let shootingStarX, shootingStarY, shootingStarSpeed;
let shootingStarVisible = false;
let backgroundMusic;
let clickSound;

function preload() {
    blueBackground = loadImage('images/bluebackground.jpg');
    buildingImage1 = loadImage('images/buildings.png');
    buildingImage2 = loadImage('images/buildings2.png');
    ghostImage = loadImage('images/ghost.png');
    movingGhostImage = loadImage('images/ghost2.png'); 
    ghosthouseImage = loadImage('images/ghosthouse.png');
    triangleImage = loadImage('images/triangle.png');
    soundFormats('wav');
    backgroundMusic = loadSound('libraries/752782__timkahn__tlaiz.wav');
    clickSound = loadSound('libraries/506052__mellau__button-click-3 (1).wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    const body = document.body;
    body.style.margin = '0';
    body.style.backgroundColor = '#08080A';
    body.style.display = 'flex';
    body.style.justifyContent = 'center';
    body.style.alignItems = 'center';
    body.style.height = '100vh';
    body.style.cursor = 'none';
    body.style.overflow = 'hidden';

    if (!shootingStarVisible) {
        shootingStarX = random(width);
        shootingStarY = random(height);
        shootingStarSpeed = random(2, 5);
        shootingStarVisible = true;
    }

    if (ghostImage) {
        let cursorImage = document.createElement('img');
        cursorImage.src = 'images/ghost.png';
        cursorImage.style.position = 'absolute';
        cursorImage.style.width = '1000px';
        cursorImage.style.height = 'auto';
        cursorImage.style.pointerEvents = 'none';
        cursorImage.style.zIndex = '20';
        document.body.appendChild(cursorImage);

        document.addEventListener('mousemove', (e) => {
            const rect = cursorImage.getBoundingClientRect();
            cursorImage.style.left = `${e.clientX - rect.width / 2}px`;
            cursorImage.style.top = `${e.clientY - rect.height / 2}px`;
        });
    }

    if (movingGhostImage) {
        let floatingGhost = document.createElement('img');
        floatingGhost.src = 'images/ghost2.png';
        floatingGhost.style.position = 'absolute';
        floatingGhost.style.width = '800px';
        floatingGhost.style.height = 'auto';
        floatingGhost.style.zIndex = '15';
        floatingGhost.style.pointerEvents = 'none';
        floatingGhost.style.animation = 'float-ghost2 1.5s ease-in-out infinite';
        document.body.appendChild(floatingGhost);
    }

    let style = document.createElement('style');
    style.innerHTML = 
        `@keyframes float-ghost2 {
            0% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
            100% { transform: translateY(0); }
        }`;
    document.head.appendChild(style);

    lampCity1 = createImg('images/lampcity1.png');
    lampCity2 = createImg('images/lampcity2.png');

    styleLampCityImage(lampCity1);
    styleLampCityImage(lampCity2);
    lampCity2.style('opacity', '0');

    lampCity1.mousePressed(toggleLampCity);
    lampCity2.mousePressed(toggleLampCity);

    transitionStartTime = millis();
    setRandomShape();

    //shooting star properties
    shootingStarX = random(width);
    shootingStarY = random(height);
    shootingStarSpeed = random(2, 5);

    //background music
    backgroundMusic.setLoop(true);
    backgroundMusic.setVolume(0.3);
    backgroundMusic.play();
}

function draw() {
    background('#08080A');

    drawBlueBackground();
    animateGhosthouse();
    animateBuildings();
    drawTriangleImage();
    drawLampCity(); 
    drawRandomShapes(); 
    animateShootingStar();
}

function drawBlueBackground() {
    if (blueBackground) {
        const aspectRatio = 884 / 618;
        let imgWidth = width * 0.8;
        let imgHeight = imgWidth / aspectRatio;

        if (imgWidth > 1000) {
            imgWidth = 1000;
            imgHeight = imgWidth / aspectRatio;
        }

        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;

        noTint();
        image(blueBackground, x, y, imgWidth, imgHeight);

        window.blueBackgroundTopLeft = { x, y, width: imgWidth, height: imgHeight };
    }
}

function drawTriangleImage() {
    if (triangleImage) {
        const { x, y, width, height } = window.blueBackgroundTopLeft;
        image(triangleImage, x, y, width, height);
    }
}

function animateBuildings() {
    if (buildingImage1 && buildingImage2) {
        const aspectRatio = 884 / 618;
        let imgWidth = width * 0.8;
        let imgHeight = imgWidth / aspectRatio;

        if (imgWidth > 1000) {
            imgWidth = 1000;
            imgHeight = imgWidth / aspectRatio;
        }

        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;

        let elapsedTime = millis() - transitionStartTime;
        let t = elapsedTime / transitionDuration;

        if (t >= 1) {
            transitionStartTime += transitionDuration;
            showFirstBuilding = !showFirstBuilding;
            t = 0;
        }

        t = t * t * (3 - 2 * t);

        let fadeIn = t;
        let fadeOut = 1 - t;

        if (showFirstBuilding) {
            tint(255, fadeOut * 255);
            image(buildingImage1, x, y, imgWidth, imgHeight);
            noTint();
            
            tint(255, fadeIn * 255);
            image(buildingImage2, x, y, imgWidth, imgHeight);
            noTint();
        } else {
            tint(255, fadeIn * 255);
            image(buildingImage1, x, y, imgWidth, imgHeight);
            noTint();
            
            tint(255, fadeOut * 255);
            image(buildingImage2, x, y, imgWidth, imgHeight);
            noTint();
        }
    }
}

function animateGhosthouse() {
    if (ghosthouseImage) {
        const aspectRatio = 884 / 618;
        let imgWidth = width * 0.8;
        let imgHeight = imgWidth / aspectRatio;

        if (imgWidth > 1000) {
            imgWidth = 1000;
            imgHeight = imgWidth / aspectRatio;
        }

        const x = (width - imgWidth) / 2;
        const ghosthouseX = x - 10;
        const baseY = (height - imgHeight) / 2;
        const ghosthouseYOffset = ghosthouseY + baseY + 18;

        image(ghosthouseImage, ghosthouseX, ghosthouseYOffset, imgWidth, imgHeight);

        ghosthouseY += ghosthouseDirection * 0.66;
        if (ghosthouseY > 16 || ghosthouseY < -16) {
            ghosthouseDirection *= -1;
        }
    }
}

function drawLampCity() {
    if (lampCity1 && lampCity2) {
        const { x, y, width, height } = window.blueBackgroundTopLeft;
        const imgWidth = width;
        const imgHeight = height;
        lampCity1.position(x, y);
        lampCity1.size(imgWidth, imgHeight);
        lampCity1.style('opacity', lampCityVisible ? '1' : '0');
        
        lampCity2.position(x, y);
        lampCity2.size(imgWidth, imgHeight);
        lampCity2.style('opacity', lampCityVisible ? '0' : '1');
    }
}

function styleLampCityImage(img) {
    img.style('position', 'absolute');
    img.style('pointer-events', 'auto');
    img.style('z-index', '10');
    img.style('opacity', '1');
}

function toggleLampCity() {
    lampCityVisible = !lampCityVisible;
    if (clickSound) {
        clickSound.play();
    }
}

function drawRandomShapes() {
    const { x, y, width, height } = window.blueBackgroundTopLeft;
    let currentTime = millis();
    if (currentTime - lastShapeChangeTime > shapeChangeInterval) {
        setRandomShape();
        lastShapeChangeTime = currentTime;
    }
    const shapeSize = 30; 
    const strokeWeightValue = 2;
    const padding = 50;
    stroke(random(shapeColors));
    strokeWeight(strokeWeightValue);
    noFill();

    switch (currentShape) {
        case 'triangle':
            triangle(x + padding, y + padding, x + width - padding, y + padding, x + width / 2, y + height - padding);
            break;
        case 'hexagon':
            drawHexagon(x + width / 2, y + height / 2, shapeSize);
            break;
        case 'circle':
            ellipse(x + width / 2, y + height / 2, shapeSize);
            break;
        case 'stars':
            drawStar(x + width / 2, y + height / 2, shapeSize / 2, shapeSize, 5);
            break;
        case 'square':
            rect(x + width / 2 - shapeSize / 2, y + height / 2 - shapeSize / 2, shapeSize, shapeSize);
            break;
        case 'cross':
            drawCross(x + width / 2, y + height / 2, shapeSize);
            break;
        case 'quatrefoil':
            drawQuatrefoil(x + width / 2, y + height / 2, shapeSize / 2);
            break;
        case 'diamond':
            drawDiamond(x + width / 2, y + height / 2, shapeSize);
            break;
    }
}

function setRandomShape() {
    const shapes = ['triangle', 'hexagon', 'circle', 'stars', 'square', 'cross', 'quatrefoil', 'diamond'];
    currentShape = random(shapes);
}

function drawHexagon(x, y, size) {
    beginShape();
    for (let i = 0; i < 6; i++) {
        vertex(x + size * cos(PI / 3 * i), y + size * sin(PI / 3 * i));
    }
    endShape(CLOSE);
}

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawCross(x, y, size) {
    line(x - size / 2, y, x + size / 2, y);
    line(x, y - size / 2, x, y + size / 2);
}

function drawQuatrefoil(x, y, size) {
    for (let i = 0; i < 4; i++) {
        ellipse(x + size * cos(PI / 2 * i), y + size * sin(PI / 2 * i), size);
    }
}

function drawDiamond(x, y, size) {
    beginShape();
    vertex(x, y - size);
    vertex(x + size, y);
    vertex(x, y + size);
    vertex(x - size, y);
    endShape(CLOSE);
}

function animateShootingStar() {
    if (shootingStarVisible) {
        noStroke();
        fill('#FFF');
        drawStar(shootingStarX, shootingStarY, 12, 25, 5); 

        shootingStarX += shootingStarSpeed;
        shootingStarY -= shootingStarSpeed;

        if (shootingStarX > width || shootingStarY < 0) {
            shootingStarVisible = false;
        }
    }
}

function mousePressed() {
    shootingStarVisible = true;
    shootingStarX = mouseX;
    shootingStarY = mouseY;
    shootingStarSpeed = random(2, 5);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}