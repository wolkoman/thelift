export const theLift = (queues: number[][], capacity: number): number[] => {
  const lift = new Lift(capacity);
  const house = new House(queues);

  while (house.isSomeoneWaiting() || lift.hasPeople()) {
    house.getFloor(lift.level).letPeopleEnter(lift);
    lift.travel([...house.getStopRequests(), ...lift.getStopRequests()]);
    lift.letPeopleLeave();
  }
  lift.forceTravel(0);
  return lift.history;
}

enum DIRECTION { UP, DOWN}

class Lift {
  level = 0;
  people: number[] = [];
  direction = DIRECTION.UP;
  capacity = 0;
  history = [0];

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  addPerson(destination: number) {
    this.people.push(destination);
  }

  getAvailableSpace() {
    return this.capacity - this.people.length;
  }

  isFull() {
    return this.getAvailableSpace() <= 0;
  }

  isTravellingInDirectionOf(destination: number) {
    return this.direction === DIRECTION.UP
      ? destination > this.level
      : destination < this.level;
  }

  distanceTo(level: number) {
    return Math.abs(this.level - level);
  }

  compareLevelDistance(level1: number, level2: number) {
    return this.distanceTo(level1) - this.distanceTo(level2);
  }

  getStopRequests(): StopRequest[] {
    return this.people.map(destination => new StopRequest(destination));
  }

  travel(stopRequests: StopRequest[]) {
    const stopsAhead = stopRequests.filter(request => this.isTravellingInDirectionOf(request.destination));
    const stopsWithSameDirection = stopRequests.filter(request => request.direction === this.direction || request.direction === undefined);
    const stopsAheadWithSameDirection = stopsAhead.filter(request => stopsWithSameDirection.includes(request));

    if (stopsAhead.length === 0) {
      this.changeDirection();
    } else if (stopsAheadWithSameDirection.length === 0) {
      this.forceTravel(StopRequest.farthest(stopsAhead, this.level).destination)
    } else {
      this.forceTravel(StopRequest.nearest(stopsAheadWithSameDirection, this.level).destination)
    }
  }

  forceTravel(level: number) {
    if (this.level === level) return;
    this.level = level;
    this.history.push(level);
  }

  letPeopleLeave() {
    this.people = this.people.filter(destination => destination !== this.level);
  }

  hasPeople() {
    return this.people.length !== 0;
  }

  private changeDirection() {
    this.direction = this.direction === DIRECTION.UP ? DIRECTION.DOWN : DIRECTION.UP;
  }
}

class House {
  floors: Floor[];

  constructor(queues: number[][]) {
    this.floors = queues.map((queue, level) => new Floor(queue, level));
  }

  isSomeoneWaiting() {
    return this.floors.some(level => level.isSomeoneWaiting());
  }

  getFloor(index: number) {
    return this.floors[index];
  }

  getStopRequests(): StopRequest[] {
    return [DIRECTION.UP, DIRECTION.DOWN].flatMap(direction => this.floors
      .filter(floor => floor.isSomeoneWaitingFor(direction))
      .map(floor => new StopRequest(floor.level, direction))
    );
  }

}

class StopRequest {
  destination: number;
  direction?: DIRECTION;

  constructor(destination: number, direction?: DIRECTION) {
    this.destination = destination;
    this.direction = direction;
  }

  static extreme(stops: StopRequest[], from: number, type: 'nearest' | 'farthest') {
    return stops.sort((request2, request1) =>
      Math.abs((type === 'farthest' ? request1 : request2).destination - from)
      - Math.abs((type === 'farthest' ? request2 : request1).destination - from)
    )[0];
  }

  static farthest(stops: StopRequest[], from: number) {
    return StopRequest.extreme(stops, from, 'farthest');
  }

  static nearest(stops: StopRequest[], from: number) {
    return StopRequest.extreme(stops, from, 'nearest');
  }
}

class Floor {
  queue: number[];
  level: number;

  constructor(queue: number[], level: number) {
    this.queue = queue;
    this.level = level;
  }

  isSomeoneWaiting() {
    return this.queue.length > 0;
  }

  isSomeoneWaitingFor(direction: DIRECTION) {
    return this.queue.filter(destination => direction === DIRECTION.UP ? destination > this.level : destination < this.level).length > 0;
  }

  letPeopleEnter(lift: Lift) {
    this.queue = this.queue.filter(destination => {
      const canEnter = lift.isTravellingInDirectionOf(destination) && !lift.isFull();
      if (canEnter) lift.addPerson(destination);
      return !canEnter;
    });
  }
}
