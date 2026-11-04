//Note: use backtick `` for embedding variables in a string

let h2os = [];
let co2s = [];
let h2co3s = [];
let h3os = [];
let hco3s = [];
let ohs = [];

let animationId;
const minDistForReaction = 200; //200 pixels

class Molecule {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.dragging = false;

        this.offsetX = 0;
        this.offsetY = 0;

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

    /*toString() {
        let toreturn= this.constructor.name()+ " at "+this.x+", "+this.y;
        this.elements.forEach(element => {
            toreturn+=element;
        })
        return toreturn;
    }*/

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
            this.y = event.clientY - this.offsetY;

            this.draw();
        }
    }
}

class OH extends Molecule {
    constructor(x, y, box, h, o) {
        super();
        this.x=x;
        this.y=y;
        this.box=box;
        this.h=h;
        this.o=o;
    }

    draw() {
        this.h.style=`top:${this.y+25}px; left:${this.x-20}px;`;
        this.o.style=`top:${this.y}px; left:${this.x}px;`;
    }

    combineH3O(combineWith) {
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= minDistForReaction) { //Close enough to collide
            //Start the collision animation
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -1;
            } else if (current[0] < center[0]) {
                change[0]=1;
            }
            if (current[1] > center[1]) {
                change[1] = -1;
            } else if (current[1] < center[1]) {
                change[1] = 1;
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
                let molecule = new H2O(this.x, this.y, this.box, this.h, this.o, combineWith.h3);
                molecule.draw();
                molecule.makeDraggable([this.h, this.o, combineWith.h3]);
                h2os.push(molecule);
                let moleculeTwo = new H2O(this.x, this.y, this.box, combineWith.h1, combineWith.o, combineWith.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, combineWith.o, combineWith.h2]);
                h2os.push(moleculeTwo);
            }
            
        }
    }

    combineH2CO3(combineWith) {

    }
}

class H3O extends Molecule{
    constructor(x, y, box, h1, o, h2, h3) {
        super();
        this.x=x;
        this.y=y;
        this.box=box;
        this.h1=h1;
        this.h2=h2;
        this.h3=h3;
        this.o=o;
    }
    draw() {
        this.h1.style=`top:${this.y+25}px; left:${this.x-25}px; z-index:1;`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+30}px; z-index:-1`;
        this.h3.style=`top:${this.y-20}px; left:${this.x+5}px; z-index:-1;`
        this.o.style=`top:${this.y}px; left:${this.x}px;`;
    }

    combineHCO3(combineWith) { //combineWith is the hco3 element that it's supposed to combine with
        //console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= minDistForReaction) { //Close enough to collide
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -1;
            } else if (current[0] < center[0]) {
                change[0]=1;
            }
            if (current[1] > center[1]) {
                change[1] = -1;
            } else if (current[1] < center[1]) {
                change[1] = 1;
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
                let moleculeTwo = new H2O(this.x, this.y, this.box, combineWith.h1, this.o, this.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, this.o, this.h2]);
                h2os.push(moleculeTwo);
                let molecule = new H2CO3(this.x, this.y, this.box, this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h3, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h3]);
                h2co3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 100, +1,0));
            }
            
        }
    }
}

class HCO3 extends Molecule{
    constructor(x, y, box, h1, o1, c, o2, o3, html) {
        super();
        this.x = x;
        this.y = y;
        this.box = box;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.html = html;
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px;`;
        this.c.style=`top:${this.y}px; left:${this.x}px;`;
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px; z-index:-1;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px;`
    }
}

class CO2 extends Molecule{
    constructor(x, y, box, o1, c, o2, html) {
        super();
        this.x = x;
        this.y = y;
        this.box = box;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.html = html;
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px;`;
        this.c.style=`top:${this.y}px; left:${this.x}px;`;
    }
}

class H2CO3 extends Molecule{
    constructor(x, y, box, h1, o1, c, o2, o3, h2, html) {
        super();
        this.x = x;
        this.y = y;
        this.box = box;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.h2 = h2;
        this.html = html;
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px;`;
        this.c.style=`top:${this.y}px; left:${this.x}px;`;
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px; z-index:-1;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px;`
        this.h2.style=`top:${this.y+10}px; left:${this.x+75}px; z-index:-1;`
    }
}

class H2O extends Molecule{
    constructor(x, y, box, h1, o, h2, html) {
        super();
        this.x = x;
        this.y = y;
        this.box = box;
        this.h1 = h1;
        this.o = o;
        this.h2 = h2;
        this.html = html;
    }

    combineCO2(combineWith) { //combineWith is the co2 element that it's supposed to combine with
        //console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= minDistForReaction) { //Close enough to collide
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -1;
            } else if (current[0] < center[0]) {
                change[0]=1;
            }
            if (current[1] > center[1]) {
                change[1] = -1;
            } else if (current[1] < center[1]) {
                change[1] = 1;
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
                let molecule = new H2CO3(this.x, this.y, this.box, this.h1, combineWith.o1, combineWith.c, combineWith.o2, this.o, this.h2, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, this.o, this.h2]);
                h2co3s.push(molecule);
            }
            
        }
    }

    combineH2CO3(combineWith) { //Where combineWith is the H2CO3 element
        //This will create a new H3O+ and HCO3-
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= minDistForReaction) { //Close enough to collide
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -1;
            } else if (current[0] < center[0]) {
                change[0]=1;
            }
            if (current[1] > center[1]) {
                change[1] = -1;
            } else if (current[1] < center[1]) {
                change[1] = 1;
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
                let moleculeTwo = new H3O(this.x, this.y, this.box, combineWith.h1, this.o, this.h2, combineWith.h2);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, this.o, this.h2, combineWith.h2]);
                h3os.push(moleculeTwo);
                let molecule = new HCO3(this.x, this.y,this.box, this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3]);
                hco3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo, 120, 1, 0));
            }
        }
    }

    combineHCO3(combineWith) { //Where combineWith is the HCO3 element
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= minDistForReaction) { //Close enough to collide
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            if (current[0] > center[0]) {
                change[0] = -1;
            } else if (current[0] < center[0]) {
                change[0]=1;
            }
            if (current[1] > center[1]) {
                change[1] = -1;
            } else if (current[1] < center[1]) {
                change[1] = 1;
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
                let moleculeTwo = new OH(this.x, this.y, this.box, combineWith.h1, this.o);
                moleculeTwo.draw();
                moleculeTwo.makeDraggable([combineWith.h1, this.o]);
                ohs.push(moleculeTwo);
                let molecule = new H2CO3(this.x, this.y, this.box, this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h2, null);
                molecule.draw();
                molecule.makeDraggable([this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h2]);
                h2co3s.push(molecule);
                animationId = requestAnimationFrame(()=> molecule.draw());
                animationId = requestAnimationFrame(() => moveMolecule(moleculeTwo,150,1,0));
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
        this.h1.style=`top:${this.y+25}px; left:${this.x-20}px;`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+25}px; z-index:-1;`;
        this.o.style=`top:${this.y}px; left:${this.x}px;`;
    }
}

document.getElementById("test").addEventListener("click", myFunction);

function clearAll() {
    h2os = [];
    co2s = [];
    h2co3s = [];
    h3os = [];
    hco3s = [];
    ohs = [];
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
        let pos = co2.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !co2Used.includes(counter) && co2.box == h2os[i].box) {
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
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!h2oUsed.includes(i) && !h2co3Used.includes(counter) && h2os[i].box == h2co3.box) {
                let h2oPos = h2os[i].getLocation();
                let dist = getDistance(pos, h2oPos);
                if (minDist > dist) {
                    minDist = dist; //Set new distance
                    index = i; //Set the new index
                }
            }
        }
        if (index >=0) {
            console.log("Combining water #"+index+" with h2co3");
            h2oUsed.push(index); //Add index to the list of used h2os
            h2co3Used.push(counter);
            h2os[index].combineH2CO3(h2co3);
        }
        counter++;
    });
    counter = 0;
    hco3s.forEach(hco3 => { //Hco3s react with h3o
        let pos = hco3.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h3os.length; i++) {
            if (!hco3Used.includes(i) && !h3oUsed.includes(counter) && hco3.box == h3os[i].box) {
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
            console.log("Index is "+index);
        }
        counter++;
    });
    counter=0;
    hco3s.forEach(hco3 => {
        let pos = hco3.getLocation();
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            if (!hco3Used.includes(counter) && !h2oUsed.includes(i) && hco3.box == h2os[i].box) {
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
        let minDist = minDistForReaction;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < ohs.length; i++) {
            if (!h3oUsed.includes(counter) && !ohUsed.includes(i) && h3o.box == ohs[i].box) {
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
    if (count >= 0) {
        m.x+=dx;
        m.y+=dy;
        m.draw();
        animationId = requestAnimationFrame(()=> moveMolecule(m, count-1, dx, dy));
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    addAll();
});

document.getElementById("Cancel").addEventListener("click", () => {
    cancelAnimationFrame(animationId);
});

document.getElementById("Debug").addEventListener("click", () => {
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
    })
});

function getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt((x1-x2)**2+(y1-y2)**2);
}

function addAll() {
    document.querySelectorAll(".js").forEach(element => { //Remove all the previous images
        element.remove();
    });
    document.querySelectorAll(".co2").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newCO2 = makeCO2(Number(location[0]), Number(location[1]), Number(location[2]), element);
        newCO2.forEach( tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
            //console.log(`Added ${tempelement}`);
        });
        
    });
    document.querySelectorAll(".h2o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH2O = makeH2O(Number(location[0]), Number(location[1]), Number(location[2]), element);
        newH2O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h2co3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH2CO3 = makeH2CO3(Number(location[0]), Number(location[1]), Number(location[2]), element);
        newH2CO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h3o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newH3O = makeH3O(Number(location[0]), Number(location[1]), Number(location[2]), element);
        newH3O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
    document.querySelectorAll(".hco3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        location[0] = eval(location[0]);
        console.log(`x is ${location[0]}, y is ${location[1]}, box is ${location[2]}`);
        newHCO3 = makeHCO3(Number(location[0]), Number(location[1]), Number(location[2]),element);
        newHCO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
}

function makeH3O (x, y, box, element) {
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
    let molecule = new H3O(x, y, box, h1, o, h2, h3, element);
    molecule.draw();
    molecule.makeDraggable([h1, o, h2, h3]);
    h3os.push(molecule);
    return [h1, o, h2, h3];
}

function makeH2O(x, y, box, element) {
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
    let molecule = new H2O(x, y, box, h1, o, h2, element);
    molecule.draw();
    molecule.makeDraggable([h1, o, h2]);
    h2os.push(molecule);
    return [h1, o, h2];
}

function makeCO2(x,y, box, element) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o1.classList.add("oxygen", "circle", "js");
    o2.classList.add("oxygen", "circle", "js");
    c.classList.add("carbon", "circle", "js");
    let molecule = new CO2(x, y, box, o1, c, o2, element);
    molecule.draw();
    molecule.makeDraggable([o1, c, o2]);
    co2s.push(molecule);
    return [o1, c, o2];
}

function makeH2CO3(x, y, box, element) {
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
    let molecule = new H2CO3(x, y, box, h1, o1, c, o2, o3, h2, element);
    molecule.draw();
    molecule.makeDraggable([h1, o1, c, o2, o3, h2]);
    h2co3s.push(molecule);
    return [h1, o1, c, o2, o3, h2];
}

function makeHCO3(x, y, box, element) {
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
    let molecule = new HCO3(x, y, box, h1, o1, c, o2, o3, element);
    molecule.draw();
    molecule.makeDraggable([h1, o1, c, o2, o3]);
    hco3s.push(molecule);
    return [h1, o1, c, o2, o3];
}