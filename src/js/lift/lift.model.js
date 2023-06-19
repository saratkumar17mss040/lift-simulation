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
		let existingMovingLifts = this.liftState.filter(
			(lift) => lift.movingTo === floorNo
		);
		if (existingMovingLifts.length > 0) {
			return existingMovingLifts;
		} else {
			existingMovingLifts = this.liftState.filter(
				(lift) => lift.currentFloor === floorNo && lift.idle === true
			);
		}
		return existingMovingLifts;
	};

	//
	getExistingLiftIndex = (floorNo) => {
		// loop through liftState and find if a lift is movingTo that floor if so -> return undefined
		let liftIndex = undefined;
		for (let i = 0; i < this.liftState.length; i++) {
			if (
				this.liftState[i].idle === true &&
				this.liftState[i].currentFloor === floorNo
			) {
				liftIndex = i;
			}
		}
		if (liftIndex === undefined) {
			const anyLiftMoving = this.liftState.filter(
				(lift) => lift.movingTo === floorNo
			);
			if (anyLiftMoving.length > 0) {
				liftIndex = null;
			}
		}
		// console.log(liftIndex);
		return liftIndex;
	};

	checkIfLiftIsAlreadyThereInTheCurrentFloor = (floorNo) => {
		const existingLifts = this.getExistingLifts(floorNo);
		console.log({ existingLifts });
		return existingLifts.length >= 1;
	};
}

export { LiftModel };
