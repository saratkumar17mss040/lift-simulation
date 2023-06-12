import { LiftModel, LiftView, LiftController } from './lift/index.js';
const liftApp = new LiftController(new LiftModel(), new LiftView());
console.info('%c Lift simulation app started', 'color: #1aed52;');
liftApp.init();
