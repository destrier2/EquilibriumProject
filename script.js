//Note: use backtick `` for embedding variables in a string

let h2os = [];
let co2s = [];
let h2co3s = [];
let h3os = [];
let hco3s = [];

let animationId;

class H3O {
    constructor(x, y, h1, o, h2, h3) {
        this.x=x;
        this.y=y;
        this.h1=h1;
        this.h2=h2;
        this.h3=h3;
        this.o=o;
    }
    getLocation() {
        return [this.x, this.y];
    }
    draw() {
        this.h1.style=`top:${this.y+25}px; left:${this.x-25}px;`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+30}px;`;
        this.h3.style=`top:${this.y-20}px; left:${this.x+5}px; z-index:-1;`
        this.o.style=`top:${this.y}px; left:${this.x}px;`;
    }

    combineHCO3(combineWith) { //combineWith is the hco3 element that it's supposed to combine with
        console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= 200) { //Close enough to collide
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
            console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
            this.x=current[0]+change[0];
            this.y=current[1]+change[1];
            this.draw();
            if (getDistance(this.getLocation(), center) > 10) {
                animationId = requestAnimationFrame(() => this.combineHCO3(combineWith));
            } else { //Start animation to move the oxygens and hydrogens
                h3os = h3os.filter(item => item != this);
                hco3s = hco3s.filter(item => item != combineWith);
                let moleculeTwo = new H2O(this.x, this.y, combineWith.h1, this.o, this.h2);
                moleculeTwo.draw();
                h2os.push(moleculeTwo);
                let molecule = new H2CO3(this.x, this.y, this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, this.h3, null);
                molecule.draw();
                h2co3s.push(molecule);
                animationId = requestAnimationFrame(()=> moleculeTwo.draw());
                
                animationId = requestAnimationFrame(() => moveMolecule(molecule,0));

                function moveMolecule(m, count) {
                    if (count < 80) {
                        count++;
                        m.x++;
                        m.y++;
                        m.draw();
                        animationId = requestAnimationFrame(()=> moveMolecule(m, count));
                    }
                }
            }
            
        }
    }
}

class HCO3 {
    constructor(x, y, h1, o1, c, o2, o3, html) {
        this.x = x;
        this.y = y;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.html = html;
    }

    getLocation() {
        return [this.x, this.y];
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px;`;
        this.c.style=`top:${this.y}px; left:${this.x}px;`;
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px; z-index:-1;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px;`
    }
}

class CO2 {
    constructor(x, y, o1, c, o2, html) {
        this.x = x;
        this.y = y;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.html = html;
    }

    getLocation() {
        return [this.x, this.y];
    }

    draw() {
        this.o1.style=`top:${this.y+30}px; left:${this.x-25}px;`;
        this.o2.style=`top:${this.y+30}px; left:${this.x+45}px;`;
        this.c.style=`top:${this.y}px; left:${this.x}px;`;
    }
}

class H2CO3 {
    constructor(x, y, h1, o1, c, o2, o3, h2, html) {
        this.x = x;
        this.y = y;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
        this.o3 = o3;
        this.h1 = h1;
        this.h2 = h2;
        this.html = html;
    }

    getLocation() {
        return [this.x, this.y];
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

class H2O {
    constructor(x, y, h1, o, h2, html) {
        this.x = x;
        this.y = y;
        this.h1 = h1;
        this.o = o;
        this.h2 = h2;
        this.html = html;
    }

    combineCO2(combineWith) { //combineWith is the co2 element that it's supposed to combine with
        console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= 200) { //Close enough to collide
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
            console.log(`New location ${current[0]+change[0]} ${current[1]+change[1]}`);
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
                let molecule = new H2CO3(this.x, this.y, this.h1, combineWith.o1, combineWith.c, combineWith.o2, this.o, this.h2, null);
                molecule.draw();
                h2co3s.push(molecule);
            }
            
        }
    }

    combineH2CO3(combineWith) { //Where combineWith is the H2CO3 element
        //This will create a new H3O+ and HCO3-
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= 200) { //Close enough to collide
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
                let moleculeTwo = new H3O(this.x, this.y, combineWith.h1, this.o, this.h2, combineWith.h2);
                moleculeTwo.draw();
                h3os.push(moleculeTwo);
                let molecule = new HCO3(this.x, this.y, this.h1, combineWith.o1, combineWith.c, combineWith.o2, combineWith.o3, null);
                molecule.draw();
                hco3s.push(molecule);
                animationId = requestAnimationFrame(()=> moleculeTwo.draw());
                
                animationId = requestAnimationFrame(() => moveMolecule(molecule,0));

                function moveMolecule(m, count) {
                    if (count < 80) {
                        count++;
                        m.x++;
                        m.y++;
                        m.draw();
                        animationId = requestAnimationFrame(()=> moveMolecule(m, count));
                    }
                }
            }
        }
    }

    split(combineWith) {
        let change = [-15/20.0, -70/20.0, -10/20.0, 75/20.0, -60/20.0, 30/20.0];
        let location = [25, 25, 0, 0, 25, -20];
        console.log(change);
        //20 iterations
        for (let i = 0 ; i < 20; i++) {
            for (let x=0; x<6; x++) {
                location[x]+=change[x];
            }
            console.log(location);
            this.drawTwo(location[0],location[1],location[2],location[3], location[4], location[5]);
            animationId = requestAnimationFrame(() => this.drawTwo(location[0], location[1],location[2], location[3], location[4], location[5]));
        }
    }

    drawTwo(a, b, c, d, e, f) {
        console.log("Hello world");
        this.h1.style=`top:${this.y+a}px; left:${this.x+b}px;`;
        this.h2.style=`top:${this.y+c}px; left:${this.x+d}px;`;
        this.o.style=`top:${this.y+e}px; left:${this.x+f}px;`;
        //console.log(`Hello world ${this.y+a} left:${this.x+b} top:${this.y+c}px; left:${this.x+d}px top:${this.y+e} left:${this.x+f}`);
    }

    draw() {
        this.h1.style=`top:${this.y+25}px; left:${this.x-20}px;`;
        this.h2.style=`top:${this.y+25}px; left:${this.x+25}px;`;
        this.o.style=`top:${this.y}px; left:${this.x}px;`;
    }

    getLocation() {
        return [this.x, this.y];
    }
}

document.getElementById("test").addEventListener("click", myFunction);

function myFunction() {
    co2s.forEach(co2 => {
        let pos = co2.getLocation();
        let minDist = Infinity;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            let h2oPos = h2os[i].getLocation();
            let dist = getDistance(pos, h2oPos);
            if (minDist > dist) {
                minDist = dist; //Set new distance
                index = i; //Set the new index
            }
        }
        if (index >=0) {
            h2os[index].combineCO2(co2);
        }
    });

    h2co3s.forEach(h2co3 => {
        let pos = h2co3.getLocation();
        let minDist = Infinity;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h2os.length; i++) {
            let h2oPos = h2os[i].getLocation();
            let dist = getDistance(pos, h2oPos);
            if (minDist > dist) {
                minDist = dist; //Set new distance
                index = i; //Set the new index
            }
        }
        if (index >=0) {
            h2os[index].combineH2CO3(h2co3);
        }
    });

    hco3s.forEach(hco3 => {
        let pos = hco3.getLocation();
        let minDist = Infinity;
        let index = -1; //Negative for none close enough
        for (let i = 0; i < h3os.length; i++) {
            let h3oPos = h3os[i].getLocation();
            let dist = getDistance(pos, h3oPos);
            if (minDist > dist) {
                minDist = dist; //Set new distance
                index = i; //Set the new index
            }
        }
        if (index >=0) {
            h3os[index].combineHCO3(hco3);
        }
    });
}

document.addEventListener("DOMContentLoaded", (event) => {
    addAll();
});

document.getElementById("Cancel").addEventListener("click", () => {
    cancelAnimationFrame(animationId);
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
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newCO2 = makeCO2(Number(location[0]), Number(location[1]), element);
        newCO2.forEach( tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
            //console.log(`Added ${tempelement}`);
        });
        
    });
    document.querySelectorAll(".h2o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newH2O = makeH2O(Number(location[0]), Number(location[1]), element);
        newH2O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h2co3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newH2CO3 = makeH2CO3(Number(location[0]), Number(location[1]), element);
        newH2CO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
    document.querySelectorAll(".h3o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newH3O = makeH3O(Number(location[0]), Number(location[1]), element);
        newH3O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
    document.querySelectorAll(".hco3").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newHCO3 = makeHCO3(Number(location[0]), Number(location[1]), element);
        newHCO3.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    })
}

function makeH3O (x, y, element) {
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
    let molecule = new H3O(x, y, h1, o, h2, h3, element);
    molecule.draw();
    h3os.push(molecule);
    return [h1, o, h2, h3];
}

function makeH2O(x, y, element) {
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
    let molecule = new H2O(x, y, h1, o, h2, element);
    molecule.draw();
    h2os.push(molecule);
    return [h1, o, h2];
}

function makeCO2(x,y, element) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o1.classList.add("oxygen", "circle", "js");
    o2.classList.add("oxygen", "circle", "js");
    c.classList.add("carbon", "circle", "js");
    let molecule = new CO2(x, y, o1, c, o2, element);
    molecule.draw();
    co2s.push(molecule);
    return [o1, c, o2];
}

function makeH2CO3(x, y, element) {
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
    let molecule = new H2CO3(x, y, h1, o1, c, o2, o3, h2, element);
    molecule.draw();
    h2co3s.push(molecule);
    return [h1, o1, c, o2, o3, h2];
}

function makeHCO3(x, y, element) {
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
    let molecule = new H2CO3(x, y, h1, o1, c, o2, o3, element);
    molecule.draw();
    hco3s.push(molecule);
    return [h1, o1, c, o2, o3];
}