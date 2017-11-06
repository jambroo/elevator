'use strict'

class User {
  constructor(name, floor, destination) {
    this.name = name;
    this.floor = floor;
    this.destination = destination;

  }

  call(elevator) {
    console.log(`User at ${this.floor} is calling elevator to go ${this.destination}.`);

    return elevator.call(this);
  }

  setFloor(floor) {
    this.floor = floor;
    this.destination = undefined;
  }

  getName() {
    return this.name;
  }

  board(elevator) {
    this.floor = elevator.floor;
    console.log(`User ${this.name} getting on elevator at ${this.floor}. Pressed button ${this.destination}.`);
  }

  disembark(elevator) {
    this.floor = elevator.floor;
    console.log(`User ${this.name} getting off elevator at floor ${this.floor}.`);
  }

  display() {
    console.log("---PERSON-STATE-INFO---");
    console.log(`Person name: ${this.getName()}.`);
    console.log(`Person floor: ${this.floor}.`);
    console.log(`Person destination: ${this.destination}.`);
    console.log("---/PERSON-STATE-INFO---");
  }
}

class Elevator {
  constructor(floor) {
    this.floor = floor;
    this.passengers = [];
    this.requests = [];
    this.process = [];
  }

  call(user) {
    if (user.floor == this.floor) {
      console.log("Elevator already on this floor!");
      return false;
    }

    let directionTo = (user.destination > user.floor) ? 'UP' : 'DOWN';
    console.log(`Elevator requested to move ${directionTo} to ${user.floor}. Elevator currently at ${this.floor}.`);

    this.requests.push({floor: user.floor, destination: user.destination, user});

    let requests = this.requests.map(r => {
      return `${r.user.name}:${r.floor}-${r.destination}`
    });
    console.log(`Current requests queue: ${requests.join(",")}.`);

    return true;
  }

  display() {
    console.log("---ELEVATOR-STATE-INFO---");
    console.log(`Elevator passengers: ${JSON.stringify(this.passengers)}.`);
    console.log(`Elevator floor: ${this.floor}.`);
    let requests = this.requests.map(r => {
      return `${r.user.name}:${r.floor}-${r.destination}`
    });
    console.log(`Elevator requests: ${requests.join(",")}.`);
    console.log("---/ELEVATOR-STATE-INFO---");
  }

  move() {
    // Get first request
    let next = this.requests.shift();

    // Should I stop anywhere before the next?
    // This is concerned with pickups
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

    let pickups = unsorted.map(entry => {
      entry.pickup = true;
      return entry;
    });

    let dropoffs = pickups.map(entry => {
      let pickups_cloned = { ... entry };
      pickups_cloned.pickup = false;
      return pickups_cloned;
    })

    // Combine pickup and dropoff dictionaries
    this.process = pickups.concat(dropoffs).sort((a, b) => {
      let floor = (a.pickup) ? a.floor : a.destination;
      let floor2 = (b.pickup) ? b.floor : b.destination;

      return (originalDirUp) ? floor - floor2 : floor2 - floor;
    });

    let direction = (next.floor > this.floor) ? 'UP' : 'DOWN';

    console.log("---ELEVATOR-MOVE-INFO---");
    console.log(`Elevator moving from ${this.floor} to ${pickups.map((p) => { return p.floor+":"+p.destination })} in direction ${direction}.`);

    while (this.process.length > 0) {
      next = this.process.shift();
      console.log(`Elevator at ${this.floor} *DING*.`);

      if (next.pickup) {
        this.floor = next.floor;
        next.user.board(this);
      } else {
        this.floor = next.destination;
        next.user.disembark(this);

        // Seomone left so remove their entry from requests
        this.requests = this.requests.filter((r) => {
          return r.user != next.user;
        });
      }
    }
    console.log("---/ELEVATOR-MOVE-INFO---");
  }
}

let userJames = new User("James", 3, 5);
let userJamie = new User("Jamie", 4, 11);
let userJimmy = new User("Jimmy", 2, 1);
let userShemus = new User("Shemus", 6, 7);

let elevator = new Elevator(0);

// Here user is requesting elevator from level 3 going up to 5
userJames.call(elevator);
// Here user is requesting elevator from level 4 going up to 5
userJamie.call(elevator);
// Here user is requesting elevator from level 2 going down to 1
userJimmy.call(elevator);
// Here user is requesting elevator from level 6 going up to 11
userShemus.call(elevator);

elevator.display();
elevator.move();

elevator.display();
elevator.move();

elevator.display();
