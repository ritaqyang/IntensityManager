/**
 * Manages intensity levels on an infinite number line.
 * Data is stored in a sorted array of key-value pairs, where each key is the start point of an intensity segment,
 * Each subarray has the format [start, value]: segment start point,  corresponding intensity values
 * Client can increse/decrease and set intensity over specified ranges, array is modified in-place. 
 * Time Complexity : O(log(n)), Space Complexity: O(n).
 */

class IntensityManager {

    #arr = []; //Private field to ensure good encapsulation
    /**
     * Constructs a new IntensityManager instance.
     * @field {Array<Array<number>>} arr - a sorted array of [start point, intensity value]  
     *        as key-value pairs. Sorted by start. 
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
     * Setter method: Set private intensity array field to given array
     * @param {Array<Array<number>>} arr - An array containing intensity pairs.
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
        // Tail Case 1: If 'to' already exist
        if (this.#arr[i] && this.#arr[i][0] === to) {
            // Remove existing 'to' if its value is the same as the new previous interval 
            // No changes to existing 'to' otherwise 
            if (this.#arr[i][1] === this.#arr[i-1][1]) {
                this.#arr.splice(i, 1);
            }
        }
        // Tail Case 2: If 'to' doesn't exist, add [to, oldIntensity] 
        else if (i > 0){
            let oldIntensity = this.#arr[i - 1][1] - amount;
            this.#arr.splice(i, 0, [to, oldIntensity]);
        }
        // Tail Edge Case: when first item is deleted after addition
        // Example: [10, 2], [30, 5], call add(10, 12, -2)
        else if (i == 0) {
            this.#arr.unshift([to, -amount]);
        }
    
    }

    /**
     * Helper function for add. Time-complexity: O(1).
     * It checks different edge cases and modify the first segment impacted by add operation.  
     * It modifies the intensity array in place, and returns index to continue to modify after.
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to add at the 'from' point.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     * @pre {number} amount > 0
     * @returns {number} index of modification point after head is handled 
     */

    handleHeadForAdding(from, amount, closestLeftIndex) {
        // If there is empty array or no smaller neighbor, Add [from, amount] to the beginning of the array
        if (closestLeftIndex === -1) {
            this.#arr.unshift([from, amount]);
            return 1; 
        } 
        else {
            let i = closestLeftIndex; 
            let closestStart = this.#arr[i][0]; 
            let v = this.#arr[i][1]; //value of the closest start  
            console.log(i, closestStart, v); 
            // Case 1: If 'from' already exists
            if (closestStart === from) {
                // Edge case: If this is the first item of the array and new amt is 0
                if (i === 0 && amount + v === 0) {
                    this.#arr.shift();  //delete the first item if it is 0 since 0 is default 
                    return 0; 
                }
                else { // Update value, will be handled in add() 
                    return i; 
                }
            }
            // Case 2: If 'from' doesn't exist, add [from, oldIntensity + amount] after left neighbor 
            else {
                this.#arr.splice(i+1, 0, [from, v + amount]);
                return i + 2; 
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
        // Tail Case 1: If 'to' already exist
        if (this.#arr[i] && this.#arr[i][0] === to) {
            // Remove existing 'to' if its value is the same as the new amount
            // No changes to existing 'to' otherwise 
            if (this.#arr[i][1] === amount) {
                this.#arr.splice(i, 1);
            }
        }
        // Tail Case 2: If 'to' doesn't exist
        else {       
            // Add [to, oldIntensity] only if it is different from previous
            if (lastValue !== amount) {
                this.#arr.splice(i, 0, [to, lastValue]);
            }
        }
       
    }
    /**
     * Helper function for set operation. Time-complexity: O(1).
     * It checks different edge cases and modifies the first segment impacted by set operation. 
     * It modifies the intensity array in place, returning index to continue to modify after.
     * @param {number} from - The start point of the intensity segment.
     * @param {number} amount - The intensity value to set.
     * @param {number} closestLeftIndex - The index of the closest start point that is less than or equal to 'from',
     *                                    or -1 if there is no such start point.
     * @returns {number} index of modification point after head is handled 
     */

    handleHeadForSetting(from, amount, closestLeftIndex) {
        
        //Empty case:  If there is empty array or no smaller neighbor, Add [from, amount] to the beginning of the array
        if (closestLeftIndex === -1) {
            // Only add if setting amount is not zero
            if (amount !== 0) {
                this.#arr.unshift([from, amount]);
                return 1; 
            }
            return 0; 
        
        } 
        else {
            let i = closestLeftIndex; 
            let closestStart = this.#arr[i][0]; 
            let v = this.#arr[i][1]; //value of the closest start  
            
            // Case 1: If 'from' already exists
            if (closestStart === from) {
                // Edge case: If this is the first item of the array and new amt is 0
                if (i === 0 && amount === 0) {
                    this.#arr.shift();  //Delete the first item if it is 0 since 0 is default
                    return 0; 
                }
                else { 
                    this.#arr[i][1] = amount;
                    return i + 1;  
                }
            }
            // Case 2: If 'from' doesn't exist 
            else {
                // Add [from, newIntensity] after left neighbor if value is not equal to the amount
                // If equal, no action needed 
                if (v !== amount) {
                    this.#arr.splice(i + 1, 0, [from, amount]);
                    return i + 2; 
                }
            }
        }
    }


    /**
     * Helper method that uses binary search to find the closest element. Time complexity: O(log(n)). 
     * @param {Array<Array<number>>} arr - An array of key-value pairs to search
     * @param {number} target The start of the interval, which is the first element of each key-value pair
     * @returns closest left neighbor index, -1 if no left neighbor or array empty 
     */
    findLeftNeighborIndex(arr,target) {
        if (arr.length === 0) return -1; // Handle empty array case
 
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

    /**
     * Prints a summary of all intensity intervals currently managed by the IntensityManager.
     */
    printIntervals() {
        let formattedData = this.#arr.map(entry => `[${entry}]`);
        console.log(formattedData.join(", "));
    }
}
module.exports = IntensityManager;

