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
			// let liftContainer = document.querySelectorAll('.rect-lift');
			// let allFloorLifts = document.querySelectorAll('.lifts');
			// let groundFloorLifts = allFloorLifts[allFloorLifts?.length - 1];
			// console.log(groundFloorLifts);
			// console.log(groundFloorLifts?.childElementCount);
			// if (groundFloorLifts?.childElementCount > 0) {
			// 	groundFloorLifts.innerHTML = '';
			// }
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

		console.log(noOfFloors);

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
		// console.log(document.querySelectorAll('button'));
		// this.getLiveLiftButtons();
	};

	isFloorsAndLiftsCreatedInView = () => {
		return this.elements.liftSimulationContainer.childElementCount !== 0;
	};

	findLeftAndRightDoorsOfLift = (liftIndex) => {
		const lift = document.querySelector(`.lifts #lift-${liftIndex}`);
		console.log(lift);
		const leftDoor = lift.querySelector('.lift .left-door');
		const rightDoor = lift.querySelector('.lift .right-door');
		console.log(leftDoor);
		console.log(rightDoor);
		return [leftDoor, rightDoor];
	};

	openLiftDoors = (liftIndex) => {
		const [leftDoor, rightDoor] = this.findLeftAndRightDoorsOfLift(liftIndex);
		leftDoor.classList.add('open');
		rightDoor.classList.add('open');
	};

	closeLiftDoors = (liftIndex) => {
		const [leftDoor, rightDoor] = this.findLeftAndRightDoorsOfLift(liftIndex);
		leftDoor.classList.remove('open');
		rightDoor.classList.remove('open');
	};

	moveTheLiftInView = (liftIndex, oldFloorNo, targetFloorNo) => {
		const lift = document.getElementById(`lift-${liftIndex}`);
		// const yAxis =
		// oldFloorNo < targetFloorNo
		// 	? targetFloorNo * -205 + 'px'
		// 	: targetFloorNo * -204 + 'px';
		const yAxis = targetFloorNo * -205 + 'px';
		const transitionTime = Math.abs(targetFloorNo - oldFloorNo) * 2;
		lift.style.transition = `transform ${transitionTime}s ease`;
		lift.style.transform = `translate(0px,${yAxis})`;
		const transistionTimeInMilliSecStartToOpenDoors = transitionTime * 1000;
		const transistionTimeInMilliSecStartToCloseDoors =
			transistionTimeInMilliSecStartToOpenDoors + 2500;
		setTimeout(() => {
			this.openLiftDoors(liftIndex);
		}, transistionTimeInMilliSecStartToOpenDoors);
		setTimeout(() => {
			this.closeLiftDoors(liftIndex);
		}, transistionTimeInMilliSecStartToCloseDoors);
	};

	resetLiftSimulationView = () => {
		// alert(
		// 	'You cannot generate lift simulation for smaller screens which have more than 3 lifts'
		// );
		this.elements.noOfFloors.value = '';
		this.elements.noOfLifts.value = '';
		this.elements.liftSimulationContainer.innerHTML = '';
	};
}

export { LiftView };
