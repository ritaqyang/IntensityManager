const IntensityManager = require('../src/IntensityManager'); 

describe('IntensityManager', () => {
    let manager;

    beforeEach(() => {
        manager = new IntensityManager();
    });

    test('add operation should add intensity to an empty range', () => {
        manager.add(10, 20, 5);
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10, 5], [20, 0]]);
    });


    test('add operation should correctly modify intensities', () => {
        manager.add(10, 30, 1);
        manager.add(11, 32, 3); 
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10, 1],[11, 4],[30, 3], [32, 0]]);
    });

    test('add operation should handle multiple overlapping ranges', () => {
        manager.add(10, 30, 1);
        manager.add(20, 40, 2);
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10,1], [20,3], [30,2], [40,0]]);
    });

    test('add operation should combine ranges when values become equivalent', () => {
        manager.add(10, 15, 1);
        manager.add(15, 40, 1);
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10,1], [40,0]]);
    });

    test('set operation should set values to undefined ranges', () => {
        manager.set(10, 30, 4);
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10, 4], [30, 0]]);
    });

    test('set operation should override previous values', () => {
        manager.add(10, 30, 4);
        manager.set(20, 40, 5);
        expect(Array.from(manager.mp).sort((a, b) => a[0] - b[0])).toEqual([[10,4], [20,5], [40,0]]);
        
    });

   
});

