'use strict'

class Actor {
  constructor(name, floor, destination) {
    this.name = name;
    this.floor = floor;
    this.destination = destination;

  }

  call(elevator) {
    console.log(`Actor at ${this.floor} is calling elevator to go ${this.destination}.`);
    if (elevator.call(this.floor, this.destination)) {
      // Elevator is called
      // Actor gets in elevator
      // elevator.board(this, direction);
    }
  }

  engage(elevator) {
    let direction = (this.destination > this.floor) ? 'UP' : 'DOWN';
    elevator.call(this.floor, this.destination, true);
    // elevator.move(this.destination);
  }

  display() {
    console.log(`Actor currently at ${this.floor}.`);
  }
}

class Elevator {
  constructor(floor) {
    this.floor = floor;
    this.passengers = [];
    this.requests = [];
    this.process = [];
    this.direction;
  }

  call(requestedFloor, requestedDest, priority) {
    console.log({ requestedFloor, requestedDest, priority })

    if (requestedFloor == this.floor) {
      console.log("Elevator already on this floor!");
      return false;
    }

    if (priority == undefined) {
      priority = false;
    }

    let directionTo = (requestedDest > requestedFloor) ? 'UP' : 'DOWN';
    console.log(`Elevator requested to move ${directionTo} to ${requestedFloor}. Elevator currently at ${this.floor}.`);

    this.requests.push({floor: requestedFloor, destination: requestedDest, priority});

    console.log(`Current requests queue: ${JSON.stringify(this.requests)}.`);

    return true;
  }

  board(actor, direction) {
    this.passengers.push({actor, direction})
  }

  display() {
    console.log("---ELEVATOR-INFO---");
    console.log(`Elevator passengers: ${JSON.stringify(this.passengers)}.`);
    console.log(`Elevator floor: ${this.floor}.`);
    console.log(`Elevator requests: ${JSON.stringify(this.requests)}.`);
    console.log(`Elevator direction: ${this.direction}.`);
    console.log("---/ELEVATOR-INFO---");
  }

  move() {
    let priorityLevel = this.requests.findIndex((r) => {
      return r.priority;
    });

    let next;
    if (priorityLevel !== -1) {
      // next = this.requests[priorityLevel];
      //
      // // TODO: Established direction and piority level (level user has pressed inside elevator)
      // // so now we need to figure out if there is anybody on the way we can pick up.
      // // Variable `next` contains the priorities level
      //
      // console.log(this.floor, "going to", next.floor, "in direction", next.direction);
      // console.log(this.requests.filter((req) => {
      //   // assume up
      //   return !req.priority && (req.direction == next.direction);
      // }));
      //
      // this.requests.splice(priorityLevel, 1);
    } else if (this.direction == undefined) {
      // No direction set so just get the first request
      next = this.requests.shift();

      // Should I stop anywhere before the next?
      let originalDirUp = (next.destination > next.floor);
      // Does this pass current floor (this.floor)
      let sameDirection = this.requests.filter((r) => {
        let otherDirUp = (r.destination > r.floor);

        if (originalDirUp == otherDirUp) {
          return (originalDirUp && (r.floor >= next.floor)) || (!originalDirUp && (r.floor <= next.floor))
        }

        return false;
      });

      let unsorted = [next].concat(sameDirection);

      let sorted = unsorted.sort((a, b) => {
        return (originalDirUp) ? a.floor - b.floor : b.floor - a.floor;
      });

      this.process = sorted;



    // } else {
    //   // Pre-existing direction
    //   let sameDir = this.requests.findIndex((r) => {
    //     return r.direction == this.direction;
    //   });
    //
    //   if (sameDir !== -1) {
    //     next = this.requests[sameDir];
    //     this.requests.splice(sameDir, 1);
    //   } else {
    //     // No previous direction so just get next floor
    //     next = this.requests.shift();
    //   }
    }

    this.direction = (next.floor > this.floor) ? 'UP' : 'DOWN';

    console.log(`Elevator moving from ${this.floor} to ${JSON.stringify(this.process.map((p) => { return p.floor }))} in direction ${this.direction}.`);

    // Get rid of requests that are being processed
    this.requests = this.requests.filter((r) => {
      return this.process.indexOf(r) == -1;
    });

    while (this.process.length > 0) {
      next = this.process.shift();
      this.floor = next.floor;
      console.log(`Elevator at ${this.floor} *DING*.`);
    }


  }
}

let actorJames = new Actor("James", 3, 5); // Going from 3 to 5
let actorJamie = new Actor("Jamie", 4, 5);
let actorJimmy = new Actor("Jimmy", 2, 1);
let actorShemus = new Actor("Shemus", 6, 11);
let elevator = new Elevator(0);

// Here actor is requesting elevator to level 3 going up
actorJames.call(elevator);
// Here actor is requesting elevator to level 4 going down
actorJamie.call(elevator);
// Here actor is requesting elevator to level 2 going up
actorJimmy.call(elevator);
// // Here actor is requesting elevator to level 1 going down
actorShemus.call(elevator);
//
// console.log("---");
elevator.display();
elevator.move();

elevator.display();
elevator.move();

// actorJames will be first in elevator and will press 5
// actorJames.engage(elevator);
// console.log("---");
// elevator.move();



