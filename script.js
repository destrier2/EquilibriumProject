//Note: use backtick `` for embedding variables in a string

let h2os = [];
let co2s = [];

class CO2 {
    constructor(x, y, o1, c, o2) {
        this.x = x;
        this.y = y;
        this.o1 = o1;
        this.c = c;
        this.o2 = o2;
    }

    getLocation() {
        return [this.x, this.y];
    }
}

class H2O {
    constructor(x, y, h1, o, h2) {
        this.x = x;
        this.y = y;
        this.h1 = h1;
        this.o = o;
        this.h2 = h2;
    }

    combine(combineWith) { //combineWith is the co2 element that it's supposed to combine with
        console.log(`Combining ${this.getLocation()} with ${combineWith.getLocation()}`)
        let dist = getDistance(this.getLocation(), combineWith.getLocation());
        if (dist <= 100) { //Close enough to collide
            //Start the collision animation
            //Calculate the final values, then move each element a few pixels that way?
            //Just modify the values in the html divs, then re-render the items
        }
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

function getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt((x1-x2)**2+(y1-y2));
}

function addAll() {
    document.querySelectorAll(".co2").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newCO2 = makeCO2(Number(location[0]), Number(location[1]));
        newCO2.forEach( tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
            //console.log(`Added ${tempelement}`);
        });
        
    });
    document.querySelectorAll(".h2o").forEach(element => {
        const location = element.innerHTML.split(/\s+/);
        console.log(`x is ${location[0]}, y is ${location[1]}`);
        newH2O = makeH2O(Number(location[0]), Number(location[1]));
        newH2O.forEach(tempelement => {
            element.insertAdjacentElement('afterend', tempelement);
        });
    });
}


function makeH2O(x, y) {
    const h1 = document.createElement("div");
    const h2 = document.createElement("div");
    const o = document.createElement("div");
    h1.innerHTML = "H";
    h2.innerHTML = "H";
    o.innerHTML = "O";
    h1.classList.add("hydrogen", "circle");
    h2.classList.add("hydrogen", "circle");
    o.classList.add("oxygen", "circle");
    h1.style=`top:${x+25}px; left:${y-20}px;`;
    h2.style=`top:${x+25}px; left:${y+25}px;`;
    o.style=`top:${x}px; left:${y}px;`;
    h2os.push(new H2O(x, y, h1, o, h2));
    return [h1, o, h2];
}

function makeCO2(x,y) {
    const o1 = document.createElement("div");
    const o2 = document.createElement("div");
    const c = document.createElement("div");
    o1.innerHTML = "O";
    o2.innerHTML = "O";
    c.innerHTML = "C";
    o1.style=`top:${y+30}px; left:${x-25}px;`;
    o2.style=`top:${y+30}px; left:${x+45}px;`;
    c.style=`top:${x}px; left:${y}px;`;
    o1.classList.add("oxygen", "circle");
    o2.classList.add("oxygen", "circle");
    c.classList.add("carbon", "circle");
    co2s.push(new CO2(x, y, o1, c, o2));
    return [o1, c, o2];
}