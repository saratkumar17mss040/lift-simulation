class LiftModel {
	constructor() {
		this.liftState = [];
	}

	createLiftState = (noOfLifts) => {
		this.liftState = [];
		for (let i = 0; i < noOfLifts; i++) {
			this.liftState.push({
				idle: true,
				currentFloor: 0,
			});
		}
	};

	getExistingLifts = (floorNo) => {
		const existingLifts = this.liftState.filter(
			(lift) => lift.currentFloor === floorNo
		);
		return existingLifts;
	};

	getExistingLiftIndex = (floorNo) => {
		for (let i = 0; i < this.liftState.length; i++) {
			if (this.liftState[i].currentFloor === floorNo) {
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
