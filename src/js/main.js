import { LiftModel, LiftView, LiftController } from './lift/index.js';
const liftApp = new LiftController(new LiftModel(), new LiftView());
liftApp.init();

console.log('Lift simulation basic logic');


