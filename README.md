
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
        let manager = new IntensityManager();

        manager.add(10, 30, 1);
        manager.add(20, 40, 2);
        manager.printIntervals();
```
Console output: [10, 1], [20, 3], [30, 2], [40, 0]

```javascript
        let manager = new IntensityManager();

        manager.setArray([[-10, 3], [0, 0], [2, 8]]); 
        manager.set(-5, 1, 0); 
        manager.printIntervals();
```
Condole output:[-10, 3], [-5, 0], [2, 8]

## Features: 
Use the `add(from, to, amount)`function to add the given amount to an interval. 

Use the `set(from, to, amount)`function to set all values of the given interval to the given amount. 

Both implementations has time complexity O(log N), using binary search.
Memory usage is O(N * 2) = O(N).

Includes a test suite that achieves good branch and statement coverage. 

## Contact Information:
Email: qifan.yang@mail.mcgill.ca