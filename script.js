//Note: use backtick `` for embedding variables in a string

let h2os = [];
let co2s = [];
let h2co3s = [];
let h3os = [];
let hco3s = [];
let ohs = [];

let animationId;
let allAnimationId;
const minDistForReaction = 30; //200 pixels
const minDistForReactionNotMoving = 200;
const cooldownLength = 200; //screen refreshes before a molecule can react again

class Molecule {
    constructor(x, y, box, moving, dx, dy) {
        this.x = x;
        this.y = y;
        this.box = box;
        this.moving = moving;
        this.dx = dx;
        this.dy = dy;
        this.cooldown = 0;
        this.dragging = false;
        this.speed=3;

        this.offsetX = 0;
        this.offsetY = 0;
        this.reacting = false;
        this.lastReactedWith = null;

        const boxelement = document.getElementById(this.box);
        this.height = boxelement.offsetHeight;
        this.width = boxelement.offsetWidth;

        this.elements = []; //All html elements in the molecule

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    getLocation() {
        return [this.x, this.y];
    }
    //Make every molecule draggable
    makeDraggable(elements) {
        this.elements = elements;

        this.elements.forEach(element => {
            element.addEventListener("mousedown", this.mouseDown);
        });
    }

    makeUnDraggable() {
        this.elements.forEach(element => {
            element.removeEventListener("mousedown", this.mouseDown);
        })
    }

    mouseDown(event) {
        this.dragging = true;
        this.offsetX = event.clientX - this.x;
        this.offsetY = event.clientY - this.y;

        document.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("mouseup", this.mouseUp);
    }

    mouseUp(event) {
        this.dragging = false;
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseUp);
    }
    mouseMove(event) {
        if (this.dragging) {
            this.x = event.clientX - this.offsetX;
            //this.x = Math.min(this.x, width);
            this.y = event.clientY - this.offsetY;
            this.y = Math.min(this.y, this.height);
            this.y = Math.max(0, this.y);
            this.draw();
        }
    }

    move() {
        if (this.moving && !this.reacting) {
            this.x+=this.dx;
            this.y+=this.dy;
            if (this.x<=0) {
                this.dx=this.speed;
            }
            if (this.y<=0) {
                this.dy=this.speed;
            }
            if (this.y>=this.height) {
                this.dy=-this.speed;
            }
            if (this.x>=this.width) {
                this.dx=-this.speed;
            }
        }
    }
}

class OH extends Molecule {
    constructor(x, y, box, moving, dx, dy, h, o) {
        super(x, y, box, moving, dx, dy);
        this.h=h;
        this.o=o;
        this.speed=5; //Fastest, since it's the smallest
    }

    draw() {
        this.h.style=`top:${this.y+25}px; left:${this.x-20}px; z-index:5;`;
        this.o.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
    }

    combineH3O(combineWith) {
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            //Start the collision animation
            this.reacting = true;
            combineWith.reacting = true;
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineH3O(combineWith));
            } else { //Start animation to move the oxygens and hydrogens
                h3os = h3os.filter(item => item != combineWith);
                ohs = ohs.filter(item => item != this);
                this.makeUnDraggable();
                combineWith.makeUnDraggable();
                let molecule = new H2O(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.h, this.o, combineWith.h3);
                molecule.draw();
                molecule.makeDraggable([this.h, this.o, combineWith.h3]);
                h2os.push(molecule);
                let moleculeTwo = new H2O(this.x, this.y, this.box, combineWith.moving, getD(this.speed), getD(this.speed), combineWith.h1, combineWith.o, combineWith.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, combineWith.o, combineWith.h2]);
                h2os.push(moleculeTwo);
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 100, +1,0));
                molecule.cooldown=0;
                moleculeTwo.cooldown=0;
                molecule.lastReactedWith = moleculeTwo;
                moleculeTwo.lastReactedWith = molecule;
            }
            
        }
    }

    combineH2CO3(combineWith) {
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            //Start the collision animation
            this.reacting = true;
            combineWith.reacting = true;
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineH2CO3(combineWith));
            } else { //Start animation to move the oxygens and hydrogens
                h2co3s = h2co3s.filter(item => item != combineWith);
                ohs = ohs.filter(item => item != this);
                this.makeUnDraggable();
                combineWith.makeUnDraggable();
                let molecule = new H2O(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.h, this.o, combineWith.h2);
                molecule.draw();
                molecule.makeDraggable([this.h, this.o, combineWith.h2]);
                h2os.push(molecule);
                let moleculeTwo = new HCO3(this.x, this.y, this.box, combineWith.moving, getD(this.speed), getD(this.speed), combineWith.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, combineWith.c, combineWith.o1, combineWith.o2, combineWith.o3]);
                hco3s.push(moleculeTwo);
                animationId = requestAnimationFrame(() => moveMolecule(molecule, 100, +1,0));
                molecule.cooldown=0;
                moleculeTwo.cooldown=0;
                molecule.lastReactedWith = moleculeTwo;
                moleculeTwo.lastReactedWith = molecule;
            }
            
        }
    }
}

class H3O extends Molecule{
    constructor(x, y, box, moving, dx, dy, h1, o, h2, h3) {
        super(x, y, box, moving, dx, dy);
        this.h1=h1;
        this.h2=h2;
        this.h3=h3;
        this.o=o;
        this.speed=3;
    }
    draw() {
        this.h1.style=`top:${this.y+25}px; left:${this.x-25}px; z-index:5;`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+30}px; z-index:3`;
        this.h3.style=`top:${this.y-20}px; left:${this.x+5}px; z-index:3;`
        this.o.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
    }

    combineHCO3(combineWith) { //combineWith is the hco3 element that it's supposed to combine with
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            this.reacting = true;
            combineWith.reacting = true;
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            //console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineHCO3(combineWith));
            } else { //Start animation to move the oxygens and hydrogens
                h3os = h3os.filter(item => item != this);
                this.makeUnDraggable();
                hco3s = hco3s.filter(item => item != combineWith);
                combineWith.makeUnDraggable();
                let moleculeTwo = new H2O(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), combineWith.h1, this.o, this.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, this.o, this.h2]);
                h2os.push(moleculeTwo);
                let molecule = new H2CO3(this.x, this.y, this.box, combineWith.moving, getD(this.speed), getD(this.speed), this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h3, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h3]);
                h2co3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 100, +1,0));
                molecule.cooldown=0;
                moleculeTwo.cooldown=0;
                molecule.lastReactedWith = moleculeTwo;
                moleculeTwo.lastReactedWith = molecule;
            }
            
        }
    }
}

class HCO3 extends Molecule{
    constructor(x, y, box, moving, dx, dy, h1, o1, c, o2, o3, html) {
        super(x, y, box, moving, dx, dy);
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.html = html;
        this.speed=3;
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px; z-index:5;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px; z-index:3;`;
        this.c.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px; z-index:3;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px; z-index:6;`
    }
}

class CO2 extends Molecule{
    constructor(x, y, box, moving, dx, dy, o1, c, o2, html) {
        super(x, y, box, moving, dx, dy);
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.html = html;
        this.speed = 3; //Still pretty fast
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px; z-index:5;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px; z-index:3;`;
        this.c.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
    }
}

class H2CO3 extends Molecule{
    constructor(x, y, box, moving, dx, dy, h1, o1, c, o2, o3, h2, html) {
        super(x, y, box, moving, dx, dy);
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.h2 = h2;
        this.html = html;
        this.speed=2; //Slowest
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px; z-index:5;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px; z-index:3`;
        this.c.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px; z-index:3;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px; z-index:6;`
        this.h2.style=`top:${this.y+10}px; left:${this.x+75}px; z-index:2;`
    }

    decompose() {
        console.log("DECOMPOSING!!!");
        this.reacting = true;
        h2co3s = h2co3s.filter(item => item != this);
        this.makeUnDraggable();
        let moleculeTwo = new H2O(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.h1, this.o1, this.h2, null);
        moleculeTwo.draw();
        moleculeTwo.makeDraggable([this.h1, this.o1, this.h2]);
        let molecule = new CO2(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.o2, this.c, this.o3, null);
        molecule.x+=50;
        molecule.y+=50;
        molecule.draw();
        molecule.makeDraggable([this.o2, this.c, this.o3]);
        h2os.push(moleculeTwo);
        co2s.push(molecule);
        animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 100, +1,0));
        molecule.cooldown=0;
        moleculeTwo.cooldown=0;
        molecule.lastReactedWith = moleculeTwo;
        moleculeTwo.lastReactedWith = molecule;
    }
}

class H2O extends Molecule{
    constructor(x, y, box, moving, dx, dy, h1, o, h2, html) {
        super(x, y, box, moving, dx, dy);
        this.h1 = h1;
        this.o = o;
        this.h2 = h2;
        this.html = html;
        this.speed=4; //pretty fast
    }

    combineCO2(combineWith) { //combineWith is the co2 element that it's supposed to combine with
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            this.reacting = true;
            combineWith.reacting = true;
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            //console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineCO2(combineWith));
            } else { //Start animation to move the oxygens and hydrogens
                //cancelAnimationFrame(animationId);
                //animationId = requestAnimationFrame(() => this.split(combineWith));
                //Remove from h2o and from co2 list, add to carbonate list
                h2os = h2os.filter(item => item != this);
                co2s = co2s.filter(item => item != combineWith);
                this.makeUnDraggable();
                combineWith.makeUnDraggable();
                let molecule = new H2CO3(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.h1, combineWith.o1, combineWith.c, combineWith.o2, this.o, this.h2, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, this.o, this.h2]);
                h2co3s.push(molecule);
                molecule.cooldown=0;
            }
            
        }
    }

    combineH2CO3(combineWith) { //Where combineWith is the H2CO3 element
        //This will create a new H3O+ and HCO3-
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            this.reacting = true;
            combineWith.reacting = true;
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            //console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineH2CO3(combineWith));
            } else {
                //Remove from h2o and from h2co3 list, add to hco3 list
                h2os = h2os.filter(item => item != this);
                h2co3s = h2co3s.filter(item => item != combineWith);
                this.makeUnDraggable();
                combineWith.makeUnDraggable();
                let moleculeTwo = new H3O(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), combineWith.h1, this.o, this.h2, combineWith.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, this.o, this.h2, combineWith.h2]);
                h3os.push(moleculeTwo);
                let molecule = new HCO3(this.x, this.y,this.box, combineWith.moving, getD(this.speed), getD(this.speed), this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3]);
                hco3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 120, 1, 0));
                molecule.cooldown=0;
                moleculeTwo.cooldown=0;
                molecule.lastReactedWith = moleculeTwo;
                moleculeTwo.lastReactedWith = molecule;
            }
        }
    }

    combineHCO3(combineWith) { //Where combineWith is the HCO3 element
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= (this.moving?minDistForReaction:minDistForReactionNotMoving) && this.lastReactedWith !== combineWith) { //Close enough to collide
            this.reacting = true;
            combineWith.reacting = true;
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -this.speed;
            } else if (current[0] < center[0]) {
                change[0]=this.speed;
            }
            if (current[1] > center[1]) {
                change[1] = -this.speed;
            } else if (current[1] < center[1]) {
                change[1] = this.speed;
            }
            //console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineHCO3(combineWith));
            } else {
                h2os = h2os.filter(item => item != this);
                hco3s = hco3s.filter(item => item != combineWith);
                this.makeUnDraggable();
                combineWith.makeUnDraggable();
                let moleculeTwo = new OH(this.x, this.y, this.box, this.moving, getD(this.speed), getD(this.speed), this.h1, this.o);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([this.h1, this.o]);
                ohs.push(moleculeTwo);
                let molecule = new H2CO3(this.x, this.y, this.box, combineWith.moving, getD(this.speed), getD(this.speed), combineWith.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h2, null);
                molecule.draw();
                molecule.makeDraggable([combineWith.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h2]);
                h2co3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo,150,1,0));
                molecule.cooldown=0;
                moleculeTwo.cooldown=0;
                molecule.lastReactedWith = moleculeTwo;
                moleculeTwo.lastReactedWith = molecule;
            }
        }
    }

    drawTwo(a, b, c, d, e, f) {
        this.h1.style=`top:${this.y+a}px; left:${this.x+b}px;`;
        this.h2.style=`top:${this.y+c}px; left:${this.x+d}px;`;
        this.o.style=`top:${this.y+e}px; left:${this.x+f}px;`;
        //console.log(`Hello world ${this.y+a} left:${this.x+b} top:${this.y+c}px; left:${this.x+d}px top:${this.y+e} left:${this.x+f}`);
    }

    draw() {
        this.h1.style=`top:${this.y+25}px; left:${this.x-20}px; z-index:5`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+25}px; z-index:3;`;
        this.o.style=`top:${this.y}px; left:${this.x}px; z-index:4;`;
    }
}

//document.getElementById("test").addEventListener("click", myFunction);

function addRandomMolecule() { //Adds it to box 10
    const placeholder = document.getElementById("Placeholder");
    let parts;
    const num = getRandom(1,6);
    if (num == 1) { //H2O
        parts = makeH2O(getRandom(1, 500), getRandom(1, 500), 10, true, getD(4), getD(4), null);
        console.log("Making a new H2O");
    } else if (num == 2) { //co2
        parts = makeCO2(getRandom(1, 500), getRandom(1, 500), 10, true, getD(3), getD(3), null);
        console.log("Making a new CO2");
    } else if (num == 3) { //h2co3
        parts = makeH2CO3(getRandom(1, 500), getRandom(1, 500), 10, true, getD(2), getD(2), null);
        console.log("Making a new H2CO3");
    } else if (num == 4) { //h3o
        parts = makeH3O(getRandom(1, 500), getRandom(1, 500), 10, true, getD(4), getD(4), null);
        console.log("Making a new H3O");
    } else if (num == 5) { //hco3
        parts = makeHCO3(getRandom(1, 500), getRandom(1, 500), 10, true, getD(3), getD(3), null);
        console.log("Making a new HCO3");
    } else if (num == 6) { //oh
        parts = makeH2O(getRandom(1, 500), getRandom(1, 500), 10, true, getD(5), getD(5), null);
        console.log("Making a new OH");
    }
    parts.forEach(tempelement => {
        placeholder.insertAdjacentElement('afterend', tempelement);
    });
    /*
let h2os = [];
let co2s = [];
let h2co3s = [];
let h3os = [];
let hco3s = [];
let ohs = [];* */
//x, y, box, moving, dx, dy, element
}

function clearAll() {
    h2os = [];
    co2s = [];
    h2co3s = [];
    h3os = [];
    hco3s = [];
    ohs = [];
}

function myFunctionNotMoving() {
    let h2oUsed = [];
    let co2Used = [];
    let h2co3Used = [];
    let h3oUsed = [];
    let hco3Used = [];
    let ohUsed = [];

    let counter = 0;
    co2s.forEach(co2 => {
        let pos = co2.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !co2Used.includes(counter) && !co2.reacting && !h2os[i].reacting && co2.box == h2os[i].box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h2os[index].combineCO2(co2);
            h2oUsed.push(index); //Add index to the list of used h2os
            co2Used.push(counter);
        }
        counter++;
    });
    counter = 0;
    h2co3s.forEach(h2co3 => {
        let pos = h2co3.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !h2co3Used.includes(counter) && !h2os[i].reacting && !h2co3.reacting && h2os[i].box == h2co3.box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h2oUsed.push(index); //Add index to the list of used h2os
            h2co3Used.push(counter);
            h2os[index].combineH2CO3(h2co3);
        }
        counter++;
    });
    counter = 0;
    h2co3s.forEach(h2co3 => {
        let pos = h2co3.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1;
        for (let i = 0; i < ohs.length; i++) {
            if (!ohUsed.includes(i) && !h2co3Used.includes(counter) && !ohs[i].reacting && ! h2co3.reacting && ohs[i].box == h2co3.box) {
                let ohPos = ohs[i].getLocation();
                let dist = getDistance(pos, ohPos);
                if (minDist > dist){
                    minDist = dist;
                    index = i;
                }
            }
        }
        if (index >=0) {
            ohUsed.push(index);
            h2co3Used.push(counter);
            ohs[index].combineH2CO3(h2co3);
        }
        counter++;
    });
    counter = 0;
    hco3s.forEach(hco3 => { //Hco3s react with h3o
        let pos = hco3.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h3os.length; i++) {
            if (!hco3Used.includes(i) && !h3oUsed.includes(counter) && !hco3.reacting && !h3os[i].reacting && hco3.box == h3os[i].box) {
                let h3oPos = h3os[i].getLocation();
                let dist = getDistance(pos, h3oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h3os[index].combineHCO3(hco3);
            h3oUsed.push(index);
            hco3Used.push(counter);
        }
        counter++;
    });
    counter=0;
    hco3s.forEach(hco3 => {
        let pos = hco3.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!hco3Used.includes(counter) && !h2oUsed.includes(i) && !hco3.reacting && !h2os[i].reacting && hco3.box == h2os[i].box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h2os[index].combineHCO3(hco3);
            hco3Used.push(counter);
            h2oUsed.push(index);
        }
        counter++;
    });
    counter = 0;
    h3os.forEach(h3o => {
        let pos = h3o.getLocation();
        let minDist = minDistForReactionNotMoving;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < ohs.length; i++) {
            if (!h3oUsed.includes(counter) && !ohUsed.includes(i) && !h3o.reacting && !ohs[i].reacting && h3o.box == ohs[i].box) {
                let ohPos = ohs[i].getLocation();
                let dist = getDistance(pos, ohPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i;
                }
            }
        }
        if (index >=0) {
            ohs[index].combineH3O(h3o);
            ohUsed.push(index);
            h3oUsed.push(counter);
        }
        counter++;
    });
}

function myFunction() {
    let h2oUsed = [];
    let co2Used = [];
    let h2co3Used = [];
    let h3oUsed = [];
    let hco3Used = [];
    let ohUsed = [];

    let counter = 0;
    co2s.forEach(co2 => {
        /*co2.move();
        co2.draw();*/
        let pos = co2.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !co2Used.includes(counter) && !co2.reacting && !h2os[i].reacting && co2.box == h2os[i].box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h2os[index].combineCO2(co2);
            h2oUsed.push(index); //Add index to the list of used h2os
            co2Used.push(counter);
        }
        counter++;
    });
    counter = 0;
    h2co3s.forEach(h2co3 => {
        /*h2co3.move();
        h2co3.draw();*/
        let pos = h2co3.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !h2co3Used.includes(counter) && !h2os[i].reacting && !h2co3.reacting && h2os[i].box == h2co3.box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            //console.log("Combining water #"+index+" with h2co3");
            h2oUsed.push(index); //Add index to the list of used h2os
            h2co3Used.push(counter);
            h2os[index].combineH2CO3(h2co3);
        }
        counter++;
    });
    counter = 0;
    h2co3s.forEach(h2co3 => {
        /*h2co3.move();
        h2co3.draw();*/
        let pos = h2co3.getLocation();
        let minDist = minDistForReaction;
        let index = -1;
        for (let i = 0; i < ohs.length; i++) {
            if (!ohUsed.includes(i) && !h2co3Used.includes(counter) && !ohs[i].reacting && ! h2co3.reacting && ohs[i].box == h2co3.box) {
                let ohPos = ohs[i].getLocation();
                let dist = getDistance(pos, ohPos);
                if (minDist > dist){
                    minDist = dist;
                    index = i;
                }
            }
        }
        if (index >=0) {
            //console.log("Combining h2co3 with oh");
            ohUsed.push(index);
            h2co3Used.push(counter);
            ohs[index].combineH2CO3(h2co3);
        }
        counter++;
    });
    counter = 0;
    h2co3s.forEach(h2co3 => {
        let mynumber = getRandom(0, 500); //Get random number
        if (mynumber == 1 && !h2co3Used.includes(counter) && h2co3.moving == true) {
            h2co3Used.push(counter);
            h2co3.decompose();
        }
        counter++;
    });
    counter = 0;
    hco3s.forEach(hco3 => { //Hco3s react with h3o
        /*hco3.move();
        hco3.draw();*/
        let pos = hco3.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h3os.length; i++) {
            if (!hco3Used.includes(i) && !h3oUsed.includes(counter) && !hco3.reacting && !h3os[i].reacting && hco3.box == h3os[i].box) {
                let h3oPos = h3os[i].getLocation();
                let dist = getDistance(pos, h3oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h3os[index].combineHCO3(hco3);
            h3oUsed.push(index);
            hco3Used.push(counter);
        }
        counter++;
    });
    counter=0;
    hco3s.forEach(hco3 => {
        /*hco3.move();
        hco3.draw();*/
        let pos = hco3.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!hco3Used.includes(counter) && !h2oUsed.includes(i) && !hco3.reacting && !h2os[i].reacting && hco3.box == h2os[i].box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            h2os[index].combineHCO3(hco3);
            hco3Used.push(counter);
            h2oUsed.push(index);
        }
        counter++;
    });
    counter = 0;
    h3os.forEach(h3o => {
        /*h3o.move();
        h3o.draw();*/
        let pos = h3o.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < ohs.length; i++) {
            if (!h3oUsed.includes(counter) && !ohUsed.includes(i) && !h3o.reacting && !ohs[i].reacting && h3o.box == ohs[i].box) {
                let ohPos = ohs[i].getLocation();
                let dist = getDistance(pos, ohPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i;
                }
            }
        }
        if (index >=0) {
            ohs[index].combineH3O(h3o);
            ohUsed.push(index);
            h3oUsed.push(counter);
        }
        counter++;
    });
}

function moveMolecule(m, count, dx, dy) {
    if (m.moving) {
        //Move a lot faster
        m.x+=(minDistForReaction*2)*dx;
        m.y+=(minDistForReaction*2)*dy;
        m.draw();
    } else {
        if (count >= 0) {
            m.x+=dx;
            m.y+=dy;
            m.draw();
            animationId = requestAnimationFrame(()=> moveMolecule(m, count-1, dx, dy));
        }
    }
    
}

document.addEventListener("DOMContentLoaded", (event) => {
    addAll();
    animate();
});

document.getElementById("Cancel").addEventListener("click", () => {
    cancelAnimationFrame(animationId);
    cancelAnimationFrame(allAnimationId);
});

document.getElementById("startAnimation").addEventListener("click", () => {
    animate();
});

document.getElementById("reset").addEventListener("click", () => {
    h2os = [];
    co2s = [];
    h2co3s = [];
    h3os = [];
    hco3s = [];
    ohs = []; 
    addAll();
});

function animate() {
    myFunction();
    h2os.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    co2s.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    h2co3s.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    h3os.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    hco3s.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    ohs.forEach(molecule => {
        molecule.move();
        molecule.draw();
        molecule.cooldown++;
        if (molecule.cooldown >= cooldownLength) {
            molecule.cooldown = 0;
            molecule.reacting = false; //No longer reacting, can react again
            molecule.lastReactedWith=null;
        }
        
    });
    allAnimationId = requestAnimationFrame(() => animate());
}

/*document.getElementById("Debug").addEventListener("click", () => {
    console.log("Debug starts here");
    h2os.forEach(molecule => {
        console.log(molecule);
    });
    co2s.forEach(molecule => {
        console.log(molecule);
    });
    h2co3s.forEach(molecule => {
        console.log(molecule);
    });
    h3os.forEach(molecule => {
        console.log(molecule);
    });
    hco3s.forEach(molecule => {
        console.log(molecule);
    });
    ohs.forEach(molecule => {
        console.log(molecule);
    });
});*/

function getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function getRandom(a, b) {
    return Math.floor(Math.random()*(b-a+1)+a);
}

function getD(speed) {
    let value = getRandom(-speed, speed);
    while(value == 0) {
        value = getRandom(-speed, speed);
    }
    return value;
}

function addAll() {
    document.querySelectorAll(".js").forEach(element => { //Remove all the js created molecules
        element.remove();
    });
    document.querySelectorAll(".co2").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newCO2 = makeCO2(Number(location[0]), Number(location[1]), Number(location[2]), eval(location[3]), getD(4), getD(4), element);
        newCO2.forEach( tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
        
    });
    document.querySelectorAll(".h2o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH2O = makeH2O(Number(location[0]), Number(location[1]), Number(location[2]), eval(location[3]), getD(4), getD(4), element);
        newH2O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h2co3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH2CO3 = makeH2CO3(Number(location[0]), Number(location[1]), Number(location[2]), eval(location[3]), getD(2), getD(2), element);
        newH2CO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h3o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH3O = makeH3O(Number(location[0]), Number(location[1]), Number(location[2]), eval(location[3]), getD(3), getD(3), element);
        newH3O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
    document.querySelectorAll(".hco3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newHCO3 = makeHCO3(Number(location[0]), Number(location[1]), Number(location[2]), eval(location[3]), getD(3), getD(3), element);
        newHCO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
}

function makeH3O (x, y, box, moving, dx, dy, element) {
    const h1 = document.createElement("div");
    const h2 = document.createElement("div");
    const h3 = document.createElement("div");
    const o = document.createElement("div");
    h1.innerHTML = "H";
    h2.innerHTML = "H";
    h3.innerHTML = "H";
    o.innerHTML = "O";
    h1.classList.add("hydrogen", "circle", "js");
    h2.classList.add("hydrogen", "circle", "js");
    h3.classList.add("hydrogen", "circle", "js");
    o.classList.add("oxygen", "circle", "js");
    let molecule = new H3O(x, y, box, moving, dx, dy, h1, o, h2, h3, element);
    molecule.draw();
    molecule.makeDraggable([h1, o, h2, h3]);
    h3os.push(molecule);
    return [h1, o, h2, h3];
}

function makeH2O(x, y, box, moving, dx, dy, element) {
    const h1 = document.createElement("div");
    const h2 = document.createElement("div");
    const o = document.createElement("div");
    h1.innerHTML = "H";
    h2.innerHTML = "H";
    o.innerHTML = "O";
    h1.classList.add("hydrogen", "circle", "js");
    h2.classList.add("hydrogen", "circle", "js");
    o.classList.add("oxygen", "circle", "js");
    h1.style=`top:${y+25}px; left:${x-20}px;`;
    h2.style=`top:${y+25}px; left:${x+25}px;`;
    o.style=`top:${y}px; left:${x}px;`;
    let molecule = new H2O(x, y, box, moving, dx, dy, h1, o, h2, element);
    molecule.draw();
    molecule.makeDraggable([h1, o, h2]);
    h2os.push(molecule);
    return [h1, o, h2];
}

function makeCO2(x,y, box, moving, dx, dy, element) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o1.classList.add("oxygen", "circle", "js");
    o2.classList.add("oxygen", "circle", "js");
    c.classList.add("carbon", "circle", "js");
    let molecule = new CO2(x, y, box, moving, dx, dy, o1, c, o2, element);
    molecule.draw();
    molecule.makeDraggable([o1, c, o2]);
    co2s.push(molecule);
    return [o1, c, o2];
}

function makeH2CO3(x, y, box, moving, dx, dy, element) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    const o3 = document.createElement("div");
    const h1 = document.createElement("div");
    const h2 = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o3.innerHTML="O";
    h1.innerHTML="H";
    h2.innerHTML="H";
    o1.classList.add("oxygen", "circle", "js");
    o2.classList.add("oxygen", "circle", "js");
    c.classList.add("carbon", "circle", "js");
    o3.classList.add("oxygen", "circle", "js");
    h1.classList.add("hydrogen", "circle", "js");
    h2.classList.add("hydrogen", "circle", "js");
    let molecule = new H2CO3(x, y, box, moving, dx, dy, h1, o1, c, o2, o3, h2, element);
    molecule.draw();
    molecule.makeDraggable([h1, o1, c, o2, o3, h2]);
    h2co3s.push(molecule);
    return [h1, o1, c, o2, o3, h2];
}

function makeHCO3(x, y, box, moving, dx, dy, element) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    const o3 = document.createElement("div");
    const h1 = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o3.innerHTML="O";
    h1.innerHTML="H";
    o1.classList.add("oxygen", "circle", "js");
    o2.classList.add("oxygen", "circle", "js");
    c.classList.add("carbon", "circle", "js");
    o3.classList.add("oxygen", "circle", "js");
    h1.classList.add("hydrogen", "circle", "js");
    let molecule = new HCO3(x, y, box, moving, dx, dy, h1, o1, c, o2, o3, element);
    molecule.draw();
    molecule.makeDraggable([h1, o1, c, o2, o3]);
    hco3s.push(molecule);
    return [h1, o1, c, o2, o3];
}