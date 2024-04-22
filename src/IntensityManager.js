/**
 * Manages intensity levels on an infinite number line, mp field stores segment start points and corresponding intensity values.
 * Client can increse/decrease and set intensity over specified ranges. 
 */
class IntensityManager {
    /**
     * Constructs a new IntensityManager instance.
     * @field mp - A map to store the start point and intensity values as key-value pairs 
     */
    constructor() {
        this.mp = new Map(); 
 
    }

    /**
     * Adds a specified amount of intensity to a range between two points.
     * @param {number} from - The start of the range (inclusive).
     * @param {number} to - The end of the range (exclusive).
     * @param {number} amount - The amount of intensity to add.
     * @pre {number} from < {number}  to - The start of the range should be less than the end.
     * @post The intensity within the specified range is modified according to the amount.
     * @invariant The total intensity within each key of intensityChanges is always updated correctly.
     * @throws {Error} if the 'from' parameter is greater than or equal to the 'to' parameter
     */
     
    add(from, to, amount) {
        // Check precondition: from < to
        if (from >= to) {
            throw new Error("Invalid range: 'from' should be less than 'to'");
        }
        //sort all keys in the map
        const keys = Array.from(this.mp.keys()).sort((a, b) => a - b);
        //ex. [[10,1],[20,2],[30,1]] 
        //add(11,21,5)
        // result: [[10,1],[11,6],[21,2],[30,1]] 
        // need to store the value of the last segment left of 'from' and the value of the last segment left of 'to'
        let leftFrom = 0;
        let leftTo = 0; 
        //Iterate through each key in the map 
        for (let i = 0; i < keys.length; i++) {

            if (keys[i] < from) { //store the value of last seg left of 'from'
                leftFrom = this.mp.get(keys[i]);
            }
        
            //add amount to all exising segments within the range
            if (keys[i] >= from && keys[i] < to) {
                this.mp.set(keys[i], this.mp.get(keys[i]) + amount);
                
            }
            //reach the end of the range, break the loop
            if (keys[i] >= to) {
                leftTo = this.mp.get(keys[i-1]);//the value of the last segment left of 'to'
                break;
            }
        }
        //add new from and to segments if they do not already exist
        if (!this.mp.has(from)) {
            this.mp.set(from, leftFrom +amount);
        }
        if (!this.mp.has(to)) {
            this.mp.set(to, leftTo);
        }

    }

    /**
     * Sets the intensity for a specified range to a specified amount, overriding any previous values in the range.
     * Adjusts neighboring segments on both left and right directions of the range and updates the map accordingly
     * @param {number} from - The start of the range (inclusive).
     * @param {number} to - The end of the range (exclusive).
     * @param {number} amount - The intensity level to set.
     * @pre {number} from < {number} to to - The start of the range should be less than the end.
     * @post The intensity within the specified range is modified according to the amount.
     * @invariant The total intensity within each key of intensityChanges is always updated correctly.
     * @throws {Error} if the 'from' parameter is greater than or equal to the 'to' parameter
     */
    set(from, to, amount) {
        // Check precondition: from < to
         if (from >= to) {
            throw new Error("Invalid range: 'from' should be less than 'to'");
        }
        const keys = Array.from(this.mp.keys()).sort((a, b) => a - b);//sort keys 
        let next = 0; 
        let lastValue = 0; 
        //Iterate through each key in the map 
        for (let i = 0; i < keys.length; i++) {
            next = i; 
            lastValue = this.mp.get(keys[i]); 
            //delete each key within range
            if (keys[i] >= from && keys[i] < to) {
                this.mp.delete(keys[i]);
            }
            //break if key is bigger than range
            if (keys[i] >= to) {
                break;
            }
        }
        this.mp.set(from, amount); //set new value for the segment
        this.mp.set(to, lastValue); //set the subsequent segment with the value stored 
    }

    /**
     * Prints a summary of all intensity intervals currently managed by the IntensityManager.
     */
    printIntervals() {
        
        let data = [...this.mp.entries()];
        data.sort((a, b) => a[0] - b[0]);
        let formattedData = data.map(entry => `[${entry}]`);
        console.log(formattedData.join(", "));

    }
}

module.exports = IntensityManager;
