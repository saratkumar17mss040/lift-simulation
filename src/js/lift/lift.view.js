class LiftView {
	constructor() {
		this.elements = {
			noOfFloors: document.getElementById('no-of-floors'),
			noOfLifts: document.getElementById('no-of-lifts'),
			generateLiftBtn: document.getElementById('generate-lift-btn'),
			liftSimulationContainer: document.getElementById(
				'lift-simulation-container'
			),
		};
		this.viewTimeouts = [];
	}

	getLiveLiftButtons = () => {
		const allButtons = document.querySelectorAll('button');
		const buttonsWithNumberId = Array.from(allButtons).filter((button) =>
			/^\d/.test(button.id)
		);
		return buttonsWithNumberId;
	};

	generateLiftSimulationView = (liftState, noOfFloors) => {
		const generateLiftsView = (liftState) => {
			let lifts = '';
			for (let i = 0; i < liftState.length; i++) {
				lifts += `
                <div id=lift-${i} class="rect-lift">
                    <div class="lift">
						<div class="left-door doors"></div>
						<div class="right-door doors"></div>
                    </div>
                </div>`;
			}
			return lifts;
		};

		const liftSimulationContainer = this.elements.liftSimulationContainer;
		let floors = '';

		for (let i = noOfFloors - 1; i >= 0; i--) {
			const floorNo = i;

			const liftsView = floorNo === 0 ? generateLiftsView(liftState) : '';

			const floorBtnUp =
				floorNo >= 0 && floorNo !== noOfFloors - 1
					? `<button id=${i}-btn-up  class="floor-btn-up">Up</button>`
					: '';
			const floorBtnDown =
				floorNo > 0
					? `<button id=${i}-btn-down  class="floor-btn-down">Down</button>`
					: '';

			floors += `
            <div id=floor-${i} class="floor">
                <div class="floor-btn">
                    <div class="floor-btn-controls">
						${floorBtnUp}
                        ${floorBtnDown}
                    </div>
                    <div class="lifts">
                        ${liftsView}
                    </div>
                    <div class="floor-no">
                        <div class="floor-hr-line">
                            <span>&nbsp; Floor ${floorNo}</span>
                        </div>
                    </div>
                </div>
            </div>`;
		}

		liftSimulationContainer.innerHTML = floors;
	};

	isFloorsAndLiftsCreatedInView = () => {
		return this.elements.liftSimulationContainer.childElementCount !== 0;
	};

	findLeftAndRightDoorsOfLift = (liftIndex) => {
		const lift = document.querySelector(`.lifts #lift-${liftIndex}`);
		const leftDoor = lift?.querySelector('.lift .left-door');
		const rightDoor = lift?.querySelector('.lift .right-door');
		return [leftDoor, rightDoor];
	};

	openLiftDoors = (liftIndex) => {
		const [leftDoor, rightDoor] = this.findLeftAndRightDoorsOfLift(liftIndex);
		if (leftDoor !== undefined && rightDoor !== undefined) {
			leftDoor.classList.add('open');
			rightDoor.classList.add('open');
		}
	};

	closeLiftDoors = (liftIndex) => {
		const [leftDoor, rightDoor] = this.findLeftAndRightDoorsOfLift(liftIndex);
		if (leftDoor !== undefined && rightDoor !== undefined) {
			leftDoor.classList.remove('open');
			rightDoor.classList.remove('open');
		}
	};

	moveTheLiftInView = (
		liftState,
		nearestLift,
		liftIndex,
		oldFloorNo,
		targetFloorNo,
		liftRequests,
		moveNearestLift
	) => {
		nearestLift.idle = false;
		nearestLift.isMoving = true;
		nearestLift.movingTo = targetFloorNo;
		const lift = document.getElementById(`lift-${liftIndex}`);
		const yAxis = targetFloorNo * -205 + 'px';
		const transitionTime = Math.abs(targetFloorNo - oldFloorNo) * 2;
		lift.style.transition = `transform ${transitionTime}s ease`;
		lift.style.transform = `translate(0px,${yAxis})`;
		const transistionTimeInMilliSecStartToOpenDoors = transitionTime * 1000;
		const transistionTimeInMilliSecStartToCloseDoors =
			transistionTimeInMilliSecStartToOpenDoors + 2500;
		const liftStop = transistionTimeInMilliSecStartToCloseDoors + 4000;

		// update the lift state
		// stop the lift for 2's
		let openLiftTimeOut = setTimeout(() => {
			this.openLiftDoors(liftIndex);
		}, transistionTimeInMilliSecStartToOpenDoors);

		this.viewTimeouts.push(openLiftTimeOut);

		let closeLiftTimeout = setTimeout(() => {
			this.closeLiftDoors(liftIndex);
		}, transistionTimeInMilliSecStartToCloseDoors);

		this.viewTimeouts.push(closeLiftTimeout);

		let liftStopTimeout = setTimeout(() => {
			nearestLift.idle = true;
			nearestLift.isMoving = false;
			nearestLift.currentFloor = targetFloorNo;
			// nearestLift.movingTo = null;
			liftState[liftIndex] = nearestLift;
			liftState = [...liftState];
			if (liftRequests.length > 0) {
				moveNearestLift(liftRequests.shift());
			}
			// console.log(liftState);
		}, liftStop);

		this.viewTimeouts.push(liftStopTimeout);
	};

	resetLiftSimulationView = () => {
		// alert(
		// 	'You cannot generate lift simulation for smaller screens which have more than 3 lifts'
		// );
		this.elements.noOfFloors.value = '';
		this.elements.noOfLifts.value = '';
		this.elements.liftSimulationContainer.innerHTML = '';
		this.resetLiftTimeouts();
	};

	resetLiftTimeouts = () => {
		this.viewTimeouts.forEach(function (timeout) {
			clearTimeout(timeout);
		});
	};
}

export { LiftView };
