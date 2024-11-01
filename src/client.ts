function mod(n: number, m: number): number {
    return ((n%m)+m)%m;
}

var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var keys = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'q': false,
    'e': false
};
window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.key === 'w' || e.key === 'W') && !keys['w']) keys['w'] = true;
    if ((e.key === 'a' || e.key === 'A') && !keys['a']) keys['a'] = true;
    if ((e.key === 's' || e.key === 'S') && !keys['s']) keys['s'] = true;
    if ((e.key === 'd' || e.key === 'D') && !keys['d']) keys['d'] = true;
    if ((e.key === 'q' || e.key === 'Q') && !keys['q']) keys['q'] = true;
    if ((e.key === 'e' || e.key === 'E') && !keys['e']) keys['e'] = true;
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
    if ((e.key === 'w' || e.key === 'W') && keys['w']) keys['w'] = false;
    if ((e.key === 'a' || e.key === 'A') && keys['a']) keys['a'] = false;
    if ((e.key === 's' || e.key === 'S') && keys['s']) keys['s'] = false;
    if ((e.key === 'd' || e.key === 'D') && keys['d']) keys['d'] = false;
    if ((e.key === 'q' || e.key === 'Q') && keys['q']) keys['q'] = false;
    if ((e.key === 'e' || e.key === 'E') && keys['e']) keys['e'] = false;
});

const mapCanvas = new OffscreenCanvas(128, 128);
const mapCtx = mapCanvas.getContext("2d", {'willReadFrequently': true});
if (mapCtx === null) throw new Error("2D rendering context not supported.");
mapCtx.imageSmoothingEnabled = false;

class Vector2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    toArray(): [number, number] {
        return [this.x, this.y];
    }

    addScalar(scalar: number): Vector2 {
        return new Vector2(this.x+scalar, this.y+scalar);
    }

    addVector(that: Vector2): Vector2 {
        return new Vector2(this.x+that.x, this.y+that.y);
    }

    scale(scalar: number): Vector2 {
        return new Vector2(this.x*scalar, this.y*scalar);
    }

    dot(that: Vector2): number {
        return this.x*that.x + this.y*that.y;
    }

    magnitude(): number {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    distanceTo(that: Vector2): number {
        return Math.sqrt((that.x-this.x)**2 + (that.y-this.y)**2);
    }

    angleTo(that: Vector2): number {
        let angle = Math.atan2((that.y-this.y), (that.x-this.x));
        angle += Math.PI/2;
        angle %= 2*Math.PI;
        return angle;
    }

    inRectangle(rectangle: Rectangle): boolean {
        let cX = this.x >= rectangle.x && this.x <= rectangle.x+rectangle.w;
        let cY = this.y >= rectangle.y && this.y <= rectangle.y+rectangle.h;
        return cX && cY;
    }
}

class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    set(x: number, y: number, w: number, h: number): void {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    toArray(): [number, number, number, number] {
        return [this.x, this.y, this.w, this.h];
    }

    inRectangle(rectangle: Rectangle): boolean {
        let cX = this.x < rectangle.x + rectangle.w && this.x + this.w > rectangle.x;
        let cY = this.y < rectangle.y + rectangle.h && this.y + this.h > rectangle.y;
        return cX && cY;
    }
}

class Mouse {
    position: Vector2;
    down: boolean;
    crosshairActive: boolean;
    canActivate: boolean;

    constructor(position: Vector2, down: boolean, crosshairActive: boolean, canActivate: boolean) {
        this.position = position;
        this.down = down;
        this.crosshairActive = crosshairActive;
        this.canActivate = canActivate;
    }

    update(): void {
        this.position.x = mouseX-6;
        this.position.y = mouseY-6;
        this.down = mouseDown;

        if (keys['e'] && this.canActivate) {
            if (this.crosshairActive) this.crosshairActive = false;
            else this.crosshairActive = true;
            this.canActivate = false;
        }
        if (!keys['e'] && !this.canActivate) this.canActivate = true;
    }
}

class Player {
    image: HTMLImageElement;
    position: Vector2;
    size: Vector2;
    velocity: number;
    maxVelocity: number;
    acceleration: number;
    direction: number;
    angularVelocity: number;
    maxHealth: number;
    health: number;
    maxFuel: number;
    fuel: number;
    missiles: number;
    canShoot: boolean;

    constructor(image: HTMLImageElement, position: Vector2, size: Vector2, velocity: number, direction: number, maxHealth: number, maxFuel: number) {
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

    getRectangle(): Rectangle {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    propagate(dt: number): void {
        if (keys['w']) this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s']) this.velocity -= this.acceleration * 0.5 * dt;
        this.position.x += this.velocity * dt * Math.sin(this.direction);
        this.position.y -= this.velocity * dt * Math.cos(this.direction);
        if (keys['w']) this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s']) this.velocity -= this.acceleration * 0.5 * dt;

        if (this.velocity >= this.maxVelocity) this.velocity = this.maxVelocity;
        else if (this.velocity <= this.maxVelocity*-0.25) this.velocity = this.maxVelocity*-0.25;
        
        if (this.velocity >= -4 && this.velocity <= 4 && !keys['w'] && !keys['s']) this.velocity = 0;
    }

    rotate(dt: number): void {
        if (keys['a']) this.direction -= this.angularVelocity * dt;
        if (keys['d']) this.direction += this.angularVelocity * dt;
        this.direction = mod(this.direction, 2*Math.PI);
    }

    update(mouse: Mouse, dt: number): void {
        if (!mouse.down && !this.canShoot) this.canShoot = true;
        this.propagate(dt);
        this.rotate(dt);
    }
}

class Missile {
    position: Vector2;
    origin: Vector2;
    size: Vector2;
    velocity: number;
    direction: number;
    damage: number;
    source: Player;

    constructor(position: Vector2, velocity: number, direction: number, source: Player) {
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
    image: HTMLImageElement;
    imageData: Uint8ClampedArray;
    position: Vector2;
    radius: number;
    velocity: number;
    spinOffset: number;
    spinVelocity: number;
    spinRight: boolean;
    orbiting: Planet | null;
    clockwise: boolean | null;

    constructor(image: HTMLImageElement, imageData: Uint8ClampedArray, position: Vector2, radius: number, velocity: number, spinVelocity: number, spinRight: boolean, orbiting: Planet | null, clockwise: boolean | null) {
        this.image = image;
        this.imageData = imageData;
        this.position = position;
        this.radius = radius;
        this.velocity = velocity;
        this.spinOffset = 0;
        this.spinVelocity = spinVelocity;
        this.spinRight = spinRight;
        this.orbiting = orbiting;
        this.clockwise = clockwise;
        if (orbiting === null) clockwise = null;
    }

    getRectangle(): Rectangle {
        return new Rectangle(...this.position.toArray(), this.radius*2, this.radius*2);
    }

    update(dt: number): void {
        if (this.spinRight) this.spinOffset -= this.spinVelocity * dt;
        else this.spinOffset += this.spinVelocity * dt;
        this.spinOffset = mod(this.spinOffset, 128);

        if (this.orbiting !== null) {
            let angle = this.position.angleTo(this.orbiting.position);
            if (this.clockwise) angle -= Math.PI/2;
            else angle += Math.PI/2;
            angle = mod(angle, 2*Math.PI);
            this.position.x += this.velocity * dt * Math.sin(angle);
            this.position.y -= this.velocity * dt * Math.cos(angle);
        }
    }
}

class Camera {
    offset: Vector2;
    region: Rectangle;
    lockedToPlayer: boolean;
    canLock: boolean;

    constructor(offset: Vector2, region: Rectangle, lockedToPlayer: boolean, canLock: boolean) {
        this.offset = offset;
        this.region = region;
        this.lockedToPlayer = lockedToPlayer;
        this.canLock = canLock;
    }

    update(ctx: CanvasRenderingContext2D, player: Player): void {
        if (keys['q'] && this.canLock) {
            if (!this.lockedToPlayer) this.lockedToPlayer = true;
            else this.lockedToPlayer = false;
            this.canLock = false;
        }
        if (!keys['q'] && !this.canLock) this.canLock = true;
        
        if (this.lockedToPlayer) {
            this.offset.x = player.position.x - (ctx.canvas.width/2);
            this.offset.y = player.position.y - (ctx.canvas.height/2);
        }

        this.region.set(this.offset.x, this.offset.y, ctx.canvas.width, ctx.canvas.height);
    }
}

class Star {
    position: Vector2;
    size: Vector2;
    which: number;
    imageSource: Rectangle;

    constructor(position: Vector2, which: number) {
        this.position = position;
        this.size = new Vector2(3, 3);
        this.which = which;
        this.imageSource = new Rectangle((this.which%5)*3, (this.which%3)*3, 3, 3);
    }
}

class Particle {
    position: Vector2;
    size: Vector2;
    velocity: number;
    direction: number;
    t0: number;
    lifetime: number;
    which: number;
    imageSource: Rectangle;

    constructor(position: Vector2, velocity: number, direction: number, t0: number, lifetime: number, which: number) {
        this.position = position;
        this.size = new Vector2(2, 2);
        this.velocity = velocity;
        this.direction = direction;
        this.t0 = t0;
        this.lifetime = lifetime;
        this.which = which;
        this.imageSource = new Rectangle((this.which%5)*2, 0, 2, 2);
    }
}

class Timekeeper {
    targetFPS: number;
    now: number;
    then: number;
    dt: number;

    constructor(targetFPS: number, now: number, then: number, dt: number) {
        this.targetFPS = targetFPS;
        this.now = now;
        this.then = then;
        this.dt = dt;
    }

    update(timestamp: number): void {
        this.now = timestamp;
        this.dt = (this.now - this.then) / 1000;
        if (this.dt >= 1/this.targetFPS) this.dt = 1/this.targetFPS;
        this.then = this.now;
    }
}

class GameState {
    mouse: Mouse;
    player: Player;
    missiles: Missile[];
    planets: Planet[];

    constructor(mouse: Mouse, player: Player, planets: Planet[]) {
        this.mouse = mouse;
        this.player = player;
        this.missiles = [];
        this.planets = planets;
    }

    spawnMissiles(camera: Camera): void {
        if (this.mouse.down && this.player.canShoot && this.mouse.crosshairActive && this.player.missiles > 0) {
            let rotateX = this.player.size.x * Math.cos(this.player.direction) * 0.33;
            let rotateY = this.player.size.y * Math.sin(this.player.direction) * 0.33;
            let position = new Vector2(...this.player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = this.player.velocity;
            if (this.player.velocity <= 500) velocity = 500;
            let direction = this.player.position.addVector(camera.offset.scale(-1)).angleTo(this.mouse.position);
            this.missiles.push(new Missile(position, velocity, direction, this.player));
            this.player.missiles--;
            this.player.canShoot = false;
        }
    }

    updateMissiles(dt: number, camera: Camera): void {
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

    update(timekeeper: Timekeeper, camera: Camera): void {
        this.mouse.update();
        for (let i = 0; i < this.planets.length; i++) this.planets[i].update(timekeeper.dt);
        this.updateMissiles(timekeeper.dt, camera);
        this.player.update(this.mouse, timekeeper.dt);
    }
}

class Renderer {
    offscreenCanvas: OffscreenCanvas;
    ctx: CanvasRenderingContext2D;
    offscreenCtx: OffscreenCanvasRenderingContext2D | null;
    buffer: ImageData;
    factor: number;
    starSheet: HTMLImageElement;
    particleSheet: HTMLImageElement;
    missileSheet: HTMLImageElement;
    crosshairImage: HTMLImageElement;
    projections: Array<[number, number, number, number, number, number]>;
    camera: Camera;
    stars: Star[];
    particles: Particle[];
    backgroundRegion: Rectangle;

    static project(x: number, y: number, pixelRadius: number, perspective: number): [number, number, number, number, number, number] {
        let lambda = ((2*Math.PI*x)/128) - Math.PI;
        let phi = 2*(Math.atan(Math.exp(Math.PI-((2*Math.PI*y)/128)))); 
        let X = 64*Math.sin(phi)*Math.cos(lambda);
        let Y = 64*Math.cos(phi);
        let Z = (64*Math.sin(phi)*Math.sin(lambda))+64;
        let scaleProjected = pixelRadius + (perspective/(perspective+Z));
        let xProjected = (X*(scaleProjected-pixelRadius)) + 64;
        let yProjected = (Y*(scaleProjected-pixelRadius)) + 64;
        return [x, y, xProjected, yProjected, scaleProjected, Z];
    }

    constructor(ctx: CanvasRenderingContext2D, factor: number, starSheet: HTMLImageElement, particleSheet: HTMLImageElement, missileSheet: HTMLImageElement, crosshairImage: HTMLImageElement, camera: Camera, backgroundRegion: Rectangle) {
        this.offscreenCanvas = new OffscreenCanvas(128, 128);
        this.ctx = ctx;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        if (this.offscreenCtx === null) throw new Error("2D rendering context not supported.");
        this.offscreenCtx.imageSmoothingEnabled = false;
        this.buffer = new ImageData(128, 128);
        this.factor = factor;
        this.starSheet = starSheet;
        this.particleSheet = particleSheet;
        this.missileSheet = missileSheet;
        this.crosshairImage = crosshairImage;
        this.projections = [];
        for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) this.projections.push(Renderer.project(x, y, 0.5, 512));
        this.projections.sort((proj1, proj2) => {return proj1[4] - proj2[4];});
        this.camera = camera;
        this.stars = [];
        this.particles = [];
        this.backgroundRegion = backgroundRegion;
    }

    spawnStars(region: Rectangle, player: Player) {
        for (let i = 0; i < region.w; i+=3) {
            for (let j = 0; j < region.h; j+=3) {
                if (Math.random() > 0.9997) {
                    let pos = new Vector2(i+region.x, j+region.y);
                    let c = !pos.inRectangle(this.camera.region);
                    if (player.position.inRectangle(this.camera.region)) c = true;
                    if (c) this.stars.push(new Star(new Vector2(i+region.x, j+region.y), Math.floor(15*Math.random())));
                }
            }
        }
    }

    updateStars(player: Player): void {
        let upRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h-(this.factor*0.75));
        let downRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y+(this.factor*0.75), this.backgroundRegion.w, this.backgroundRegion.h-(this.factor*0.75));
        let leftRegion = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y, this.backgroundRegion.w-(this.factor*0.75), this.backgroundRegion.h);
        let rightRegion = new Rectangle(this.backgroundRegion.x+(this.factor*0.75), this.backgroundRegion.y, this.backgroundRegion.w-(this.factor*0.75), this.backgroundRegion.h);

        if (player.position.inRectangle(upRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y-(this.factor*0.5), this.backgroundRegion.w, this.backgroundRegion.h-(this.factor*0.5));
            this.backgroundRegion.set(this.backgroundRegion.x, this.backgroundRegion.y-(this.factor*0.5), this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        } 
        else if (player.position.inRectangle(downRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y+this.factor, this.backgroundRegion.w, this.backgroundRegion.h-(this.factor*0.5));
            this.backgroundRegion.set(this.backgroundRegion.x, this.backgroundRegion.y+(this.factor*0.5), this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
        else if (player.position.inRectangle(leftRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x-(this.factor*0.5), this.backgroundRegion.y, this.backgroundRegion.w-(this.factor*0.5), this.backgroundRegion.h);
            this.backgroundRegion.set(this.backgroundRegion.x-(this.factor*0.5), this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
        else if (player.position.inRectangle(rightRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x+this.factor, this.backgroundRegion.y, this.backgroundRegion.w-(this.factor*0.5), this.backgroundRegion.h);
            this.backgroundRegion.set(this.backgroundRegion.x+(this.factor*0.5), this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        }
    }

    renderStars(player: Player): void {
        this.updateStars(player);
        for (let i = 0; i < this.stars.length; i++) {
            let pos = this.stars[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.drawImage(this.starSheet, ...this.stars[i].imageSource.toArray(), ...pos.toArray(), ...this.stars[i].size.toArray());
        }
    }

    renderPlanets(planets: Planet[], player: Player): void {
        for (let i = 0; i < planets.length; i++) {
            if (!(player.position.distanceTo(planets[i].position) > this.backgroundRegion.w && planets[i].getRectangle().inRectangle(this.camera.region))) {
                for (let j = 0; j < this.projections.length; j++) {
                    if (this.projections[j][5] <= 64) {
                        let x = this.projections[j][0];
                        let y = this.projections[j][1];
                        let xProjected = Math.floor(this.projections[j][2]);
                        let yProjected = Math.floor(this.projections[j][3]);
                        let scaleProjected = Math.ceil(this.projections[j][4]);
                        xProjected -= scaleProjected;
                        yProjected -= scaleProjected;
                        let velComp = Math.floor(x+planets[i].spinOffset);
                        let r = planets[i].imageData[(4*(y*mapCanvas.width + velComp)) + 0];
                        let g = planets[i].imageData[(4*(y*mapCanvas.width + velComp)) + 1];
                        let b = planets[i].imageData[(4*(y*mapCanvas.width + velComp)) + 2];
                        let a = planets[i].imageData[(4*(y*mapCanvas.width + velComp)) + 3];
                        for (let k = 0; k < scaleProjected*2; k++) {
                            for (let l = 0; l < scaleProjected*2; l++) {
                                if (0 <= yProjected+k && yProjected+k < 128 && 0 <= xProjected+l && xProjected+l < 128) {
                                    this.buffer.data[(4*(((yProjected+k)*128) + xProjected+l)) + 0] = r;
                                    this.buffer.data[(4*(((yProjected+k)*128) + xProjected+l)) + 1] = g;
                                    this.buffer.data[(4*(((yProjected+k)*128) + xProjected+l)) + 2] = b;
                                    this.buffer.data[(4*(((yProjected+k)*128) + xProjected+l)) + 3] = a;
                                }
                            }
                        }
                    }
                }
                let pos = planets[i].position.addScalar(-planets[i].radius).addVector(this.camera.offset.scale(-1));
                this.offscreenCtx?.putImageData(this.buffer, 0, 0);
                this.ctx.drawImage(this.offscreenCanvas, ...pos.toArray(), planets[i].radius*2, planets[i].radius*2);
                this.offscreenCtx?.clearRect(0, 0, 128, 128);
                this.buffer.data.fill(0);
            }
        }
    }

    renderMissiles(missiles: Missile[]) {
        for (let i = 0; i < missiles.length; i++) {
            let pos = missiles[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.save();
            this.ctx.translate(...pos.toArray());
            this.ctx.rotate(missiles[i].direction);
            this.ctx.translate(...pos.scale(-1).toArray());
            this.ctx.drawImage(this.missileSheet, 4*Math.floor(Math.random()*2), 0, 4, 8, ...pos.toArray(), 4, 8);
            this.ctx.restore();
        }
    }

    spawnParticles(now: number, player: Player): void {
        if (player.velocity >= 50 && Math.random() >= 0.5 && this.particles.length <= player.velocity/10) {
            let rotateX = player.size.x * (Math.cos(player.direction)*0.33 - Math.sin(player.direction));
            let rotateY = player.size.y * (Math.sin(player.direction)*0.33 + Math.cos(player.direction));
            let position = new Vector2(...player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = player.velocity/16 + (player.velocity/16 * Math.random());
            let direction = (player.direction + Math.PI/2 + Math.PI*Math.random()) % 2*Math.PI;
            let lifetime = 50 + 100*Math.random();
            let which = Math.floor(Math.random()*5);
            this.particles.push(new Particle(position, velocity, direction, now, lifetime, which));
        }
    }

    updateParticles(now: number, dt: number, player: Player): void {
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

    renderParticles(now: number, dt: number, player: Player): void {
        this.updateParticles(now, dt, player);
        for (let i = 0; i < this.particles.length; i++) {
            let pos = this.particles[i].position.addVector(this.camera.offset.scale(-1));
            this.ctx.drawImage(this.particleSheet, ...this.particles[i].imageSource.toArray(), ...pos.toArray(), ...this.particles[i].size.toArray());
        }
    }

    renderCrosshair(mouse: Mouse): void {
        if (mouse.crosshairActive) this.ctx.drawImage(this.crosshairImage, ...mouse.position.toArray());
    }

    renderPlayer(player: Player): void {
        let pos = player.position.addVector(this.camera.offset.scale(-1));
        this.ctx.save();
        this.ctx.translate(...pos.toArray());
        this.ctx.rotate(player.direction);
        this.ctx.translate(...pos.scale(-1).toArray());
        this.ctx.drawImage(player.image, ...pos.toArray());
        this.ctx.restore();
    }

    renderStats(player: Player): void {
        this.ctx.fillStyle = "rgb(127, 127, 255)";
        this.ctx.font = "12px serif";
        this.ctx.fillText(`Position: [${Math.round(player.position.x/100)}, ${Math.round(player.position.y/100)}]`, 2, 10);
        this.ctx.fillText(`Speed: ${Math.round(player.velocity)}`, 2, 22);
        this.ctx.fillText(`Direction: ${Math.round(player.direction*100)/100}`, 2, 34);
        this.ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 2, 46);
        this.ctx.fillText(`Fuel: ${player.fuel}/${player.maxFuel}`, 2, 58);
        this.ctx.fillText(`Missiles: ${player.missiles}`, 2, 70);
    }

    render(timekeeper: Timekeeper, gameState: GameState): void {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.camera.update(this.ctx, gameState.player);
        this.renderStars(gameState.player);
        this.renderPlanets(gameState.planets, gameState.player);
        this.renderMissiles(gameState.missiles);
        this.renderParticles(timekeeper.now, timekeeper.dt, gameState.player);
        this.renderCrosshair(gameState.mouse);
        this.renderPlayer(gameState.player);
        this.renderStats(gameState.player);
    }
}

function frame(timekeeper: Timekeeper, gameState: GameState, renderer: Renderer, timestamp: number): void {
    timekeeper.update(timestamp);
    gameState.update(timekeeper, renderer.camera);
    renderer.render(timekeeper, gameState);
    window.requestAnimationFrame((timestamp: number) => {frame(timekeeper, gameState, renderer, timestamp);});
}

(async () => {
    const canvas = document.getElementById("game") as (HTMLCanvasElement | null);
    if (canvas === null) throw new Error("Canvas element `game` was not found.");
    const ctx = canvas.getContext("2d");
    if (ctx === null) throw new Error("2D rendering context not supported.");
    ctx.imageSmoothingEnabled = false;

    const splobeImage = new Image(12, 16);
    splobeImage.src = 'assets/splobe.png';
    const crosshairImage = new Image(8, 8);
    crosshairImage.src = 'assets/crosshair.png';
    const starSheet = new Image(15, 9);
    starSheet.src = 'assets/starsheet.png';
    const particleSheet = new Image(10, 2);
    particleSheet.src = 'assets/particlesheet.png';
    const missileSheet = new Image(8, 8);
    missileSheet.src = 'assets/missile.png';
    
    const earthImage = new Image(128, 128);
    earthImage.src = 'assets/earth.png';
    mapCtx.drawImage(earthImage, 0, 0, 128, 128);
    var earthImageData = mapCtx.getImageData(0, 0, 128, 128);
    mapCtx.clearRect(0, 0, 128, 128);
    const moonImage = new Image(128, 128);
    moonImage.src = 'assets/moon.png';
    mapCtx.drawImage(moonImage, 0, 0, 128, 128);
    var moonImageData = mapCtx.getImageData(0, 0, 128, 128);
    mapCtx.clearRect(0, 0, 128, 128);
    const sunImage = new Image(128, 128);
    sunImage.src = 'assets/sun.png';
    mapCtx.drawImage(sunImage, 0, 0, 128, 128);
    var sunImageData = mapCtx.getImageData(0, 0, 128, 128);
    mapCtx.clearRect(0, 0, 128, 128);

    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });
    canvas.addEventListener('mousedown', (e: MouseEvent) => {if (!mouseDown && e.buttons === 1) mouseDown = true;});
    canvas.addEventListener('mouseup', () => {if (mouseDown) mouseDown = false;});
    var mouse = new Mouse(new Vector2(mouseX, mouseY), mouseDown, true, true);

    var timekeeper = new Timekeeper(60, 0, window.performance.now(), 0);
    var player = new Player(splobeImage, new Vector2(0, 0), new Vector2(16, 16), 0, 0, 100, 100);
    var sun = new Planet(sunImage, sunImageData.data, new Vector2(0, 1000), 200, 0, 32, true, null, null);
    var earth = new Planet(earthImage, earthImageData.data, new Vector2(0, 0), 48, 0, 32, true, null, null);
    var moon = new Planet(moonImage, moonImageData.data, new Vector2(300, 300), 24, 16, 16, true, earth, true);
    var planets = [sun, earth, moon];
    var gameState = new GameState(mouse, player, planets);
    var renderingFactor = canvas.width*4;
    var offset = new Vector2(player.position.x-(ctx.canvas.width/2), player.position.y-(ctx.canvas.height/2));
    var cameraRegion = new Rectangle(...offset.toArray(), ctx.canvas.width, ctx.canvas.height);
    var camera = new Camera(offset, cameraRegion, true, true);
    var backgroundRegion = new Rectangle(...player.position.addScalar(renderingFactor*-0.5).toArray(), renderingFactor, renderingFactor);
    var renderer = new Renderer(ctx, renderingFactor, starSheet, particleSheet, missileSheet, crosshairImage, camera, backgroundRegion);
    renderer.spawnStars(backgroundRegion, player);
    window.requestAnimationFrame((timestamp: number) => {frame(timekeeper, gameState, renderer, timestamp);});
})();
