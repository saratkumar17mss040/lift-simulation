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
		this.liftView.elements.liftSimulationContainer.addEventListener(
			'click',
			this.moveNearestLift
		);
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
				// alert(
				// 	"Please enter valid inputs again inorder to simulate lifts in small screens. Note that input for no of lifts more than 2 won't work on small screens"
				// );
				// alert('Reset successfully');
				this.liftView.resetLiftSimulationView();
			}
			return true;
		}
	};

	moveNearestLift = (event) => {
		// note that this event comes from the main tag element of lift simulation container
		// if the element has class floor-btn-up, floor-btn-down -> figure out that the click happened on lift buttons
		// get the parent of the button element
		// get the parents sibling element -> class with lifts -> check if it has any child element with class rect-lift , if so grab the first lift and do open,close animation
		// else if the parents sibling element doesnt have any child element with class rect-lift -> find the nearest lift and move it
		// finding nearest lift
		// before that we need to see from where the button is clicked - top floor, ground floor, middle floor ?
		// get the button class name and check if it doesnt contain the sibling button with the other class name
			// for top floor -> // 

		// <div class="floor">
		// 	<div class="floor-btn">
		// 		<div class="floor-btn-controls">
		// 			<button class="floor-btn-up">Up</button>
		// 		</div>
		// 		<div class="lifts">
		// 			<div class="rect-lift">
		// 				<div class="lift">
		// 					<div class="left-door"></div>
		// 					<div class="right-door"></div>
		// 				</div>
		// 			</div>
		// 			<div class="rect-lift">
		// 				<div class="lift">
		// 					<div class="left-door"></div>
		// 					<div class="right-door"></div>
		// 				</div>
		// 			</div>
		// 			<div class="rect-lift">
		// 				<div class="lift">
		// 					<div class="left-door"></div>
		// 					<div class="right-door"></div>
		// 				</div>
		// 			</div>
		// 			<div class="rect-lift">
		// 				<div class="lift">
		// 					<div class="left-door"></div>
		// 					<div class="right-door"></div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<div class="floor-no">
		// 			<div class="floor-hr-line">
		// 				<span>&nbsp; Floor 0</span>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>;
		console.log(event.target); 
	};

	init() {
		this.initializeEventHandlers();
	}

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
			this.liftView.generateLiftSimulationView(noOfLifts, noOfFloors);
			// this.liftModel.generateFloorData(noOfLifts, noOfFloors);
		}
	};
}

export { LiftController };
