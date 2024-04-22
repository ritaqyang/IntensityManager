const IntensityManager = require('../src/IntensityManager'); 

describe('IntensityManager', () => {
    let manager;

    beforeEach(() => {
        manager = new IntensityManager();
    });

    test('add operation should correctly modify intensities', () => {
        manager.add(10, 30, 1);
        console.log = jest.fn();
        manager.printIntervals();
        expect(console.log).toHaveBeenCalledWith("[10,1], [30,0]");
    });

    test('add operation should handle multiple overlapping ranges', () => {
        manager.add(10, 30, 1);
        manager.add(20, 40, 2);
        console.log = jest.fn();
        manager.printIntervals();
        expect(console.log).toHaveBeenCalledWith("[10,1], [20,3], [30,2], [40,0]");
    });

    test('set operation should override previous values', () => {
        manager.add(10, 30, 1);
        manager.set(20, 40, 5);
        console.log = jest.fn();
        manager.printIntervals();
        expect(console.log).toHaveBeenCalledWith("[10,1], [20,5], [40,0]");
        
    });

   
});

