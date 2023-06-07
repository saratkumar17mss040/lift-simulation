import { LiftModel, LiftView, LiftController } from './lift/index.js';
const liftApp = new LiftController(new LiftModel(), new LiftView());
liftApp.init();

// Thinking interms of functionality alone.

// sample 4 floors, 2 lifts

console.log('Lift simulation basic logic');
// var screenWidth = window.innerWidth;
// var screenHeight = window.innerHeight;

// console.log('Screen Width: ' + screenWidth);
// console.log('Screen Height: ' + screenHeight);

// Size of the array is the number of floors
// Each item in the arr will be an object that contains the particular floors liftInfo
// let allLiftInfoInFloors = [
// 	{
// 		floorNo: 1,
// 		lifts: [
// 			{
// 				id: 1,
// 				up: true,
// 				down: false,
// 			},
// 			{
// 				id: 2,
// 				up: true,
// 				down: false,
// 			},
// 		],
// 	},
// 	{
// 		floorNo: 2,
// 		lifts: [],
// 	},
// ];

// function createLiftModel(noOfFloors, noOfLifts) {

// }
