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
    if ((e.key === 'i' || e.key === 'I') && !keys['i'])
        keys['i'] = true;
    if ((e.key === 'o' || e.key === 'O') && !keys['o'])
        keys['o'] = true;
    if ((e.key === 'p' || e.key === 'P') && !keys['p'])
        keys['p'] = true;
    if (e.key === '0' && !keys['0'])
        keys['0'] = true;
    if (e.key === '1' && !keys['1'])
        keys['1'] = true;
    if (e.key === '2' && !keys['2'])
        keys['2'] = true;
    if (e.key === '3' && !keys['3'])
        keys['3'] = true;
    if (e.key === '4' && !keys['4'])
        keys['4'] = true;
    if (e.key === '5' && !keys['5'])
        keys['5'] = true;
    if (e.key === '6' && !keys['6'])
        keys['6'] = true;
    if (e.key === '7' && !keys['7'])
        keys['7'] = true;
    if (e.key === '8' && !keys['8'])
        keys['8'] = true;
    if (e.key === '9' && !keys['9'])
        keys['9'] = true;
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
    if ((e.key === 'i' || e.key === 'I') && keys['i'])
        keys['i'] = false;
    if ((e.key === 'o' || e.key === 'O') && keys['o'])
        keys['o'] = false;
    if ((e.key === 'p' || e.key === 'P') && keys['p'])
        keys['p'] = false;
    if (e.key === '0' && keys['0'])
        keys['0'] = false;
    if (e.key === '1' && keys['1'])
        keys['1'] = false;
    if (e.key === '2' && keys['2'])
        keys['2'] = false;
    if (e.key === '3' && keys['3'])
        keys['3'] = false;
    if (e.key === '4' && keys['4'])
        keys['4'] = false;
    if (e.key === '5' && keys['5'])
        keys['5'] = false;
    if (e.key === '6' && keys['6'])
        keys['6'] = false;
    if (e.key === '7' && keys['7'])
        keys['7'] = false;
    if (e.key === '8' && keys['8'])
        keys['8'] = false;
    if (e.key === '9' && keys['9'])
        keys['9'] = false;
});
const fontList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '\'', '$', '.', ',', '"', '!', '?', '%', '+', '=', '(', ')'];
const items = {
    "consumables": {
        "fuelCanister": {
            "name": "FUEL CANISTER",
            "description": "+25 FUEL",
            "stack": true,
            "action": (player) => {
                player.fuel += 25;
                if (player.fuel >= player.maxFuel)
                    player.fuel = player.maxFuel;
            }
        },
        "healthPack": {
            "name": "HEALTH PACK",
            "description": "+25 HEALTH",
            "stack": true,
            "action": (player) => {
                player.health += 25;
                if (player.health >= player.maxHealth)
                    player.health = player.maxHealth;
            }
        }
    }
};
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
    position() {
        return new Vector2(this.x, this.y);
    }
    size() {
        return new Vector2(this.w, this.h);
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
        this.itemSlot = new ItemSlot(this.position, null, null);
    }
    update(inventoryActive) {
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
        if (inventoryActive)
            this.crosshairActive = false;
    }
}
class Player {
    constructor(image, position, size, velocity, direction, maxHealth, maxFuel, hotbar, inventory) {
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
    getRectangle() {
        return new Rectangle(this.position.x, this.position.y, this.size.x, this.size.y);
    }
    useHotbarItem() {
        var _a;
        for (let i = 0; i < 9; i++) {
            if (this.hotbarSwitches[i] && keys[`${i + 1}`]) {
                if (this.hotbar[i].getAmount() >= 1)
                    (_a = this.hotbar[i].item) === null || _a === void 0 ? void 0 : _a.action(this);
                if (this.hotbar[i].getAmount() > 1)
                    this.hotbar[i].quantity = this.hotbar[i].getAmount() - 1;
                else {
                    this.hotbar[i].item = null;
                    this.hotbar[i].quantity = null;
                }
                this.hotbarSwitches[i] = false;
            }
        }
        for (let i = 0; i < 9; i++) {
            if (!keys[`${i + 1}`] && !this.hotbarSwitches[i])
                this.hotbarSwitches[i] = true;
        }
    }
    propagate(dt) {
        if (keys['w'] && this.fuel > 0)
            this.velocity += this.acceleration * 0.5 * dt;
        if (keys['s'])
            this.velocity -= this.acceleration * 0.5 * dt;
        this.position.x += this.velocity * dt * Math.sin(this.direction);
        this.position.y -= this.velocity * dt * Math.cos(this.direction);
        if (keys['w'] && this.fuel > 0)
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
        if (keys['w'] && this.fuel > 0 && this.velocity < this.maxVelocity && this.velocity > this.maxVelocity * -0.25)
            this.fuel -= 0.01;
        if (this.fuel <= 0)
            this.fuel = 0;
        if (this.fuel >= this.maxFuel)
            this.fuel = this.maxFuel;
        this.useHotbarItem();
        this.propagate(dt);
        this.rotate(dt);
    }
}
class Missile {
    constructor(position, velocity, direction, t0, source) {
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
        if (this.orbiting !== null)
            this.orbitalDistance = this.position.distanceTo(this.orbiting.position);
        else
            this.orbitalDistance = null;
        this.orbitsClockwise = orbitsClockwise;
        if (orbiting === null)
            orbitsClockwise = null;
    }
    getRectangle() {
        return new Rectangle(...this.position.addScalar(-this.radius).toArray(), this.radius * 2, this.radius * 2);
    }
    update(dt) {
        if (this.spinRight)
            this.spinOffset -= this.spinVelocity * dt;
        else
            this.spinOffset += this.spinVelocity * dt;
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
        this.imageSource = new Rectangle((this.which % 5) * 3, (Math.floor(this.which / 5)) * 3, 3, 3);
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
        this.moveSwitch = true;
        this.player = player;
        this.missiles = [];
        this.planets = planets;
    }
    moveItem(inventoryActive) {
        if (inventoryActive) {
            for (let i = 0; i < this.player.hotbar.length + this.player.inventory.length; i++) {
                if (i < 9) {
                    let slotRect = new Rectangle(...this.player.hotbar[i].position.toArray(), 42, 42);
                    if (this.moveSwitch && this.mouse.down && this.player.hotbar[i].item !== null && this.mouse.position.inRectangle(slotRect)) {
                        this.moveSwitch = false;
                        this.mouse.itemSlot.addStack(this.player.hotbar[i].item, this.player.hotbar[i].getAmount());
                        this.player.hotbar[i].removeStack();
                    }
                    if (!this.moveSwitch && !this.mouse.down && this.mouse.itemSlot.item !== null && this.player.hotbar[i].item === null && this.mouse.position.inRectangle(slotRect)) {
                        this.moveSwitch = true;
                        this.player.hotbar[i].addStack(this.mouse.itemSlot.item, this.mouse.itemSlot.getAmount());
                        this.mouse.itemSlot.removeStack();
                    }
                    else if (!this.moveSwitch && !this.mouse.down && this.mouse.itemSlot.item !== null && this.player.hotbar[i].item !== null && this.mouse.position.inRectangle(slotRect)) {
                        // account for this and other edge cases
                        // perhaps move to a system where each icon slot is active or not
                        // how to track where floating item has been dragged from though?
                    }
                }
                else {
                    let slotRect = new Rectangle(...this.player.inventory[i - 9].position.toArray(), 42, 42);
                    if (this.moveSwitch && this.mouse.down && this.player.inventory[i - 9].item !== null && this.mouse.position.inRectangle(slotRect)) {
                        this.moveSwitch = false;
                        this.mouse.itemSlot.addStack(this.player.inventory[i - 9].item, this.player.inventory[i - 9].getAmount());
                        this.player.inventory[i - 9].removeStack();
                    }
                    if (!this.moveSwitch && !this.mouse.down && this.mouse.itemSlot.item !== null && this.player.inventory[i - 9].item === null && this.mouse.position.inRectangle(slotRect)) {
                        this.moveSwitch = true;
                        this.player.inventory[i - 9].addStack(this.mouse.itemSlot.item, this.mouse.itemSlot.getAmount());
                        this.mouse.itemSlot.removeStack();
                    }
                }
            }
        }
    }
    spawnMissiles(now, camera) {
        if (this.mouse.down && this.player.canShoot && this.mouse.crosshairActive && this.player.missiles > 0) {
            let rotateX = this.player.size.x * Math.cos(this.player.direction) * 0.33;
            let rotateY = this.player.size.y * Math.sin(this.player.direction) * 0.33;
            let position = new Vector2(...this.player.position.addVector(new Vector2(rotateX, rotateY)).toArray());
            let velocity = this.player.velocity;
            if (this.player.velocity <= 500)
                velocity = 500;
            let direction = this.player.position.addVector(camera.offset.scale(-1)).angleTo(this.mouse.position);
            this.missiles.push(new Missile(position, velocity, direction, now, this.player));
            this.player.missiles--;
            this.player.canShoot = false;
        }
    }
    updateMissiles(now, dt, camera) {
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
    updatePlanets(dt) {
        for (let i = 0; i < this.planets.length; i++) {
            const planet = this.planets[i];
            if (planet.orbiting !== null) {
                let angle = planet.position.angleTo(planet.orbiting.position);
                if (planet.orbitsClockwise)
                    angle -= Math.PI / 2;
                else
                    angle += Math.PI / 2;
                angle = mod(angle, 2 * Math.PI);
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
    update(timekeeper, camera, inventoryActive) {
        this.mouse.update(inventoryActive);
        this.moveItem(inventoryActive);
        for (let i = 0; i < this.planets.length; i++)
            this.planets[i].update(timekeeper.dt);
        this.updateMissiles(timekeeper.now, timekeeper.dt, camera);
        this.updatePlanets(timekeeper.dt);
        this.player.update(this.mouse, timekeeper.dt);
    }
}
class Item {
    constructor(name, description, icon, stack, action) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.stack = stack;
        this.action = action;
    }
}
class ItemSlot {
    constructor(position, item, quantity) {
        this.position = position;
        this.size = new Vector2(42, 42);
        this.item = item;
        if (item === null)
            this.quantity = null;
        else
            this.quantity = quantity;
    }
    getAmount() {
        if (this.quantity !== null)
            return this.quantity;
        return 0;
    }
    getIcon() {
        if (this.item !== null)
            return this.item.icon;
        return new Image(0, 0);
    }
    addStack(item, quantity) {
        var _a;
        if (this.item === item && ((_a = this.item) === null || _a === void 0 ? void 0 : _a.stack) && this.quantity !== null)
            this.quantity += quantity;
        if (this.item === null) {
            this.item = item;
            this.quantity = quantity;
        }
    }
    removeStack() {
        this.item = null;
        this.quantity = null;
    }
}
class Inventory {
    constructor(key, rectangle, name, slots) {
        this.active = false;
        this.canChangeState = true;
        this.key = key;
        this.rectangle = rectangle;
        this.name = name;
        this.slots = slots;
    }
    activate() {
        if (keys[this.key] && this.canChangeState) {
            if (this.active)
                this.active = false;
            else
                this.active = true;
            this.canChangeState = false;
        }
        if (!keys[this.key] && !this.canChangeState)
            this.canChangeState = true;
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
    constructor(offscreenCanvas, offscreenCtx, ctx, factor, starSheet, particleSheet, missileSheet, crosshairImage, heartIcon, fuelIcon, invSlot, fontSheet, inventory, camera, backgroundRegion) {
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
        this.inventory = inventory;
        this.fontSheet = fontSheet;
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
                if (Math.random() > 0.9994) {
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
                        let velComp = Math.floor(x + planet.spinOffset);
                        let r = planet.imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 0];
                        let g = planet.imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 1];
                        let b = planet.imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 2];
                        let a = planet.imageData[(4 * (y * this.offscreenCanvas.width + velComp)) + 3];
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
                let pos = planet.position.addScalar(-planet.radius).addVector(this.camera.offset.scale(-1));
                this.offscreenCtx.putImageData(this.buffer, 0, 0);
                this.ctx.drawImage(this.offscreenCanvas, ...pos.toArray(), planet.radius * 2, planet.radius * 2);
                this.offscreenCtx.clearRect(0, 0, 128, 128);
                this.buffer.data.fill(0);
            }
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
            let direction = mod((player.direction + Math.PI / 2 + Math.PI * Math.random()), 2 * Math.PI);
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
    renderFont(text, x, y, sizeMultiplier) {
        for (let i = 0; i < text.length; i++) {
            let index = fontList.indexOf(text[i]);
            if (index === -1)
                throw new Error("Invalid character in text.");
            let xSource = (index % 10) * 10;
            let ySource = (Math.floor(index / 10)) * 10;
            let newSize = Math.round(10 * sizeMultiplier);
            this.ctx.drawImage(this.fontSheet, xSource, ySource, 10, 10, x + i * newSize, y, newSize, newSize);
        }
    }
    renderUI(player, mouse) {
        var _a;
        // render bars
        let healthRatio = Math.floor(192 * player.health / player.maxHealth);
        let fuelRatio = Math.floor(192 * player.fuel / player.maxFuel);
        this.ctx.fillStyle = "rgb(64, 64, 64)";
        this.ctx.fillRect(12, this.ctx.canvas.height - 36, 200, 24);
        this.ctx.fillRect(12, this.ctx.canvas.height - 68, 200, 24);
        this.ctx.fillStyle = "rgb(255, 64, 64)";
        this.ctx.fillRect(16, this.ctx.canvas.height - 32, healthRatio, 16);
        this.ctx.fillStyle = "rgb(64, 64, 255)";
        this.ctx.fillRect(16, this.ctx.canvas.height - 64, fuelRatio, 16);
        this.renderFont(`HEALTH - ${Math.round(player.health)}`, 19, this.ctx.canvas.height - 29, 1);
        this.renderFont(`FUEL - ${Math.round(player.fuel)}`, 19, this.ctx.canvas.height - 61, 1);
        // render slots
        this.ctx.globalAlpha = 0.75;
        let slotRect = new Rectangle(this.ctx.canvas.width - 50, 8, 42, 42);
        this.ctx.drawImage(this.invSlot, ...slotRect.toArray());
        slotRect.set((this.ctx.canvas.width / 2) - 221, this.ctx.canvas.height - 50, 42, 42);
        for (let i = 0; i < 9; i++) {
            this.ctx.drawImage(this.invSlot, ...slotRect.toArray());
            slotRect.x += 50;
        }
        this.ctx.globalAlpha = 1;
        // render flashes
        this.ctx.globalAlpha = 0.6;
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgb(200, 200, 200)";
        slotRect.set((this.ctx.canvas.width / 2) - 221, this.ctx.canvas.height - 50, 42, 42);
        for (let i = 0; i < 9; i++) {
            if (keys[`${i + 1}`] || mouse.position.inRectangle(slotRect))
                this.ctx.strokeRect((this.ctx.canvas.width / 2) - 220 + (i * 50), this.ctx.canvas.height - 49, 40, 40);
            slotRect.x += 50;
        }
        if (keys['i'])
            this.ctx.strokeRect(this.ctx.canvas.width - 49, 9, 40, 40);
        // render icons + text
        this.ctx.globalAlpha = 0.75;
        for (let i = 0; i < 9; i++) {
            if (player.hotbar[i].item !== null && player.hotbar[i].getAmount() > 0) {
                this.ctx.drawImage(player.hotbar[i].getIcon(), (this.ctx.canvas.width / 2) - 216 + (i * 50), this.ctx.canvas.height - 45, 32, 32);
                if ((_a = player.hotbar[i].item) === null || _a === void 0 ? void 0 : _a.stack)
                    this.renderFont(`${player.hotbar[i].getAmount()}`, (this.ctx.canvas.width / 2) - 190 + (i * 50) - (10 * (player.hotbar[i].getAmount().toString().length - 1)), this.ctx.canvas.height - 21, 1);
            }
        }
        this.renderFont("I", this.ctx.canvas.width - 48, 11, 1);
        this.ctx.globalAlpha = 1;
    }
    renderInventory(player, mouse) {
        var _a, _b, _c;
        this.inventory.activate();
        if (this.inventory.active) {
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillStyle = "rgb(127, 127, 255)";
            this.ctx.fillRect(...this.inventory.rectangle.toArray());
            this.ctx.globalAlpha = 0.75;
            let slotRect = new Rectangle();
            for (let j = 0; j < this.inventory.slots.length; j++) {
                slotRect.set(...this.inventory.slots[j].addVector(this.inventory.rectangle.position()).toArray(), 42, 42);
                this.ctx.drawImage(this.invSlot, ...slotRect.toArray());
                if (mouse.position.inRectangle(slotRect)) {
                    this.ctx.globalAlpha = 0.6;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = "rgb(200, 200, 200)";
                    this.ctx.strokeRect(...slotRect.toArray());
                    this.ctx.globalAlpha = 0.75;
                }
                if (j < 9) {
                    if (player.hotbar[j].item !== null && player.hotbar[j].getAmount() > 0) {
                        this.ctx.drawImage(player.hotbar[j].getIcon(), slotRect.x + 5, slotRect.y + 5, 32, 32);
                        if ((_a = player.hotbar[j].item) === null || _a === void 0 ? void 0 : _a.stack)
                            this.renderFont(`${player.hotbar[j].getAmount()}`, slotRect.x + 29 - (10 * (player.hotbar[j].getAmount().toString().length - 1)), slotRect.y + 29, 1);
                    }
                    this.renderFont(`${j + 1}`, slotRect.x + 2, slotRect.y + 3, 1);
                }
                else {
                    if (player.inventory[j - 9].item !== null && player.inventory[j - 9].getAmount() > 0) {
                        this.ctx.drawImage(player.inventory[j - 9].getIcon(), slotRect.x + 5, slotRect.y + 5, 32, 32);
                        if ((_b = player.inventory[j - 9].item) === null || _b === void 0 ? void 0 : _b.stack)
                            this.renderFont(`${player.inventory[j - 9].getAmount()}`, slotRect.x + 29 - (10 * (player.inventory[j - 9].getAmount().toString().length - 1)), slotRect.y + 29, 1);
                    }
                }
            }
            this.renderFont(this.inventory.name, (this.inventory.rectangle.x + (this.inventory.rectangle.w / 2)) - (10 * this.inventory.name.length / 2), this.inventory.rectangle.y + 8, 1);
            if (mouse.itemSlot.item !== null) {
                this.ctx.globalAlpha = 0.5;
                this.ctx.drawImage(mouse.itemSlot.getIcon(), mouse.position.x, mouse.position.y, 32, 32);
                if ((_c = mouse.itemSlot.item) === null || _c === void 0 ? void 0 : _c.stack)
                    this.renderFont(`${mouse.itemSlot.getAmount()}`, mouse.position.x + 24 - (10 * (mouse.itemSlot.getAmount().toString().length - 1)), mouse.position.y + 24, 1);
            }
            this.ctx.globalAlpha = 1;
        }
    }
    renderStats(player) {
        this.ctx.fillStyle = "rgb(127, 127, 255)";
        this.ctx.font = "12px serif";
        this.ctx.fillText(`Position: [${Math.round(player.position.x / 100)}, ${Math.round(player.position.y / 100)}]`, 2, 10);
        this.ctx.fillText(`Speed: ${Math.round(player.velocity)}`, 2, 22);
        this.ctx.fillText(`Direction: ${Math.round(player.direction * 100) / 100}`, 2, 34);
        this.ctx.fillText(`Missiles: ${player.missiles}`, 2, 46);
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
        this.renderUI(gameState.player, gameState.mouse);
        this.renderInventory(gameState.player, gameState.mouse);
        this.renderStats(gameState.player);
    }
}
function frame(timekeeper, gameState, renderer, timestamp) {
    timekeeper.update(timestamp);
    gameState.update(timekeeper, renderer.camera, renderer.inventory.active);
    renderer.render(timekeeper, gameState);
    window.requestAnimationFrame((timestamp) => { frame(timekeeper, gameState, renderer, timestamp); });
}
class LoadedStuff {
    constructor(offscreenCanvas, offscreenCtx, splobeImage, crosshairImage, starSheet, particleSheet, missileSheet, heartIcon, fuelIcon, invSlot, fontSheet, earthImage, earthImageData, moonImage, moonImageData, sunImage, sunImageData) {
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
function loadGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const splobeImage = yield loadImage('assets/splobe.png');
        const crosshairImage = yield loadImage('assets/crosshair.png');
        const starSheet = yield loadImage('assets/starsheet.png');
        const particleSheet = yield loadImage('assets/particlesheet.png');
        const missileSheet = yield loadImage('assets/missile.png');
        const heartIcon = yield loadImage('assets/heart.png');
        const fuelIcon = yield loadImage('assets/fuel.png');
        const invSlot = yield loadImage('assets/slot.png');
        const fontSheet = yield loadImage('assets/font.png');
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
        return new LoadedStuff(offscreenCanvas, offscreenCtx, splobeImage, crosshairImage, starSheet, particleSheet, missileSheet, heartIcon, fuelIcon, invSlot, fontSheet, earthImage, earthImageData.data, moonImage, moonImageData.data, sunImage, sunImageData.data);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // load assets and get canvas context
    const loadedStuff = yield loadGame();
    const canvas = document.getElementById("game");
    if (canvas === null)
        throw new Error("Canvas element `game` was not found.");
    const ctx = canvas.getContext("2d");
    if (ctx === null)
        throw new Error("2D rendering context not supported.");
    ctx.imageSmoothingEnabled = false;
    // get mouse events
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
    // make item objects
    let fuelCanisterData = items["consumables"]["fuelCanister"];
    let fuelCanister = new Item(fuelCanisterData["name"], fuelCanisterData["description"], loadedStuff.fuelIcon, fuelCanisterData["stack"], fuelCanisterData["action"]);
    let healthPackData = items["consumables"]["healthPack"];
    let healthPack = new Item(healthPackData["name"], healthPackData["description"], loadedStuff.heartIcon, healthPackData["stack"], healthPackData["action"]);
    // get items into inventory
    let hotbar = [];
    let inventory = [];
    const inventoryRows = 4;
    const inventoryCols = 9;
    for (let i = 0; i < 9; i++)
        hotbar.push(new ItemSlot(new Vector2(canvas.width - 458 + (i * 50), 86), null, null));
    for (let y = 0; y < inventoryRows; y++)
        for (let x = 0; x < inventoryCols; x++)
            inventory.push(new ItemSlot(new Vector2(canvas.width - 458 + (x * 50), 136 + (y * 50)), null, null));
    hotbar[0].addStack(fuelCanister, 99);
    hotbar[1].addStack(healthPack, 99);
    inventory[35].addStack(fuelCanister, 99);
    // initialise game state
    const timekeeper = new Timekeeper(60, 0, window.performance.now(), 0);
    const player = new Player(loadedStuff.splobeImage, new Vector2(0, 0), new Vector2(16, 16), 0, 0, 100, 100, hotbar, inventory);
    const sun = new Planet(loadedStuff.sunImage, loadedStuff.sunImageData, new Vector2(0, 0), 200, 0, 32, true, null, null);
    const earth = new Planet(loadedStuff.earthImage, loadedStuff.earthImageData, new Vector2(0, -600), 48, 50, 32, true, sun, true);
    const moon = new Planet(loadedStuff.moonImage, loadedStuff.moonImageData, new Vector2(200, -600), 24, 100, 16, true, earth, false);
    const planets = [sun, earth, moon];
    const gameState = new GameState(mouse, player, planets);
    // initialise renderer
    const renderingFactor = canvas.width * 4;
    const offset = new Vector2(player.position.x - (ctx.canvas.width / 2), player.position.y - (ctx.canvas.height / 2));
    const cameraRegion = new Rectangle(...offset.toArray(), ctx.canvas.width, ctx.canvas.height);
    const camera = new Camera(offset, cameraRegion, true, true);
    const backgroundRegion = new Rectangle(...player.position.addScalar(renderingFactor * -0.5).toArray(), renderingFactor, renderingFactor);
    const inventorySlots = [];
    for (let y = 0; y < inventoryRows + 1; y++)
        for (let x = 0; x < inventoryCols; x++)
            inventorySlots.push(new Vector2(8 + (x * 50), 28 + (y * 50)));
    const inventoryBoard = new Inventory("i", new Rectangle(canvas.width - 466, 58, 8 + (inventoryCols * 50), 28 + ((inventoryRows + 1) * 50)), 'INVENTORY', inventorySlots);
    const renderer = new Renderer(loadedStuff.offscreenCanvas, loadedStuff.offscreenCtx, ctx, renderingFactor, loadedStuff.starSheet, loadedStuff.particleSheet, loadedStuff.missileSheet, loadedStuff.crosshairImage, loadedStuff.heartIcon, loadedStuff.fuelIcon, loadedStuff.invSlot, loadedStuff.fontSheet, inventoryBoard, camera, backgroundRegion);
    renderer.spawnStars(backgroundRegion, player);
    // start game loops
    window.requestAnimationFrame((timestamp) => { frame(timekeeper, gameState, renderer, timestamp); });
}))();
// TODO:
// Drag n drop move around system
// Get ship parts and associated UI working
