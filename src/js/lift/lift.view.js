class LiftView {
	constructor() {
		this.elements = Object.freeze({
			noOfFloors: document.getElementById('no-of-floors'),
			noOfLifts: document.getElementById('no-of-lifts'),
			generateLiftBtn: document.getElementById('generate-lift-btn'),
			liftSimulationContainer: document.getElementById(
				'lift-simulation-container'
			),
		});
	}

	generateLiftSimulationView = (noOfLifts, noOfFloors) => {
		const generateLiftsView = (noOfLifts) => {
			let lifts = '';
			for (let i = 0; i < noOfLifts; i++) {
				lifts += `
                <div class="rect-lift">
                    <div class="lift">
                        <div class="left-door"></div>
                        <div class="right-door"></div>
                    </div>
                </div>`;
			}
			return lifts;
		};

		const liftSimulationContainer = this.elements.liftSimulationContainer;
		let floors = '';

		for (let i = noOfFloors - 1; i >= 0; i--) {
			const floorNo = i;

			const liftsView = floorNo === 0 ? generateLiftsView(noOfLifts) : '';

			const floorBtnUp =
				floorNo >= 0 && floorNo !== noOfFloors - 1
					? '<button class="floor-btn-up">Up</button>'
					: '';
			const floorBtnDown =
				floorNo > 0 ? '<button class="floor-btn-down">Down</button>' : '';

			floors += `
            <div class="floor">
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

	resetLiftSimulationView = () => {
		// alert(
		// 	'You cannot generate lift simulation for smaller screens which have more than 3 lifts'
		// );
		this.elements.liftSimulationContainer.innerHTML = '';
	};
}

export { LiftView };
