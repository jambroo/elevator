'use strict'

class Actor {
  constructor(name, floor, destination) {
    this.name = name;
    this.floor = floor;
    this.destination = destination;

  }

  call(elevator) {
    console.log(`Actor at ${this.floor} is calling elevator to go ${this.destination}.`);

    return elevator.call(this.floor, this.destination);
  }
}

class Elevator {
  constructor(floor) {
    this.floor = floor;
    this.passengers = [];
    this.requests = [];
    this.process = [];
  }

  call(requestedFloor, requestedDest) {
    if (requestedFloor == this.floor) {
      console.log("Elevator already on this floor!");
      return false;
    }

    let directionTo = (requestedDest > requestedFloor) ? 'UP' : 'DOWN';
    console.log(`Elevator requested to move ${directionTo} to ${requestedFloor}. Elevator currently at ${this.floor}.`);

    this.requests.push({floor: requestedFloor, destination: requestedDest});

    console.log(`Current requests queue: ${JSON.stringify(this.requests)}.`);

    return true;
  }

  display() {
    console.log("---ELEVATOR-STATE-INFO---");
    console.log(`Elevator passengers: ${JSON.stringify(this.passengers)}.`);
    console.log(`Elevator floor: ${this.floor}.`);
    console.log(`Elevator requests: ${JSON.stringify(this.requests)}.`);
    console.log("---/ELEVATOR-STATE-INFO---");
  }

  move() {
    // Get first request
    let next = this.requests.shift();

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

    let direction = (next.floor > this.floor) ? 'UP' : 'DOWN';

    console.log("---ELEVATOR-MOVE-INFO---");
    console.log(`Elevator moving from ${this.floor} to ${JSON.stringify(this.process.map((p) => { return p.floor }))} in direction ${direction}.`);

    // Get rid of requests that are being processed
    this.requests = this.requests.filter((r) => {
      return this.process.indexOf(r) == -1;
    });

    while (this.process.length > 0) {
      next = this.process.shift();
      this.floor = next.floor;
      console.log(`Elevator at ${this.floor} *DING*.`);
    }
    console.log("---/ELEVATOR-MOVE-INFO---");
  }
}

let actorJames = new Actor("James", 3, 5);
let actorJamie = new Actor("Jamie", 4, 5);
let actorJimmy = new Actor("Jimmy", 2, 1);
let actorShemus = new Actor("Shemus", 6, 11);

let elevator = new Elevator(0);

// Here actor is requesting elevator from level 3 going up to 5
actorJames.call(elevator);
// Here actor is requesting elevator from level 4 going up to 5
actorJamie.call(elevator);
// Here actor is requesting elevator from level 2 going down to 1
actorJimmy.call(elevator);
// Here actor is requesting elevator from level 6 going up to 11
actorShemus.call(elevator);

elevator.display();
elevator.move();

elevator.display();
elevator.move();

elevator.display();
