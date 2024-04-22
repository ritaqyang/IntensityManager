
# Intensity Manager
## Project Title and Description: 

This is a simple program that manages intensity levels over segments. Segments are intervals from -infinity to  infinity.
It allows clients to update the intensity level of a certain range by an integer amount, or set to an integer amount. 


## Installation Instructions: 
For testing: 
npm install --save-dev jest
npm test

## Usage: 
Example usage: 
```javascript
        manager.add(10, 30, 1);
        manager.add(20, 40, 2);
        manager.printIntervals();
```
Console output: [10, 1], [20, 3], [30, 2], [40, 0]
        
## Features: 
Use the `add(from, to, amount)`function to add the given amount to an interval. 

Use the `set(from, to, amount)`function to set all values of the given interval to the given amount. 

## Contact Information:
Email: qifan.yang@mail.mcgill.ca