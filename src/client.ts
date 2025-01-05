function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function mod(n: number, m: number): number {
    return ((n%m)+m)%m;
}

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let keys: {[key: string]: boolean} = {
    'w': false,
    'a': false,
    's': false,
    'd': false,
    'q': false,
    'e': false,
    'i': false,
    'o': false,
    'p': false,
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false,
    '6': false,
    '7': false,
    '8': false,
    '9': false
};
window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.key === 'w' || e.key === 'W') && !keys['w']) keys['w'] = true;
    if ((e.key === 'a' || e.key === 'A') && !keys['a']) keys['a'] = true;
    if ((e.key === 's' || e.key === 'S') && !keys['s']) keys['s'] = true;
    if ((e.key === 'd' || e.key === 'D') && !keys['d']) keys['d'] = true;
    if ((e.key === 'q' || e.key === 'Q') && !keys['q']) keys['q'] = true;
    if ((e.key === 'e' || e.key === 'E') && !keys['e']) keys['e'] = true;
    if ((e.key === 'i' || e.key === 'I') && !keys['i']) keys['i'] = true;
    if ((e.key === 'o' || e.key === 'O') && !keys['o']) keys['o'] = true;
    if ((e.key === 'p' || e.key === 'P') && !keys['p']) keys['p'] = true;
    if (e.key === '0' && !keys['0']) keys['0'] = true;
    if (e.key === '1' && !keys['1']) keys['1'] = true;
    if (e.key === '2' && !keys['2']) keys['2'] = true;
    if (e.key === '3' && !keys['3']) keys['3'] = true;
    if (e.key === '4' && !keys['4']) keys['4'] = true;
    if (e.key === '5' && !keys['5']) keys['5'] = true;
    if (e.key === '6' && !keys['6']) keys['6'] = true;
    if (e.key === '7' && !keys['7']) keys['7'] = true;
    if (e.key === '8' && !keys['8']) keys['8'] = true;
    if (e.key === '9' && !keys['9']) keys['9'] = true;
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
    if ((e.key === 'w' || e.key === 'W') && keys['w']) keys['w'] = false;
    if ((e.key === 'a' || e.key === 'A') && keys['a']) keys['a'] = false;
    if ((e.key === 's' || e.key === 'S') && keys['s']) keys['s'] = false;
    if ((e.key === 'd' || e.key === 'D') && keys['d']) keys['d'] = false;
    if ((e.key === 'q' || e.key === 'Q') && keys['q']) keys['q'] = false;
    if ((e.key === 'e' || e.key === 'E') && keys['e']) keys['e'] = false;
    if ((e.key === 'i' || e.key === 'I') && keys['i']) keys['i'] = false;
    if ((e.key === 'o' || e.key === 'O') && keys['o']) keys['o'] = false;
    if ((e.key === 'p' || e.key === 'P') && keys['p']) keys['p'] = false;
    if (e.key === '0' && keys['0']) keys['0'] = false;
    if (e.key === '1' && keys['1']) keys['1'] = false;
    if (e.key === '2' && keys['2']) keys['2'] = false;
    if (e.key === '3' && keys['3']) keys['3'] = false;
    if (e.key === '4' && keys['4']) keys['4'] = false;
    if (e.key === '5' && keys['5']) keys['5'] = false;
    if (e.key === '6' && keys['6']) keys['6'] = false;
    if (e.key === '7' && keys['7']) keys['7'] = false;
    if (e.key === '8' && keys['8']) keys['8'] = false;
    if (e.key === '9' && keys['9']) keys['9'] = false;
});

const fontList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '\'', '$', '.', ',', '"', '!', '?', '%', '+', '=', '(', ')'];

const items: {[key: string]: {[key: string]: {[key: string]: string | boolean | ((player: Player) => void)}}} = {
    "consumables": {
        "fuelCanister": {
            "name": "FUEL CANISTER",
            "description": "+10 FUEL",
            "stack": true,
            "action": (player: Player) => {
                player.fuel += 10;
                if (player.fuel >= player.maxFuel) player.fuel = player.maxFuel;
            }
        }
    }
}

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
        angle = mod(angle, 2*Math.PI);
        return angle;
    }

    inRectangle(rectangle: Rectangle): boolean {
        let cX = this.x >= rectangle.x && this.x <= rectangle.x + rectangle.w;
        let cY = this.y >= rectangle.y && this.y <= rectangle.y + rectangle.h;
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
    experience: number;
    missiles: number;
    canShoot: boolean;
    hotbarSwitches: [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];
    hotbar: ItemSlot[];
    inventory: ItemSlot[];

    constructor(image: HTMLImageElement, position: Vector2, size: Vector2, velocity: number, direction: number, maxHealth: number, maxFuel: number, hotbar: ItemSlot[], inventory: ItemSlot[]) {
        this.image = image;
        this.position = position;
        this.size = size;
        this.velocity = velocity;
        this.maxVelocity = 12000;
        this.acceleration = 400;
        this.direction = direction;
        this.angularVelocity = 5;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxFuel = maxFuel;
        this.fuel = maxFuel;
        this.experience = 0;
        this.missiles = 10000;
        this.canShoot = true;
        this.hotbarSwitches = [true, true, true, true, true, true, true, true, true];
        this.hotbar = hotbar;
        this.inventory = inventory;
    }

    getRectangle(): Rectangle {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    useHotbarItem(): void {
        for (let i = 0; i < 9; i++) {
            if (this.hotbarSwitches[i] && keys[`${i+1}`]) {
                this.hotbar[i].item?.action(this);
                if (this.hotbar[i].getAmount() > 1) this.hotbar[i].quantity = this.hotbar[i].getAmount()-1;
                else {
                    this.hotbar[i].item = null;
                    this.hotbar[i].quantity = null;
                }
                this.hotbarSwitches[i] = false;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (!keys[`${i+1}`] && !this.hotbarSwitches[i]) this.hotbarSwitches[i] = true;
        }
    }

    propagate(dt: number): void {
        if (keys['w'] && this.fuel > 0) this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s']) this.velocity -= this.acceleration * 0.5 * dt;
        this.position.x += this.velocity * dt * Math.sin(this.direction);
        this.position.y -= this.velocity * dt * Math.cos(this.direction);
        if (keys['w'] && this.fuel > 0) this.velocity += this.acceleration * 0.5 * dt;
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
        if (keys['w'] && this.fuel > 0 && this.velocity < this.maxVelocity && this.velocity > this.maxVelocity*-0.25) this.fuel -= 0.01;
        if (this.fuel <= 0) this.fuel = 0;
        if (this.fuel >= this.maxFuel) this.fuel = this.maxFuel;
        this.useHotbarItem();
        this.propagate(dt);
        this.rotate(dt);
    }
}

class Missile {
    position: Vector2;
    size: Vector2;
    velocity: number;
    direction: number;
    damage: number;
    t0: number;
    lifetime: number;
    source: Player;

    constructor(position: Vector2, velocity: number, direction: number, t0: number, source: Player) {
        this.position = position;
        this.size = new Vector2(4, 8);
        this.velocity = velocity;
        this.direction = direction;
        this.damage = 30;
        this.t0 = t0;
        this.lifetime = 2000;
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
    orbitalDistance: number | null;
    orbitsClockwise: boolean | null;

    constructor(image: HTMLImageElement, imageData: Uint8ClampedArray, position: Vector2, radius: number, velocity: number, spinVelocity: number, spinRight: boolean, orbiting: Planet | null, orbitsClockwise: boolean | null) {
        this.image = image;
        this.imageData = imageData;
        this.position = position;
        this.radius = radius;
        this.velocity = velocity;
        this.spinOffset = 0;
        this.spinVelocity = spinVelocity;
        this.spinRight = spinRight;
        this.orbiting = orbiting;
        if (this.orbiting !== null) this.orbitalDistance = this.position.distanceTo(this.orbiting.position);
        else this.orbitalDistance = null;
        this.orbitsClockwise = orbitsClockwise;
        if (orbiting === null) orbitsClockwise = null;
    }

    getRectangle(): Rectangle {
        return new Rectangle(...this.position.addScalar(-this.radius).toArray(), this.radius*2, this.radius*2);
    }

    update(dt: number): void {
        if (this.spinRight) this.spinOffset -= this.spinVelocity * dt;
        else this.spinOffset += this.spinVelocity * dt;
        this.spinOffset = mod(this.spinOffset, 128);

        if (this.orbiting !== null && this.orbitalDistance !== null) {
            if (this.position.distanceTo(this.orbiting.position) != this.orbitalDistance) {
                let difference = this.position.distanceTo(this.orbiting.position) - this.orbitalDistance;
                let angle = this.position.angleTo(this.orbiting.position);
                this.position.x += difference * Math.sin(angle);
                this.position.y -= difference * Math.cos(angle);
            }
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
        this.imageSource = new Rectangle((this.which%5)*3, (Math.floor(this.which/5))*3, 3, 3);
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

    spawnMissiles(now: number, camera: Camera): void {
        if (this.mouse.down && this.player.canShoot && this.mouse.crosshairActive && this.player.missiles > 0) {
            let rotateX = this.player.size.x * Math.cos(this.player.direction) * 0.33;
            let rotateY = this.player.size.y * Math.sin(this.player.direction) * 0.33;
            let position = new Vector2(...this.player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = this.player.velocity;
            if (this.player.velocity <= 500) velocity = 500;
            let direction = this.player.position.addVector(camera.offset.scale(-1)).angleTo(this.mouse.position);
            this.missiles.push(new Missile(position, velocity, direction, now, this.player));
            this.player.missiles--;
            this.player.canShoot = false;
        }
    }

    updateMissiles(now: number, dt: number, camera: Camera): void {
        this.spawnMissiles(now, camera);
        for (let i = 0; i < this.missiles.length; i++) {
            this.missiles[i].position.x += this.missiles[i].velocity * dt * Math.sin(this.missiles[i].direction);
            this.missiles[i].position.y -= this.missiles[i].velocity * dt * Math.cos(this.missiles[i].direction);
            if (now - this.missiles[i].t0 >= this.missiles[i].lifetime) {
                delete this.missiles[i];
            }
            this.missiles = this.missiles.filter(item => item !== undefined);
        }
    }

    updatePlanets(dt: number): void {
        for (let i = 0; i < this.planets.length; i++) {
            const planet = this.planets[i];
            if (planet.orbiting !== null) {
                let angle = planet.position.angleTo(planet.orbiting.position);
                if (planet.orbitsClockwise) angle -= Math.PI/2;
                else angle += Math.PI/2;
                angle = mod(angle, 2*Math.PI);
                planet.position.x += planet.velocity * dt * Math.sin(angle);
                planet.position.y -= planet.velocity * dt * Math.cos(angle);
                for (let j = 0; j < this.planets.length; j++) {
                    if (this.planets[j].orbiting === planet) {
                        this.planets[j].position.x += planet.velocity * dt * Math.sin(angle);
                        this.planets[j].position.y -= planet.velocity * dt * Math.cos(angle);
                    }
                }
            }
        }
    }

    update(timekeeper: Timekeeper, camera: Camera): void {
        this.mouse.update();
        for (let i = 0; i < this.planets.length; i++) this.planets[i].update(timekeeper.dt);
        this.updateMissiles(timekeeper.now, timekeeper.dt, camera);
        this.updatePlanets(timekeeper.dt);
        this.player.update(this.mouse, timekeeper.dt);
    }
}

class Item {
    name: string;
    description: string;
    stack: boolean;
    action: (player: Player) => void;

    constructor(name: string, description: string, stack: boolean, action: (player: Player) => void) {
        this.name = name;
        this.description = description;
        this.stack = stack;
        this.action = action;
    }
}

class ItemSlot {
    position: Vector2;
    size: Vector2;
    item: Item | null;
    quantity: number | null;

    constructor(position: Vector2, item: Item | null, quantity: number | null) {
        this.position = position;
        this.size = new Vector2(42, 42);
        this.item = item;
        if (item === null) this.quantity = null;
        else this.quantity = quantity;
    }

    getAmount(): number {
        if (this.quantity !== null) return this.quantity;
        return 0;
    }
    
    addStack (item: Item, quantity: number): void {
        if (this.item === item && this.item.stack && this.quantity !== null) this.quantity += quantity;
        if (this.item === null) {
            this.item = item;
            this.quantity = quantity;
        }
    }
}

class Board {
    active: boolean;
    canChangeState: boolean;
    key: string;
    rectangle: Rectangle;
    name: string;
    slots: Vector2[];

    constructor(key: string, rectangle: Rectangle, name: string, slots: Vector2[]) {
        this.active = false;
        this.canChangeState = true;
        this.key = key;
        this.rectangle = rectangle;
        this.name = name;
        this.slots = slots;
    }

    activate(): void {
        if (keys[this.key] && this.canChangeState) {
            if (this.active) this.active = false;
            else this.active = true;
            this.canChangeState = false;
        }
        if (!keys[this.key] && !this.canChangeState) this.canChangeState = true;
    }
}

class Renderer {
    offscreenCanvas: OffscreenCanvas;
    ctx: CanvasRenderingContext2D;
    offscreenCtx: OffscreenCanvasRenderingContext2D;
    buffer: ImageData;
    factor: number;
    starSheet: HTMLImageElement;
    particleSheet: HTMLImageElement;
    missileSheet: HTMLImageElement;
    crosshairImage: HTMLImageElement;
    heartIcon: HTMLImageElement;
    fuelIcon: HTMLImageElement;
    invSlot: HTMLImageElement;
    fontSheet: HTMLImageElement;
    boards: Board[];
    projections: Array<[number, number, number, number, number, number]>;
    camera: Camera;
    stars: Star[];
    particles: Particle[];
    backgroundRegion: Rectangle;

    static mercatorProject(x: number, y: number, pixelRadius: number, perspective: number): [number, number, number, number, number, number] {
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

    constructor(offscreenCanvas: OffscreenCanvas, offscreenCtx: OffscreenCanvasRenderingContext2D, ctx: CanvasRenderingContext2D, factor: number, starSheet: HTMLImageElement, particleSheet: HTMLImageElement, missileSheet: HTMLImageElement, crosshairImage: HTMLImageElement, heartIcon: HTMLImageElement, fuelIcon: HTMLImageElement, invSlot: HTMLImageElement, fontSheet:HTMLImageElement, boards: Board[], camera: Camera, backgroundRegion: Rectangle) {
        this.offscreenCanvas = offscreenCanvas;
        this.offscreenCtx = offscreenCtx;
        this.ctx = ctx;
        this.buffer = new ImageData(128, 128);
        this.factor = factor;
        this.starSheet = starSheet;
        this.particleSheet = particleSheet;
        this.missileSheet = missileSheet;
        this.crosshairImage = crosshairImage;
        this.heartIcon = heartIcon;
        this.fuelIcon = fuelIcon;
        this.invSlot = invSlot;
        this.boards = boards;
        this.fontSheet = fontSheet;
        this.projections = [];
        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                this.projections.push(Renderer.mercatorProject(x, y, 0.5, 512));
            }
        }
        this.projections.sort((proj1, proj2) => {return proj1[4] - proj2[4];});
        this.camera = camera;
        this.stars = [];
        this.particles = [];
        this.backgroundRegion = backgroundRegion;
    }

    spawnStars(region: Rectangle, player: Player) {
        for (let i = 0; i < region.w; i+=3) {
            for (let j = 0; j < region.h; j+=3) {
                if (Math.random() > 0.9994) {
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
        }  else if (player.position.inRectangle(downRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x, this.backgroundRegion.y+this.factor, this.backgroundRegion.w, this.backgroundRegion.h-(this.factor*0.5));
            this.backgroundRegion.set(this.backgroundRegion.x, this.backgroundRegion.y+(this.factor*0.5), this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        } else if (player.position.inRectangle(leftRegion)) {
            let newStarsAt = new Rectangle(this.backgroundRegion.x-(this.factor*0.5), this.backgroundRegion.y, this.backgroundRegion.w-(this.factor*0.5), this.backgroundRegion.h);
            this.backgroundRegion.set(this.backgroundRegion.x-(this.factor*0.5), this.backgroundRegion.y, this.backgroundRegion.w, this.backgroundRegion.h);
            for (let i = 0; i < this.stars.length; i++) {
                if (!this.stars[i].position.inRectangle(this.camera.region) && !this.stars[i].position.inRectangle(this.backgroundRegion)) {
                    delete this.stars[i];
                }
            }
            this.stars = this.stars.filter(item => item !== undefined);
            this.spawnStars(newStarsAt, player);
        } else if (player.position.inRectangle(rightRegion)) {
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
            const planet = planets[i];
            if (planet.getRectangle().inRectangle(this.camera.region) || planet.position.distanceTo(player.position) <= this.factor) {
                for (let j = 0; j < this.projections.length; j++) {
                    if (this.projections[j][5] <= 64) {
                        let x = this.projections[j][0];
                        let y = this.projections[j][1];
                        let xProjected = Math.floor(this.projections[j][2]);
                        let yProjected = Math.floor(this.projections[j][3]);
                        let scaleProjected = Math.ceil(this.projections[j][4]);
                        xProjected -= scaleProjected;
                        yProjected -= scaleProjected;
                        let velComp = Math.floor(x+planet.spinOffset);
                        let r = planet.imageData[(4*(y*this.offscreenCanvas.width + velComp)) + 0];
                        let g = planet.imageData[(4*(y*this.offscreenCanvas.width + velComp)) + 1];
                        let b = planet.imageData[(4*(y*this.offscreenCanvas.width + velComp)) + 2];
                        let a = planet.imageData[(4*(y*this.offscreenCanvas.width + velComp)) + 3];
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
                let pos = planet.position.addScalar(-planet.radius).addVector(this.camera.offset.scale(-1));
                this.offscreenCtx.putImageData(this.buffer, 0, 0);
                this.ctx.drawImage(this.offscreenCanvas, ...pos.toArray(), planet.radius*2, planet.radius*2);
                this.offscreenCtx.clearRect(0, 0, 128, 128);
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
            let direction = mod((player.direction + Math.PI/2 + Math.PI*Math.random()), 2*Math.PI);
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
    
    renderFont(text: string, x: number, y: number, sizeMultiplier: number): void {
        for (let i = 0; i < text.length; i++) {
            let index = fontList.indexOf(text[i]);
            if (index === -1) throw new Error("Invalid character in text.");
            let xSource = (index%10)*10;
            let ySource = (Math.floor(index/10))*10;
            let newSize = Math.round(10*sizeMultiplier);
            this.ctx.drawImage(this.fontSheet, xSource, ySource, 10, 10, x+i*newSize, y, newSize, newSize);
        }
    }

    renderUI(player: Player): void {
        let healthRatio = Math.floor(192*player.health/player.maxHealth);
        let fuelRatio = Math.floor(192*player.fuel/player.maxFuel);
        this.ctx.fillStyle = "rgb(64, 64, 64)";
        this.ctx.fillRect(12, this.ctx.canvas.height-36, 200, 24);
        this.ctx.fillRect(12, this.ctx.canvas.height-68, 200, 24);
        this.ctx.fillStyle = "rgb(255, 64, 64)";
        this.ctx.fillRect(16, this.ctx.canvas.height-32, healthRatio, 16);
        this.ctx.fillStyle = "rgb(64, 64, 255)";
        this.ctx.fillRect(16, this.ctx.canvas.height-64, fuelRatio, 16);

        this.ctx.drawImage(this.heartIcon, 220, this.ctx.canvas.height-32, 16, 16);
        this.ctx.drawImage(this.fuelIcon, 220, this.ctx.canvas.height-64, 16, 16);

        this.ctx.globalAlpha = 0.75;
        this.ctx.drawImage(this.invSlot, this.ctx.canvas.width-50, 8, 42, 42);
        this.ctx.drawImage(this.invSlot, this.ctx.canvas.width-100, 8, 42, 42);
        this.ctx.drawImage(this.invSlot, this.ctx.canvas.width-150, 8, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)-221, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)-171, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)-121, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)-71, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)-21, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)+29, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)+79, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)+129, this.ctx.canvas.height-50, 42, 42);
        this.ctx.drawImage(this.invSlot, (this.ctx.canvas.width/2)+179, this.ctx.canvas.height-50, 42, 42);

        this.ctx.globalAlpha = 1;
        this.renderFont("P", this.ctx.canvas.width-48, 11, 1);
        this.renderFont("O", this.ctx.canvas.width-98, 11, 1);
        this.renderFont("I", this.ctx.canvas.width-148, 11, 1);
        for (let i = 0; i < 9; i++) {
            this.renderFont(`${i+1}`, (this.ctx.canvas.width/2)-219+(i*50), this.ctx.canvas.height-47, 1);
        }
    }

    renderBoards(player: Player): void {
        for (let i = 0; i < this.boards.length; i++) {
            this.boards[i].activate();
            let board = this.boards[i];
            if (board.active) {
                this.ctx.globalAlpha = 0.5;
                this.ctx.fillStyle = "rgb(127, 127, 255)";
                this.ctx.fillRect(...board.rectangle.toArray());
                this.ctx.globalAlpha = 0.75;
                for (let j = 0; j < board.slots.length; j++) {
                    this.ctx.drawImage(this.invSlot, board.slots[j].x+board.rectangle.x, board.slots[j].y+board.rectangle.y, 42, 42);
                }
                this.ctx.globalAlpha = 1;
                this.renderFont(board.name, (board.rectangle.x+(board.rectangle.w/2))-(10*board.name.length/2), board.rectangle.y+8, 1);
            }
        }
    }

    renderStats(player: Player): void {
        this.ctx.fillStyle = "rgb(127, 127, 255)";
        this.ctx.font = "12px serif";
        this.ctx.fillText(`Position: [${Math.round(player.position.x/100)}, ${Math.round(player.position.y/100)}]`, 2, 10);
        this.ctx.fillText(`Speed: ${Math.round(player.velocity)}`, 2, 22);
        this.ctx.fillText(`Direction: ${Math.round(player.direction*100)/100}`, 2, 34);
        this.ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 2, 46);
        this.ctx.fillText(`Fuel: ${Math.round(player.fuel)}/${player.maxFuel}`, 2, 58);
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
        this.renderUI(gameState.player);
        this.renderBoards(gameState.player);
        this.renderStats(gameState.player);
    }
}

class LoadedStuff {
    offscreenCanvas: OffscreenCanvas;
    offscreenCtx: OffscreenCanvasRenderingContext2D;
    splobeImage: HTMLImageElement;
    crosshairImage: HTMLImageElement;
    starSheet: HTMLImageElement;
    particleSheet: HTMLImageElement;
    missileSheet: HTMLImageElement;
    heartIcon: HTMLImageElement;
    fuelIcon: HTMLImageElement;
    invSlot: HTMLImageElement;
    fontSheet: HTMLImageElement;
    earthImage: HTMLImageElement;
    earthImageData: Uint8ClampedArray;
    moonImage: HTMLImageElement;
    moonImageData: Uint8ClampedArray;
    sunImage: HTMLImageElement;
    sunImageData: Uint8ClampedArray;

    constructor(offscreenCanvas: OffscreenCanvas, offscreenCtx: OffscreenCanvasRenderingContext2D, splobeImage: HTMLImageElement, crosshairImage: HTMLImageElement, starSheet: HTMLImageElement, particleSheet: HTMLImageElement, missileSheet: HTMLImageElement, heartIcon: HTMLImageElement, fuelIcon: HTMLImageElement, invSlot: HTMLImageElement, fontSheet: HTMLImageElement, earthImage: HTMLImageElement, earthImageData: Uint8ClampedArray, moonImage: HTMLImageElement, moonImageData: Uint8ClampedArray, sunImage: HTMLImageElement, sunImageData: Uint8ClampedArray) {
        this.offscreenCanvas = offscreenCanvas;
        this.offscreenCtx = offscreenCtx;
        this.splobeImage = splobeImage;
        this.crosshairImage = crosshairImage;
        this.starSheet = starSheet;
        this.particleSheet = particleSheet;
        this.missileSheet = missileSheet;
        this.heartIcon = heartIcon;
        this.fuelIcon = fuelIcon;
        this.invSlot = invSlot;
        this.fontSheet = fontSheet;
        this.earthImage = earthImage;
        this.earthImageData = earthImageData;
        this.moonImage = moonImage;
        this.moonImageData = moonImageData;
        this.sunImage = sunImage;
        this.sunImageData = sunImageData;
    }
}

async function loadGame(): Promise<LoadedStuff> {
    const splobeImage = await loadImage('assets/splobe.png');
    const crosshairImage = await loadImage('assets/crosshair.png');
    const starSheet = await loadImage('assets/starsheet.png');
    const particleSheet = await loadImage('assets/particlesheet.png');
    const missileSheet = await loadImage('assets/missile.png');

    const heartIcon = await loadImage('assets/heart.png');
    const fuelIcon = await loadImage('assets/fuel.png');
    const invSlot = await loadImage('assets/slot.png');

    const fontSheet = await loadImage('assets/font.png');

    const offscreenCanvas = new OffscreenCanvas(128, 128);
    const offscreenCtx = offscreenCanvas.getContext("2d", {'willReadFrequently': true});
    if (offscreenCtx === null) throw new Error("2D rendering context not supported.");
    offscreenCtx.imageSmoothingEnabled = false;

    const earthImage = await loadImage('assets/earth.png');
    offscreenCtx.drawImage(earthImage, 0, 0, 128, 128);
    const earthImageData = offscreenCtx.getImageData(0, 0, 128, 128);
    offscreenCtx.clearRect(0, 0, 128, 128);
    const moonImage = await loadImage('assets/moon.png');
    offscreenCtx.drawImage(moonImage, 0, 0, 128, 128);
    const moonImageData = offscreenCtx.getImageData(0, 0, 128, 128);
    offscreenCtx.clearRect(0, 0, 128, 128);
    const sunImage = await loadImage('assets/sun.png');
    offscreenCtx.drawImage(sunImage, 0, 0, 128, 128);
    const sunImageData = offscreenCtx.getImageData(0, 0, 128, 128);
    offscreenCtx.clearRect(0, 0, 128, 128);

    return new LoadedStuff(offscreenCanvas, offscreenCtx, splobeImage, crosshairImage, starSheet, particleSheet, missileSheet, heartIcon, fuelIcon, invSlot, fontSheet, earthImage, earthImageData.data, moonImage, moonImageData.data, sunImage, sunImageData.data);
}

function frame(timekeeper: Timekeeper, gameState: GameState, renderer: Renderer, timestamp: number): void {
    timekeeper.update(timestamp);
    gameState.update(timekeeper, renderer.camera);
    renderer.render(timekeeper, gameState);
    window.requestAnimationFrame((timestamp: number) => {frame(timekeeper, gameState, renderer, timestamp);});
}

(async () => {
    const loadedStuff = await loadGame();
    const canvas = document.getElementById("game") as (HTMLCanvasElement | null);
    if (canvas === null) throw new Error("Canvas element `game` was not found.");
    const ctx = canvas.getContext("2d");
    if (ctx === null) throw new Error("2D rendering context not supported.");
    ctx.imageSmoothingEnabled = false;
    
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let scaleY = canvas.height / rect.height;
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });
    canvas.addEventListener('mousedown', (e: MouseEvent) => {if (!mouseDown && e.buttons === 1) mouseDown = true;});
    canvas.addEventListener('mouseup', () => {if (mouseDown) mouseDown = false;});
    let mouse = new Mouse(new Vector2(mouseX, mouseY), mouseDown, true, true);

    let fuelCanisterData = items["consumables"]["fuelCanister"];
    let fuelCanister = new Item(fuelCanisterData["name"] as string, fuelCanisterData["description"] as string, fuelCanisterData["stack"] as boolean, fuelCanisterData["action"] as (player: Player) => void);
    let hotbar = [];
    let inventory = [];
    for (let i = 0; i < 9; i++) hotbar.push(new ItemSlot(new Vector2(0, 0), null, null));
    for (let i = 0; i < 8*15; i++) inventory.push(new ItemSlot(new Vector2(0, 0), null, null));
    hotbar[0].item = fuelCanister;
    hotbar[0].addStack(fuelCanister, 2);
    
    const timekeeper = new Timekeeper(60, 0, window.performance.now(), 0);
    const player = new Player(loadedStuff.splobeImage, new Vector2(0, 0), new Vector2(16, 16), 0, 0, 100, 100, hotbar, inventory);
    const sun = new Planet(loadedStuff.sunImage, loadedStuff.sunImageData, new Vector2(0, 0), 200, 0, 32, true, null, null);
    const earth = new Planet(loadedStuff.earthImage, loadedStuff.earthImageData, new Vector2(0, -600), 48, 50, 32, true, sun, true);
    const moon = new Planet(loadedStuff.moonImage, loadedStuff.moonImageData, new Vector2(200, -600), 24, 100, 16, true, earth, false);
    const planets = [sun, earth, moon];
    const gameState = new GameState(mouse, player, planets);

    const renderingFactor = canvas.width*4;
    const offset = new Vector2(player.position.x-(ctx.canvas.width/2), player.position.y-(ctx.canvas.height/2));
    const cameraRegion = new Rectangle(...offset.toArray(), ctx.canvas.width, ctx.canvas.height);
    const camera = new Camera(offset, cameraRegion, true, true);
    const backgroundRegion = new Rectangle(...player.position.addScalar(renderingFactor*-0.5).toArray(), renderingFactor, renderingFactor);
    const inventorySlots = [];
    const inventoryYRows = 15;
    for (let y = 0; y < inventoryYRows; y++) for (let x = 0; x < 8; x++) inventorySlots.push(new Vector2(8+(x*50), 28+(y*50)));
    const inventoryBoard = new Board("i", new Rectangle(canvas.width-416, 58, 408, 28+(inventoryYRows*50)), 'INVENTORY', inventorySlots);
    const boards = [inventoryBoard];
    const renderer = new Renderer(loadedStuff.offscreenCanvas, loadedStuff.offscreenCtx, ctx, renderingFactor, loadedStuff.starSheet, loadedStuff.particleSheet, loadedStuff.missileSheet, loadedStuff.crosshairImage, loadedStuff.heartIcon, loadedStuff.fuelIcon, loadedStuff.invSlot, loadedStuff.fontSheet, boards, camera, backgroundRegion);
    renderer.spawnStars(backgroundRegion, player);

    window.requestAnimationFrame((timestamp: number) => {frame(timekeeper, gameState, renderer, timestamp);});
})();

// TODO:
// Fix item use logic
// Get consumables working
// Get icons working (and hotbar slot flash on use)
// Drag n drop move around system
// Get ship parts and associated UI working