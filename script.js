//Note: use backtick `` for embedding variables in a string

let h2os = [];
let co2s = [];
let h2co3s = [];

let animationId;

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
        this.o3.style=`top:${this.y-35}px; left:${this.x+10}px;`
        this.h1.style=`top:${this.y+10}px; left:${this.x-45}px;`
        this.h2.style=`top:${this.y+10}px; left:${this.x+75}px;`
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

    combine(combineWith) { //combineWith is the co2 element that it's supposed to combine with
        console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= 100) { //Close enough to collide
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            //Just modify the values in the html divs, then re-render the items

            /*o1.style=`top:${y+30}px; left:${x-25}px;`;
            o2.style=`top:${y+30}px; left:${x+45}px;`;
            c.style=`top:${y}px; left:${x}px;`;
            o3.style=`top:${y-35}px; left:${x+10}px;`
            h1.style=`top:${y+10}px; left:${x-45}px;`
            h2.style=`top:${y+10}px; left:${x+75}px;`*/
            const center = combineWith.getLocation();
            const current = this.getLocation();
            let change = [0, 0];
            //while (getDistance(this.getLocation(), center) > 10 && counter < 5000) {
            //requestAnimationFrame(myfunctionhere);
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
                animationId = requestAnimationFrame(() => this.combine(combineWith));
            } else {
                cancelAnimationFrame(animationId);
            }
            
        }
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
            h2os[index].combine(co2);
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