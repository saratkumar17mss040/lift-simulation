# Lift-Simulation
Create a web app where you can simulate lift mechanics for a client

# UI Example
![Lift Simulation Example](Lift-Simulation-Example.png "Lift Simulation Example")

# Requirements
  1. Have a page where you input the number of floors and lifts from the user
  2. An interactive UI is generated, where we have visual depictons of lifts and buttons on floors
  3. Upon clicking a particular button on the floor, a lift goes to that floor

  Milestone 1:
   - Data store that contains the state of your application data
   - JS Engine that is the controller for which lift goes where
   - Dumb UI that responds to controller's commands
   
  Milestone 2:
   - Lift having doors open in 2.5s, then closing in another 2.5s
   - Lift moving at 2s per floor
   - Lift stopping at every floor where it was called
   - Mobile friendly design

# Todo

[X] - Do add on multiple floors and lifts if form is submitted subsequently
[X] - Open and close doors animation
      - If the lift exists in the req floor - just open and close the door
      - Else move the nearest lift to that floor - and then open and close the door
[ ] - check if idle prop is used in liftState - its not used 