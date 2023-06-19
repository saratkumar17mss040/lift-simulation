class LiftModel {
	constructor() {
		this.liftState = [];
	}

	createLiftState = (noOfLifts) => {
		this.liftState = [];
		for (let i = 0; i < noOfLifts; i++) {
			this.liftState.push({
				idle: true,
				isMoving: false,
				movingTo: 0,
				currentFloor: 0,
			});
			this.liftRequests = [];
		}
	};

	getExistingLifts = (floorNo) => {
		const existingLifts = this.liftState.filter(
			(lift) => lift.currentFloor === floorNo && lift.idle === true
		);
		return existingLifts;
	};

	//
	getExistingLiftIndex = (floorNo) => {
		for (let i = 0; i < this.liftState.length; i++) {
			if (this.liftState[i].idle === true) {
				return i;
			}
		}
	};

	checkIfLiftIsAlreadyThereInTheCurrentFloor = (floorNo) => {
		const existingLifts = this.getExistingLifts(floorNo);
		return existingLifts.length >= 1;
	};
}

export { LiftModel };
