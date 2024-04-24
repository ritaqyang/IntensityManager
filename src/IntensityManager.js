/**
 * Manages intensity levels on an infinite number line, arr field stores segment start points and corresponding intensity values.
 * Client can increse/decrease and set intensity over specified ranges. 
 * Time Complexity: 
 */

class IntensityManager {

    #arr = []; 
    /**
     * Constructs a new IntensityManager instance.
     * @field arr - a sorted array of start point and intensity values as key-value pairs. Sorted by start. 
     */
    constructor() {
        this.#arr = [];  
    }
    /**
     * Getter method: Returns a shallow copy of the intensity array.
     * @returns {Array<Array<number>>} A new array containing copies of the original start point and intensity pairs.
     */
    getArray() {
        // Shallow copy each pair to prevent modifications to individual subarrays
        return this.#arr.map(pair => [...pair]);
    }
    /**
     * Setter method
     * @param {Array<Array<number>>} arr - A new array containing intensity pairs.
     */
    setArray(arr) {
        this.#arr = arr;
    }


    /**
     * Adds a specified amount of intensity to a range between two points.
     * Checks left and right neighbors, updates map if necessary
     * @param {number} from - The start of the range (inclusive).
     * @param {number} to - The end of the range (exclusive).
     * @param {number} amount - The amount of intensity to add.
     * @pre {number} from < {number}  to - The start of the range should be less than the end, amount !== 0  
     * @post The intensity within the specified range is modified according to the amount.
     * @invariant The total intensity within each key of intensityChanges is always updated correctly.
     *            Neighboring intervals all have distinct values, otherwise can be merged 
     *            LeftIndex >= 0 
     */
     
    add(from, to, amount) {
        if (from >= to) {
            console.log("WARNING: from should be less than to, no changes were made");
            return; // No changes were made. 
        }
        if (amount === 0) {
            console.log("WARNING: amount should not be 0, no changes were made");
            return; // No changes were made. 
        }
    
        let closest = this.findLeftNeighborIndex(this.#arr, from); //O(logN) time
        // Handle Head 
        // Number i is the index of the first segment that needs to be updated after handling the head
        let i = this.handleHeadForAdding(from, amount, closest); // O(1) time 

        // Handle middle intervals: Add amount to all distinct-valued segments within the range
        while (this.#arr[i] && this.#arr[i][0] < to) {
            this.#arr[i][1] += amount;
            console.log("in while loop: i =" + i + "item:"+ this.#arr[i]);
            i++; 
        }
        // Handle Tail 
        this.handleTailForAdding(to, amount, i); //O(1) time
    }

    /**
     * It adds, updates, or removes a segment depending on the input and current state of the array.
     * It modifies the intensity array in place, run-time is O(1); 
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to add at the 'from' point.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     * @pre {number} amount > 0
     * @returns {number} index of modification point
     */

    handleHeadForAdding(from, amount, closestLeftIndex) {
        // If there is empty array or no smaller neighbor, Add [from, amount] to the beginning of the array
        console.log("handle first is called with :" + from + " " + amount + " " + closestLeftIndex); 
        if (closestLeftIndex === -1) {
            this.#arr.unshift([from, amount]);
            return 1; 
        } 
        else {
            let i = closestLeftIndex; 
            let closestStart = this.#arr[i][0]; 
            let v = this.#arr[i][1]; //value of the closest start  
            console.log(i, closestStart, v); 
            // If 'from' already exists
            if (closestStart === from) {
                // Edge case: If this is the first item of the array and new amt is 0
                if (i === 0 && amount + v === 0) {
                    this.#arr.shift();  //delete the first item if it is 0 since 0 is default 
                    console.log("deleting first zero segment");
                    this.printIntervals(); 
                    return 0; 
                }
                else { // Update value, will be handled in add() 
                    return i; 
                }
            }
            // If 'from' doesn't exist, add [from, oldIntensity + amount] after left neighbor 
            else {
                this.#arr.splice(i+1, 0, [from, v + amount]);
                return i + 2; 
            }
        }
       
    }

     /**
     * Manages the tail part of the range for add operation.
     * It adds, updates, or removes a segment depending on the input and current state of the array.
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to add at the 'from' point.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     */

    handleTailForAdding(to, amount, currentIndex) {
        
        let i = currentIndex; 
        // Case 1: If 'to' already exist
        if (this.#arr[i] && this.#arr[i][0] === to) {
            // Remove existing 'to' if its value is the same as the new previous interval 
            // No changes to existing 'to' otherwise 
            if (this.#arr[i][1] === this.#arr[i-1][1]) {
                this.#arr.splice(i, 1);
                console.log('removing existing to');
                this.printIntervals();
            }
        }
        // Case 2: If 'to' doesn't exist, add [to, oldIntensity] 
        else if (i > 0){
            let oldIntensity = this.#arr[i - 1][1] - amount;
            this.#arr.splice(i, 0, [to, oldIntensity]);
        }
        // Edge Case: when first item is deleted after addition
        // Example: [10, 2], [30, 5], call add(10, 12, -2)
        else if (i == 0) {
            this.#arr.unshift([to, -amount]);
        }
    }


    /**
     * It adds, updates, or removes a segment depending on the input and current state of the array.
     * It modifies the intensity array in place, run-time is O(1); 
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to set.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     * @returns {number} index of modification point
     */

    handleHeadForSetting(from, amount, closestLeftIndex) {
        // If there is empty array or no smaller neighbor, Add [from, amount] to the beginning of the array
        console.log("handlehead forSetting is called with :" + from + " " + amount + " " + closestLeftIndex); 
        this.printIntervals();
        if (closestLeftIndex === -1) {
            // Only add if setting amount is not zero
            if (amount !== 0) {
                this.#arr.unshift([from, amount]);
            }
            return 1; 
        
        } 
        else {
            let i = closestLeftIndex; 
            let closestStart = this.#arr[i][0]; 
            let v = this.#arr[i][1]; //value of the closest start  
            
            // If 'from' already exists
            if (closestStart === from) {
                // Edge case: If this is the first item of the array and new amt is 0
                if (i === 0 && amount === 0) {
                    this.#arr.shift();  //Delete the first item if it is 0 since 0 is default
                    return 0; 
                }
                else { 
                    return i; //Value will be updated in function body of set() 
                }
            }

            // If 'from' doesn't exist 
            else {
                // Add [from, newIntensity] after left neighbor if value is not equal to the amount
                // If equal, no action needed 
                if (v !== amount) {
                    this.#arr.splice(i+1, 0, [from, amount]);
                    return i + 2; 
                }
                
            }
        }
       
    }

     /**
     * Manages the tail part of the range for set operation.
     * It adds, updates, or removes a segment depending on the input and current state of the array.
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to add at the 'from' point.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     * @param {number} lastValue - The last value of the segment before 'to' before any changes are made.
     */

    handleTailForSetting(to, amount, currentIndex, lastValue) {
        
        let i = currentIndex; 
        // Case 1: If 'to' already exist
        if (this.#arr[i] && this.#arr[i][0] === to) {
            // Remove existing 'to' if its value is the same as the new amount
            // No changes to existing 'to' otherwise 
            if (this.#arr[i][1] === amount) {
                this.#arr.splice(i, 1);
            }
        }
        // Case 2: If 'to' doesn't exist
        else if (i > 0) {
            // Add [to, oldIntensity] only if it is differnent from previous
            if (lastValue !== amount) {
                this.#arr.splice(i, 0, [to, lastValue]);
            }
        }
        
    }



    /**
     * Sets the intensity for a specified range to a specified amount, overriding any previous values in the range.
     * If the range doesn't exist, it will be created.
     * @param {number} from - The start of the range (inclusive).
     * @param {number} to - The end of the range (exclusive).
     * @param {number} amount - The intensity level to set.
     * @pre {number} from < {number} to to - The start of the range should be less than the end
     * @post The intensity within the specified range is modified according to the amount.
     * @invariant The total intensity within each key of intensityChanges is always updated correctly.
     */
    set(from, to, amount) {
        if (from >= to) {
            console.log("WARNING: from should be less than to, no changes were made");
            return; // No changes were made. 
        }

        let left = this.findLeftNeighborIndex(this.#arr, from); //O(logN) time
        // Handle head
        // Index i is the index of the first segment that needs to be updated after handling the head
        let i = this.handleHeadForSetting(from, amount, left); // O(1) time

        let lastValue = 0; 
        // Handle Middle Segments in the range 
        while (this.#arr[i] && this.#arr[i][0] < to) {
            lastValue = this.#arr[i][1];
            this.#arr.splice(i, 1); // O(1) time
        }
        // Handle Tail
        this.handleTailForSetting(to, amount, i, lastValue); //O(1) time
       
    }


    /**
     * @param {Array<Array<number>>} arr - An array of pairs, where each pair is an array
     *        containing two numbers: the first number is the key, and the second number is
     *        the associated value.
     * @param {number} target The start of the interval, which is the first element of each key-value pair
     * @returns closest left neighbor index, -1 if no left neighbor or array empty 
     */

    findLeftNeighborIndex(arr,target) {
        if (arr.length === 0) return -1; // Handle empty array case
        
        else {
            let left = 0;
            let right = arr.length - 1;
            let bestIndex = -1;

            while (left <= right) {
                let mid = left + Math.floor((right - left) / 2);

                if (arr[mid][0] <= target) {
                    bestIndex = mid;  // Update bestIndex since arr[mid] is a valid candidate
                    left = mid + 1;   // Move right to find a possibly larger valid candidate
                } else {
                    right = mid - 1;  // arr[mid] is not valid, discard mid and the right half
                }
            }

            // bestIndex should now be the index of the largest value less than the target
            return bestIndex;
        }
        
    }




    /**
     * Prints a summary of all intensity intervals currently managed by the IntensityManager.
     */
    printIntervals() {
        
        let formattedData = this.#arr.map(entry => `[${entry}]`);
        console.log(formattedData.join(", "));

    }
}

module.exports = IntensityManager;


let manager = new IntensityManager();

manager.set(-5, 1, 0); 
manager.printIntervals(); 