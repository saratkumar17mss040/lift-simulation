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
			console.log('push happened');
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
		if (
			this.liftModel.checkIfLiftIsAlreadyThereInTheCurrentFloor(floorNo)
				.length !== 0
		) {
			this.moveNearestLift(floorNo);
		} else {
			// just take the first lift in the current floor and animate opening and closing the door
			const nearestLift = this.liftModel.liftState;
			nearestLift.idle = false;
			const liftIndex = this.liftModel.getExistingLiftIndex(floorNo);
			this.liftView.openLiftDoors(liftIndex);

			setTimeout(() => {
				this.liftView.closeLiftDoors(liftIndex);
			}, 5000);

			setTimeout(() => {
				nearestLift.idle = true;
				nearestLift.currentFloor = floorNo;
				this.liftModel.liftState[liftIndex] = nearestLift;
				this.liftModel.liftState = [...this.liftModel.liftState];
				console.log(`Lift already exists in the ${floorNo} floor !`);
			}, 7000);
		}
	};

	validateLiftForm = () => {
		const MAX_FLOORS = 15;
		const { elements } = this.liftView;
		const noOfLifts = +elements.noOfLifts.value;
		const noOfFloors = +elements.noOfFloors.value;
		let isFormValid = true;
		if (noOfFloors <= 0) {
			alert(
				'You cannot set no of floors less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (noOfFloors > 15) {
			alert(
				`You cannot set more than ${MAX_FLOORS} floors - Max limit reached`
			);
			isFormValid = false;
		}
		if (noOfFloors < noOfLifts) {
			alert('No of floors cannot be less than no of lifts');
			isFormValid = false;
		}
		if (noOfLifts <= 0) {
			alert(
				'You cannot set no of lifts less than or equal to 0 or leave it empty'
			);
			isFormValid = false;
		} else if (this.checkIfScreenIsSmall() && noOfLifts > 5) {
			alert('You cannot set more than 5 lifts in small screens');
			isFormValid = false;
		}
		if (isFormValid) {
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
