'use strict'

class Actor {
  constructor(name, floor) {
    this.name = name;
    this.floor = floor;
  }

  call(elevator) {
    console.log(`Actor at ${this.floor} is calling elevator.`);
    if (elevator.call(this.floor)) {
      // Elevator is called
      // Actor gets in elevator
      elevator.board(this);
    }
  }

  goTo(floor, elevator) {
    console.log(`Actor in elevator has requested floor ${floor}.`);
    elevator.call(floor)
  }

  display() {
    console.log(`Actor currently at ${this.floor}.`);
  }
}

class Elevator {
  constructor(floor) {
    this.floor = floor;
    this.passengers = [];
  }

  call(requestedFloor) {
    if (requestedFloor == this.floor) {
      console.log("Elevator already on this floor!");
      return false;
    }

    let direction = (requestedFloor > this.floor) ? 'UP' : 'DOWN';
    console.log(`Elevator requested to move ${direction} to ${requestedFloor} from ${this.floor}.`);
    this.floor = requestedFloor;

    return true;
  }

  board(actor) {
    this.passengers.push(actor)
  }

  display() {
    console.log(`Elevator passengers: ${JSON.stringify(this.passengers)}.`);
    console.log(`Elevator floor: ${this.floor}.`);
  }
}

let actor = new Actor("James", 0);
let elevator = new Elevator(3);

// Here actor is requesting elevator from level 3 to level 0 and is boarding
actor.call(elevator);
actor.display();
elevator.display();

actor.goTo(5, elevator);
actor.display();
elevator.display();



