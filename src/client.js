"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}
function mod(n, m) {
    return ((n % m) + m) % m;
}
let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'q': false,
    'e': false
};
window.addEventListener('keydown', (e) => {
    if ((e.key === 'w' || e.key === 'W') && !keys['w'])
        keys['w'] = true;
    if ((e.key === 'a' || e.key === 'A') && !keys['a'])
        keys['a'] = true;
    if ((e.key === 's' || e.key === 'S') && !keys['s'])
        keys['s'] = true;
    if ((e.key === 'd' || e.key === 'D') && !keys['d'])
        keys['d'] = true;
    if ((e.key === 'q' || e.key === 'Q') && !keys['q'])
        keys['q'] = true;
    if ((e.key === 'e' || e.key === 'E') && !keys['e'])
        keys['e'] = true;
});
window.addEventListener('keyup', (e) => {
    if ((e.key === 'w' || e.key === 'W') && keys['w'])
        keys['w'] = false;
    if ((e.key === 'a' || e.key === 'A') && keys['a'])
        keys['a'] = false;
    if ((e.key === 's' || e.key === 'S') && keys['s'])
        keys['s'] = false;
    if ((e.key === 'd' || e.key === 'D') && keys['d'])
        keys['d'] = false;
    if ((e.key === 'q' || e.key === 'Q') && keys['q'])
        keys['q'] = false;
    if ((e.key === 'e' || e.key === 'E') && keys['e'])
        keys['e'] = false;
});
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    toArray() {
        return [this.x, this.y];
    }
    addScalar(scalar) {
        return new Vector2(this.x + scalar, this.y + scalar);
    }
    addVector(that) {
        return new Vector2(this.x + that.x, this.y + that.y);
    }
    scale(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    dot(that) {
        return this.x * that.x + this.y * that.y;
    }
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    distanceTo(that) {
        return Math.sqrt((that.x - this.x) ** 2 + (that.y - this.y) ** 2);
    }
    angleTo(that) {
        let angle = Math.atan2((that.y - this.y), (that.x - this.x));
        angle += Math.PI / 2;
        angle = mod(angle, 2 * Math.PI);
        return angle;
    }
    inRectangle(rectangle) {
        let cX = this.x >= rectangle.x && this.x <= rectangle.x + rectangle.w;
        let cY = this.y >= rectangle.y && this.y <= rectangle.y + rectangle.h;
        return cX && cY;
    }
}
class Rectangle {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    set(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    toArray() {
        return [this.x, this.y, this.w, this.h];
    }
    inRectangle(rectangle) {
        let cX = this.x < rectangle.x + rectangle.w && this.x + this.w > rectangle.x;
        let cY = this.y < rectangle.y + rectangle.h && this.y + this.h > rectangle.y;
        return cX && cY;
    }
}
class Mouse {
    constructor(position, down, crosshairActive, canActivate) {
        this.position = position;
        this.down = down;
        this.crosshairActive = crosshairActive;
        this.canActivate = canActivate;
    }
    update() {
        this.position.x = mouseX - 6;
        this.position.y = mouseY - 6;
        this.down = mouseDown;
        if (keys['e'] && this.canActivate) {
            if (this.crosshairActive)
                this.crosshairActive = false;
            else
                this.crosshairActive = true;
            this.canActivate = false;
        }
        if (!keys['e'] && !this.canActivate)
            this.canActivate = true;
    }
}
class Player {
    constructor(image, position, size, velocity, direction, maxHealth, maxFuel) {
        this.image = image;
        this.position = position;
        this.size = size;
        this.velocity = velocity;
        this.maxVelocity = 12000;
        this.acceleration = 150;
        this.direction = direction;
        this.angularVelocity = 4.5;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxFuel = maxFuel;
        this.fuel = maxFuel;
        this.missiles = 10000;
        this.canShoot = true;
    }
    getRectangle() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    propagate(dt) {
        if (keys['w'])
            this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s'])
            this.velocity -= this.acceleration * 0.5 * dt;
        this.position.x += this.velocity * dt * Math.sin(this.direction);
        this.position.y -= this.velocity * dt * Math.cos(this.direction);
        if (keys['w'])
            this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s'])
            this.velocity -= this.acceleration * 0.5 * dt;
        if (this.velocity >= this.maxVelocity)
            this.velocity = this.maxVelocity;
        else if (this.velocity <= this.maxVelocity * -0.25)
            this.velocity = this.maxVelocity * -0.25;
        if (this.velocity >= -4 && this.velocity <= 4 && !keys['w'] && !keys['s'])
            this.velocity = 0;
    }
    rotate(dt) {
        if (keys['a'])
            this.direction -= this.angularVelocity * dt;
        if (keys['d'])
            this.direction += this.angularVelocity * dt;
        this.direction = mod(this.direction, 2 * Math.PI);
    }
    update(mouse, dt) {
        if (!mouse.down && !this.canShoot)
            this.canShoot = true;
        this.propagate(dt);
        this.rotate(dt);
    }
}
class Missile {
    constructor(position, velocity, direction, source) {
        this.position = position;
        this.origin = new Vector2(...this.position.toArray());
        this.size = new Vector2(4, 8);
        this.velocity = velocity;
        this.direction = direction;
        this.damage = 30;
        this.source = source;
    }
}
class Planet {
    constructor(image, imageData, position, radius, velocity, spinVelocity, spinRight, orbiting, orbitsClockwise) {
        this.image = image;
        this.imageData = imageData;
        this.position = position;
        this.radius = radius;
        this.velocity = velocity;
        this.spinOffset = 0;
        this.spinVelocity = spinVelocity;
        this.spinRight = spinRight;
        this.orbiting = orbiting;
        this.orbitsClockwise = orbitsClockwise;
        if (orbiting === null)
            orbitsClockwise = null;
    }
    getRectangle() {
        return new Rectangle(...this.position.toArray(), this.radius * 2, this.radius * 2);
    }
    update(dt) {
        if (this.spinRight)
            this.spinOffset -= this.spinVelocity * dt;
        else
            this.spinOffset += this.spinVelocity * dt;
        this.spinOffset = mod(this.spinOffset, 128);
        if (this.orbiting !== null) {
            let angle = this.position.angleTo(this.orbiting.position);
            if (this.orbitsClockwise)
                angle -= Math.PI / 2;
            else
                angle += Math.PI / 2;
            angle = mod(angle, 2 * Math.PI);
            this.position.x += this.velocity * dt * Math.sin(angle);
            this.position.y -= this.velocity * dt * Math.cos(angle);
        }
    }
}
class Camera {
    constructor(offset, region, lockedToPlayer, canLock) {
        this.offset = offset;
        this.region = region;
        this.lockedToPlayer = lockedToPlayer;
        this.canLock = canLock;
    }
    update(ctx, player) {
        if (keys['q'] && this.canLock) {
            if (!this.lockedToPlayer)
                this.lockedToPlayer = true;
            else
                this.lockedToPlayer = false;
            this.canLock = false;
        }
        if (!keys['q'] && !this.canLock)
            this.canLock = true;
        if (this.lockedToPlayer) {
            this.offset.x = player.position.x - (ctx.canvas.width / 2);
            this.offset.y = player.position.y - (ctx.canvas.height / 2);
        }
        this.region.set(this.offset.x, this.offset.y, ctx.canvas.width, ctx.canvas.height);
    }
}
class Star {
    constructor(position, which) {
        this.position = position;
        this.size = new Vector2(3, 3);
        this.which = which;
        this.imageSource = new Rectangle((this.which % 5) * 3, (this.which % 3) * 3, 3, 3);
    }
}
class Particle {
    constructor(position, velocity, direction, t0, lifetime, which) {
        this.position = position;
        this.size = new Vector2(2, 2);
        this.velocity = velocity;
        this.direction = direction;
        this.t0 = t0;
        this.lifetime = lifetime;
        this.which = which;
        this.imageSource = new Rectangle((this.which % 5) * 2, 0, 2, 2);
    }
}
class Timekeeper {
    constructor(targetFPS, now, then, dt) {
        this.targetFPS = targetFPS;
        this.now = now;
        this.then = then;
        this.dt = dt;
    }
    update(timestamp) {
        this.now = timestamp;
        this.dt = (this.now - this.then) / 1000;
        if (this.dt >= 1 / this.targetFPS)
            this.dt = 1 / this.targetFPS;
        this.then = this.now;
    }
}
class GameState {
    constructor(mouse, player, planets) {
        this.mouse = mouse;
        this.player = player;
        this.missiles = [];
        this.planets = planets;
    }
    spawnMissiles(camera) {
        if (this.mouse.down && this.player.canShoot && this.mouse.crosshairActive && this.player.missiles > 0) {
            let rotateX = this.player.size.x * Math.cos(this.player.direction) * 0.33;
            let rotateY = this.player.size.y * Math.sin(this.player.direction) * 0.33;
            let position = new Vector2(...this.player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = this.player.velocity;
            if (this.player.velocity <= 500)
                velocity = 500;
            let direction = this.player.position.addVector(camera.offset.scale(-1)).angleTo(this.mouse.position);
            this.missiles.push(new Missile(position, velocity, direction, this.player));
            this.player.missiles--;
            this.player.canShoot = false;
        }
    }
    updateMissiles(dt, camera) {
        this.spawnMissiles(camera);
        for (let i = 0; i < this.missiles.length; i++) {
            this.missiles[i].position.x += this.missiles[i].velocity * dt * Math.sin(this.missiles[i].direction);
            this.missiles[i].position.y -= this.missiles[i].velocity * dt * Math.cos(this.missiles[i].direction);
            if (this.missiles[i].position.distanceTo(this.missiles[i].origin) >= 8000) {
                delete this.missiles[i];
            }
            this.missiles = this.missiles.filter(item => item !== undefined);
        }
    }
    update(timekeeper, camera) {
        this.mouse.update();
        for (let i = 0; i < this.planets.length; i++)
            this.planets[i].update(timekeeper.dt);
        this.updateMissiles(timekeeper.dt, camera);
        this.player.update(this.mouse, timekeeper.dt);
    }
}
class Renderer {
    static mercatorProject(x, y, pixelRadius, perspective) {
        let lambda = ((2 * Math.PI * x) / 128) - Math.PI;
        let phi = 2 * (Math.atan(Math.exp(Math.PI - ((2 * Math.PI * y) / 128))));
        let X = 64 * Math.sin(phi) * Math.cos(lambda);
        let Y = 64 * Math.cos(phi);
        let Z = (64 * Math.sin(phi) * Math.sin(lambda)) + 64;
        let scaleProjected = pixelRadius + (perspective / (perspective + Z));
        let xProjected = (X * (scaleProjected - pixelRadius)) + 64;
        let yProjected = (Y * (scaleProjected - pixelRadius)) + 64;
        return [x, y, xProjected, yProjected, scaleProjected, Z];
    }
    constructor(offscreenCanvas, offscreenCtx, ctx, factor, starSheet, particleSheet, missileSheet, crosshairImage, camera, backgroundRegion) {
        this.offscreenCanvas = offscreenCanvas;
        this.offscreenCtx = offscreenCtx;
        this.ctx = ctx;
        this.buffer = new ImageData(128, 128);
        this.factor = factor;
        this.starSheet = starSheet;
        this.particleSheet = particleSheet;
        this.missileSheet = missileSheet;
        this.crosshairImage = crosshairImage;
        this.projections = [];
        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                this.projections.push(Renderer.mercatorProject(x, y, 0.5, 512));
            }
        }
        this.projections.sort((proj1, proj2) => { return proj1[4] - proj2[4]; });
        this.camera = camera;
        this.stars = [];
        this.particles = [];
        this.backgroundRegion = backgroundRegion;
    }
    spawnStars(region, player) {
        for (let i = 0; i < region.w; i += 3) {
            for (let j = 0; j < region.h; j += 3) {
                if (Math.random() > 0.9996) {
                    let pos = new Vector2(i + region.x, j + region.y);
                    let c = !pos.inRectangle(this.camera.region);
                    if (player.position.inRectangle(this.camera.region))
                        c = true;
                    if (c)
                        this.stars.push(new Star(new Vector2(i + region.x, j + region.y), Math.floor(15 * Math.random())));
                }
            }
        }
    }
    updateStars(player) {
        let upRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h - (this.factor * 0.75));
        let downRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y + (this.factor * 0.75), this.backgroundRegion.w, this.backgroundRegion.h - (this.factor * 0.75));
        let leftRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y, this.backgroundRegion.w - (this.factor * 0.75), this.backgroundRegion.h);
        let rightRegion = new Rectangle(this.backgroundRegion.x + (this.factor * 0.75), this.backgroundRegion.y, this.backgroundRegion.w - (this.factor * 0.75), this.backgroundRegion.h);
        if (player.position.inRectangle(upRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y - (this.factor * 0.5), this.backgroundRegion.w, this.backgroundRegion.h - (this.factor * 0.5));
            this.backgroundRegion.set(this.backgroundRegion.x, this.backgroundRegion.y - (this.factor * 0.5), this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
        else if (player.position.inRectangle(downRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y + this.factor, this.backgroundRegion.w, this.backgroundRegion.h - (this.factor * 0.5));
            this.backgroundRegion.set(this.backgroundRegion.x, this.backgroundRegion.y + (this.factor * 0.5), this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
        else if (player.position.inRectangle(leftRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x - (this.factor * 0.5), this.backgroundRegion.y, this.backgroundRegion.w - (this.factor * 0.5), this.backgroundRegion.h);
            this.backgroundRegion.set(this.backgroundRegion.x - (this.factor * 0.5), this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
        else if (player.position.inRectangle(rightRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x + this.factor, this.backgroundRegion.y, this.backgroundRegion.w - (this.factor * 0.5), this.backgroundRegion.h);
            this.backgroundRegion.set(this.backgroundRegion.x + (this.factor * 0.5), this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
    }
    renderStars(player) {
        this.updateStars(player);
        for (let i = 0; i < this.stars.length; i++) {
            let pos = this.stars[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.drawImage(this.starSheet, ...this.stars[i].imageSource.toArray(), ...pos.toArray(), ...this.stars[i].size.toArray());
        }
    }
    renderPlanets(planets, player) {
        for (let i = 0; i < planets.length; i++) {
            // if (planets[i].getRectangle().inRectangle(this.camera.region) || planets[i].position.distanceTo(player.position) <= this.factor) {
            for (let j = 0; j < this.projections.length; j++) {
                if (this.projections[j][5] <= 64) {
                    let x = this.projections[j][0];
                    let y = this.projections[j][1];
                    let xProjected = Math.floor(this.projections[j][2]);
                    let yProjected = Math.floor(this.projections[j][3]);
                    let scaleProjected = Math.ceil(this.projections[j][4]);
                    xProjected -= scaleProjected;
                    yProjected -= scaleProjected;
                    let velComp = Math.floor(x + planets[i].spinOffset);
                    let r = planets[i].imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 0];
                    let g = planets[i].imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 1];
                    let b = planets[i].imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 2];
                    let a = planets[i].imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 3];
                    for (let k = 0; k < scaleProjected * 2; k++) {
                        for (let l = 0; l < scaleProjected * 2; l++) {
                            if (0 <= yProjected + k && yProjected + k < 128 && 0 <= xProjected + l && xProjected + l < 128) {
                                this.buffer.data[(4 * (((yProjected + k) * 128) + xProjected + l)) + 0] = r;
                                this.buffer.data[(4 * (((yProjected + k) * 128) + xProjected + l)) + 1] = g;
                                this.buffer.data[(4 * (((yProjected + k) * 128) + xProjected + l)) + 2] = b;
                                this.buffer.data[(4 * (((yProjected + k) * 128) + xProjected + l)) + 3] = a;
                            }
                        }
                    }
                }
            }
            let pos = planets[i].position.addScalar(-planets[i].radius).addVector(this.camera.offset.scale(-1));
            this.offscreenCtx.putImageData(this.buffer, 0, 0);
            this.ctx.drawImage(this.offscreenCanvas, ...pos.toArray(), planets[i].radius * 2, planets[i].radius * 2);
            this.offscreenCtx.clearRect(0, 0, 128, 128);
            this.buffer.data.fill(0);
            // }
        }
    }
    renderMissiles(missiles) {
        for (let i = 0; i < missiles.length; i++) {
            let pos = missiles[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.save();
            this.ctx.translate(...pos.toArray());
            this.ctx.rotate(missiles[i].direction);
            this.ctx.translate(...pos.scale(-1).toArray());
            this.ctx.drawImage(this.missileSheet, 4 * Math.floor(Math.random() * 2), 0, 4, 8, ...pos.toArray(), 4, 8);
            this.ctx.restore();
        }
    }
    spawnParticles(now, player) {
        if (player.velocity >= 50 && Math.random() >= 0.5 && this.particles.length <= player.velocity / 10) {
            let rotateX = player.size.x * (Math.cos(player.direction) * 0.33 - Math.sin(player.direction));
            let rotateY = player.size.y * (Math.sin(player.direction) * 0.33 + Math.cos(player.direction));
            let position = new Vector2(...player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = player.velocity / 16 + (player.velocity / 16 * Math.random());
            let direction = (player.direction + Math.PI / 2 + Math.PI * Math.random()) % 2 * Math.PI;
            let lifetime = 50 + 100 * Math.random();
            let which = Math.floor(Math.random() * 5);
            this.particles.push(new Particle(position, velocity, direction, now, lifetime, which));
        }
    }
    updateParticles(now, dt, player) {
        this.spawnParticles(now, player);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].position.x += this.particles[i].velocity * dt * Math.sin(this.particles[i].direction);
            this.particles[i].position.y -= this.particles[i].velocity * dt * Math.cos(this.particles[i].direction);
            if (now - this.particles[i].t0 >= this.particles[i].lifetime) {
                delete this.particles[i];
            }
        }
        this.particles = this.particles.filter(item => item !== undefined);
    }
    renderParticles(now, dt, player) {
        this.updateParticles(now, dt, player);
        for (let i = 0; i < this.particles.length; i++) {
            let pos = this.particles[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.drawImage(this.particleSheet, ...this.particles[i].imageSource.toArray(), ...pos.toArray(), ...this.particles[i].size.toArray());
        }
    }
    renderCrosshair(mouse) {
        if (mouse.crosshairActive)
            this.ctx.drawImage(this.crosshairImage, ...mouse.position.toArray());
    }
    renderPlayer(player) {
        let pos = player.position.addVector(this.camera.offset.scale(-1));
        this.ctx.save();
        this.ctx.translate(...pos.toArray());
        this.ctx.rotate(player.direction);
        this.ctx.translate(...pos.scale(-1).toArray());
        this.ctx.drawImage(player.image, ...pos.toArray());
        this.ctx.restore();
    }
    renderUI(player) {
        let healthRatio = Math.floor(player.health / player.maxHealth);
        let fuelRatio = Math.floor(player.fuel / player.maxFuel);
        this.ctx.fillStyle = "rgb(64, 64, 64)";
        this.ctx.fillRect(12, this.ctx.canvas.height - 36, 200, 24);
        this.ctx.fillRect(12, this.ctx.canvas.height - 68, 200, 24);
        this.ctx.fillStyle = "rgb(255, 64, 64)";
        this.ctx.fillRect(16, this.ctx.canvas.height - 32, 192 * healthRatio, 16);
        this.ctx.fillStyle = "rgb(64, 64, 255)";
        this.ctx.fillRect(16, this.ctx.canvas.height - 64, 192 * fuelRatio, 16);
    }
    renderStats(player) {
        this.ctx.fillStyle = "rgb(127, 127, 255)";
        this.ctx.font = "12px serif";
        this.ctx.fillText(`Position: [${Math.round(player.position.x / 100)}, ${Math.round(player.position.y / 100)}]`, 2, 10);
        this.ctx.fillText(`Speed: ${Math.round(player.velocity)}`, 2, 22);
        this.ctx.fillText(`Direction: ${Math.round(player.direction * 100) / 100}`, 2, 34);
        this.ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 2, 46);
        this.ctx.fillText(`Fuel: ${player.fuel}/${player.maxFuel}`, 2, 58);
        this.ctx.fillText(`Missiles: ${player.missiles}`, 2, 70);
    }
    render(timekeeper, gameState) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.camera.update(this.ctx, gameState.player);
        this.renderStars(gameState.player);
        this.renderPlanets(gameState.planets, gameState.player);
        this.renderMissiles(gameState.missiles);
        this.renderParticles(timekeeper.now, timekeeper.dt, gameState.player);
        this.renderCrosshair(gameState.mouse);
        this.renderPlayer(gameState.player);
        this.renderUI(gameState.player);
        this.renderStats(gameState.player);
    }
}
class LoadedStuff {
    constructor(offscreenCanvas, offscreenCtx, splobeImage, crosshairImage, starSheet, particleSheet, missileSheet, earthImage, earthImageData, moonImage, moonImageData, sunImage, sunImageData) {
        this.offscreenCanvas = offscreenCanvas;
        this.offscreenCtx = offscreenCtx;
        this.splobeImage = splobeImage;
        this.crosshairImage = crosshairImage;
        this.starSheet = starSheet;
        this.particleSheet = particleSheet;
        this.missileSheet = missileSheet;
        this.earthImage = earthImage;
        this.earthImageData = earthImageData;
        this.moonImage = moonImage;
        this.moonImageData = moonImageData;
        this.sunImage = sunImage;
        this.sunImageData = sunImageData;
    }
}
function loadGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const splobeImage = yield loadImage('assets/splobe.png');
        const crosshairImage = yield loadImage('assets/crosshair.png');
        const starSheet = yield loadImage('assets/starsheet.png');
        const particleSheet = yield loadImage('assets/particlesheet.png');
        const missileSheet = yield loadImage('assets/missile.png');
        const offscreenCanvas = new OffscreenCanvas(128, 128);
        const offscreenCtx = offscreenCanvas.getContext("2d", { 'willReadFrequently': true });
        if (offscreenCtx === null)
            throw new Error("2D rendering context not supported.");
        offscreenCtx.imageSmoothingEnabled = false;
        const earthImage = yield loadImage('assets/earth.png');
        offscreenCtx.drawImage(earthImage, 0, 0, 128, 128);
        const earthImageData = offscreenCtx.getImageData(0, 0, 128, 128);
        offscreenCtx.clearRect(0, 0, 128, 128);
        const moonImage = yield loadImage('assets/moon.png');
        offscreenCtx.drawImage(moonImage, 0, 0, 128, 128);
        const moonImageData = offscreenCtx.getImageData(0, 0, 128, 128);
        offscreenCtx.clearRect(0, 0, 128, 128);
        const sunImage = yield loadImage('assets/sun.png');
        offscreenCtx.drawImage(sunImage, 0, 0, 128, 128);
        const sunImageData = offscreenCtx.getImageData(0, 0, 128, 128);
        offscreenCtx.clearRect(0, 0, 128, 128);
        return new LoadedStuff(offscreenCanvas, offscreenCtx, splobeImage, crosshairImage, starSheet, particleSheet, missileSheet, earthImage, earthImageData.data, moonImage, moonImageData.data, sunImage, sunImageData.data);
    });
}
function frame(timekeeper, gameState, renderer, timestamp) {
    timekeeper.update(timestamp);
    gameState.update(timekeeper, renderer.camera);
    renderer.render(timekeeper, gameState);
    window.requestAnimationFrame((timestamp) => { frame(timekeeper, gameState, renderer, timestamp); });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const loadedStuff = yield loadGame();
    const canvas = document.getElementById("game");
    if (canvas === null)
        throw new Error("Canvas element `game` was not found.");
    const ctx = canvas.getContext("2d");
    if (ctx === null)
        throw new Error("2D rendering context not supported.");
    ctx.imageSmoothingEnabled = false;
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });
    canvas.addEventListener('mousedown', (e) => { if (!mouseDown && e.buttons === 1)
        mouseDown = true; });
    canvas.addEventListener('mouseup', () => { if (mouseDown)
        mouseDown = false; });
    let mouse = new Mouse(new Vector2(mouseX, mouseY), mouseDown, true, true);
    const timekeeper = new Timekeeper(60, 0, window.performance.now(), 0);
    const player = new Player(loadedStuff.splobeImage, new Vector2(0, 0), new Vector2(16, 16), 0, 0, 100, 100);
    const sun = new Planet(loadedStuff.sunImage, loadedStuff.sunImageData, new Vector2(0, 1000), 200, 0, 32, true, null, null);
    const earth = new Planet(loadedStuff.earthImage, loadedStuff.earthImageData, new Vector2(0, 0), 48, 0, 32, true, null, null);
    const moon = new Planet(loadedStuff.moonImage, loadedStuff.moonImageData, new Vector2(300, 300), 24, 16, 16, true, earth, true);
    const planets = [sun, earth, moon];
    const gameState = new GameState(mouse, player, planets);
    const renderingFactor = canvas.width * 4;
    const offset = new Vector2(player.position.x - (ctx.canvas.width / 2), player.position.y - (ctx.canvas.height / 2));
    const cameraRegion = new Rectangle(...offset.toArray(), ctx.canvas.width, ctx.canvas.height);
    const camera = new Camera(offset, cameraRegion, true, true);
    const backgroundRegion = new Rectangle(...player.position.addScalar(renderingFactor * -0.5).toArray(), renderingFactor, renderingFactor);
    const renderer = new Renderer(loadedStuff.offscreenCanvas, loadedStuff.offscreenCtx, ctx, renderingFactor, loadedStuff.starSheet, loadedStuff.particleSheet, loadedStuff.missileSheet, loadedStuff.crosshairImage, camera, backgroundRegion);
    renderer.spawnStars(backgroundRegion, player);
    window.requestAnimationFrame((timestamp) => { frame(timekeeper, gameState, renderer, timestamp); });
}))();
