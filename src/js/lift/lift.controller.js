class LiftController {
	constructor(liftModel, liftView) {
		this.liftModel = liftModel;
		this.liftView = liftView;
		this.windowWidth = 0;
		this.controllerTimeouts = [];
	}

	initializeEventHandlers() {
		window.addEventListener('resize', this.checkIfScreenIsSmall);
		this.liftView.elements.generateLiftBtn.addEventListener(
			'click',
			this.validateLiftForm
		);
		this.checkIfScreenIsSmall();
	}

	checkIfScreenIsSmall = () => {
		this.windowWidth = window.innerWidth;
		if (this.windowWidth > 400) {
			return false;
		} else {
			const { noOfLifts } = this.liftView.elements;
			if (noOfLifts.value > 5) {
				// clear the lift simulation generation and ask the user to enter the valid inputs based on screen size again
				alert(
					"Please enter valid inputs again inorder to simulate lifts in small screens. Note that input for no of lifts more than 5 won't work on small screens"
				);
				// reset lift state
				this.liftModel.liftState = [];
				this.liftModel.liftRequests = [];
				this.liftView.resetLiftSimulationView();
			}
			return true;
		}
	};

	moveNearestLift = (floorNoToMoveTheLift) => {
		// get the lift state
		let liftState = this.liftModel.liftState;
		let targetFloor = floorNoToMoveTheLift;
		let oldFloor = undefined;
		let nearestLift = undefined;
		let nearestLiftIndex = undefined;
		let minDistance = Infinity;

		// Here, i am finding the nearest lift based on the current lift state.
		for (let i = 0; i < liftState.length; i++) {
			const lift = liftState[i];
			if (lift.currentFloor !== undefined && lift.idle === true) {
				const distance = Math.abs(lift.currentFloor - targetFloor);
				if (distance < minDistance) {
					minDistance = distance;
					nearestLift = lift;
					nearestLiftIndex = i;
				}
			}
		}

		// if the nearestLift floor is undefined, which means we ran out of lifts and all lifts are busy moving
		if (nearestLift === undefined) {
			this.liftModel.liftRequests.push(floorNoToMoveTheLift);
		} else {
			oldFloor = nearestLift.currentFloor;
			this.liftView.moveTheLiftInView(
				liftState,
				nearestLift,
				nearestLiftIndex,
				oldFloor,
				targetFloor,
				this.liftModel.liftRequests,
				this.moveNearestLift
			);
		}
	};

	init() {
		this.initializeEventHandlers();
	}

	processFloorNoWhereTheLiftIsRequested = (event) => {
		const floor = event.target.parentNode.parentNode.parentNode;
		const floorNoStr = floor.getAttribute('id');
		const floorNo = +floorNoStr[floorNoStr.length - 1];
		if (!this.liftModel.checkIfLiftIsAlreadyThereInTheCurrentFloor(floorNo)) {
			this.moveNearestLift(floorNo);
		} else {
			// just take the first lift in the current floor and animate opening and closing the door
			// console.log(`Lift already exists in the ${floorNo} floor !`);
			const liftIndex = this.liftModel.getExistingLiftIndex(floorNo);
			const nearestLift = this.liftModel.liftState[liftIndex];
			if (nearestLift === undefined) {
				this.liftModel.liftRequests.push(floorNo);
			}
			if (nearestLift !== undefined) {
				nearestLift.idle = false;
				let openLiftTimeOut = setTimeout(() => {
					this.liftView.openLiftDoors(liftIndex);
				});
				this.controllerTimeouts.push(openLiftTimeOut);

				let closeLiftTimeout = setTimeout(() => {
					this.liftView.closeLiftDoors(liftIndex);
				}, 5000);

				this.controllerTimeouts.push(closeLiftTimeout);

				let liftStopTimeout = setTimeout(() => {
					nearestLift.idle = true;
					nearestLift.currentFloor = floorNo;
					this.liftModel.liftState[liftIndex] = nearestLift;
					this.liftModel.liftState = [...this.liftModel.liftState];
				}, 7000);

				this.controllerTimeouts.push(liftStopTimeout);
			}
		}
	};

	validateLiftForm = () => {
		const MAX_FLOORS = 15;
		const { elements } = this.liftView;
		const noOfLifts = +elements.noOfLifts.value;
		const noOfFloors = +elements.noOfFloors.value;
		let isFormValid = true;
		if (noOfFloors === 1 && noOfLifts === 1) {
			alert('Please: you cannot set 1 floor and 1 lift');
			isFormValid = false;
		}
		if (noOfFloors <= 0) {
			alert(
				'Please: you cannot set no of floors less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (noOfFloors > 15) {
			alert(
				`Please: you cannot set more than ${MAX_FLOORS} floors - Max limit reached`
			);
			isFormValid = false;
		}
		if (noOfFloors < noOfLifts) {
			alert('Please: No of floors cannot be less than no of lifts');
			isFormValid = false;
		}
		if (noOfLifts <= 0) {
			alert(
				'Please: You cannot set no of lifts less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (this.checkIfScreenIsSmall() && noOfLifts > 5) {
			alert('Please: You cannot set more than 5 lifts in small screens');
			isFormValid = false;
		}
		if (isFormValid) {
			// reset the lift state
			this.liftModel.liftState = [];
			this.liftModel.liftRequests = [];
			// clear the timeouts of lift open, close, stop
			this.liftView.resetLiftTimeouts();
			this.controllerTimeouts.forEach(function (timeout) {
				clearTimeout(timeout);
			});

			this.liftModel.createLiftState(noOfLifts);

			const { liftState } = this.liftModel;
			this.liftView.generateLiftSimulationView(liftState, noOfFloors);
			const liveLiftButtons = this.liftView.getLiveLiftButtons();
			liveLiftButtons.forEach((button) => {
				button.addEventListener(
					'click',
					this.processFloorNoWhereTheLiftIsRequested
				);
			});
		}
	};
}

export { LiftController };
