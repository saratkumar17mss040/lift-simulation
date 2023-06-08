class LiftController {
	constructor(liftModel, liftView) {
		this.liftModel = liftModel;
		this.liftView = liftView;
		this.windowWidth = 0;
	}

	initializeEventHandlers() {
		window.addEventListener('resize', this.checkIfScreenIsSmall);
		this.liftView.elements.generateLiftBtn.addEventListener(
			'click',
			this.validateLiftForm
		);
		console.log(this.liftView.elements.allButtons);
		// this.liftView.elements.liftSimulationContainer.addEventListener(
		// 	'click',
		// 	this.moveNearestLift
		// );

		this.checkIfScreenIsSmall();
	}

	checkIfScreenIsSmall = () => {
		this.windowWidth = window.innerWidth;
		if (this.windowWidth > 400) {
			return false;
		} else {
			const { noOfLifts } = this.liftView.elements;
			if (noOfLifts.value > 3) {
				// clear the lift simulation generation and ask the user to enter the valid inputs based on screen size again
				alert(
					"Please enter valid inputs again inorder to simulate lifts in small screens. Note that input for no of lifts more than 3 won't work on small screens"
				);
				// alert('Reset successfully');
				// reset lift state
				this.liftModel.liftState = [];
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

		for (let i = 0; i < liftState.length; i++) {
			const lift = liftState[i];
			if (lift.currentFloor !== undefined) {
				const distance = Math.abs(lift.currentFloor - targetFloor);
				if (distance < minDistance) {
					minDistance = distance;
					nearestLift = lift;
					nearestLiftIndex = i;
				}
			}
		}
		oldFloor = nearestLift.currentFloor;

		// update the nearest lift to move to that floor
		// update the whole lift state
		console.log('Nearest lift');
		console.log(nearestLift);
		if (nearestLift) {
			nearestLift.currentFloor = targetFloor;
			nearestLift.idle = false;
			// Based on the lift index move the lift in the UI
			this.liftView.moveTheLiftInView(nearestLiftIndex, oldFloor, targetFloor);
			// update the whole lift state
			liftState = [...liftState];
		}
		// this.liftView.openLiftDoors(nearestLiftIndex);
		// setTimeout(() => {
		// 	this.liftView.closeLiftDoors(nearestLiftIndex);
		// }, 2500);
		console.log(this.liftModel.liftState);
	};

	init() {
		this.initializeEventHandlers();
	}

	processFloorNoWhereTheLiftIsRequested = (event) => {
		const floor = event.target.parentNode.parentNode.parentNode;
		const floorNoStr = floor.getAttribute('id');
		const floorNo = +floorNoStr[floorNoStr.length - 1];
		console.log(floorNo);
		if (!this.liftModel.checkIfLiftIsAlreadyThereInTheCurrentFloor(floorNo)) {
			this.moveNearestLift(floorNo);
			// just take the first lift in the current floor and animate opening and closing the door
		} else {
			// just take the first lift in the current floor and animate opening and closing the door
			console.log('lift--->');
			const liftIndex = this.liftModel.getExistingLiftIndex(floorNo);
			// console.log(liftIndex);
			this.liftView.openLiftDoors(liftIndex);
			setTimeout(() => {
				this.liftView.closeLiftDoors(liftIndex);
			}, 2500);
			console.log(`Lift already exists in the ${floorNo} floor !`);
		}
	};

	validateLiftForm = () => {
		const MAX_FLOORS = 15;
		const { elements } = this.liftView;
		const noOfLifts = +elements.noOfLifts.value;
		console.log(noOfLifts);
		const noOfFloors = +elements.noOfFloors.value;
		let isFormValid = true;
		if (noOfFloors <= 0) {
			alert(
				'You cannot set no of floors less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (noOfFloors > 15) {
			alert(`You cannot set more than ${MAX_FLOORS} floors - Max limit`);
			isFormValid = false;
		}
		if (noOfFloors < noOfLifts) {
			alert('No of floors cannot be less than lifts');
			isFormValid = false;
		}
		if (noOfLifts <= 0) {
			alert(
				'You cannot set no of lifts less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (this.checkIfScreenIsSmall() && noOfLifts > 2) {
			alert('You cannot set more than 2 lifts in small screens');
			isFormValid = false;
		}
		if (isFormValid) {
			// if (!this.liftView.isFloorsAndLiftsCreatedInView()) {
			this.liftModel.createLiftState(noOfLifts);
			// }
			const { liftState } = this.liftModel;
			this.liftView.generateLiftSimulationView(liftState, noOfFloors);
			const liveLiftButtons = this.liftView.getLiveLiftButtons();
			liveLiftButtons.forEach((button) => {
				button.addEventListener(
					'click',
					this.processFloorNoWhereTheLiftIsRequested
				);
			});
			// this.liftModel.generateFloorData(noOfLifts, noOfFloors);
		}
	};

	// addTransistionEndEventListenersToAllLifts = () => {	
	// }
}

export { LiftController };
