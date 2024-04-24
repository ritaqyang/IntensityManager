const IntensityManager = require('../src/IntensityManager'); 

describe('IntensityManager', () => {
    let manager;

    beforeEach(() => {
        manager = new IntensityManager();
    });


    test('add operation, empty array', () => {
        manager.add(10, 30, 1);
        expect(manager.getArray()).toEqual([[10, 1], [30, 0]]);
    });

    test('add operation should properly combine ranges', () => {
        manager.add(10, 30, 1); 
        expect(manager.getArray()).toEqual([[10,1],[30,0]]);
        manager.add(20, 40, 1); 
        expect(manager.getArray()).toEqual([[10,1],[20,2],[30,1],[40,0]]);
        manager.add(10, 40, -1); 
        expect(manager.getArray()).toEqual([[20,1],[30,0]]);
    });
    test('add operation should correctly update', () => {
        manager.add(10, 30, 1); 
        manager.add(20, 40, 1); 
        manager.add(10, 40, -2); 
        expect(manager.getArray()).toEqual([[10, -1], [20, 0], [30, -1], [40, 0]]);
        manager.add(25, 45, -10);
        expect(manager.getArray()).toEqual([[10, -1], [20, 0], [25, -10], [30, -11], [40, -10], [45, 0]]);
        });
    
    test('set operation should correctly set on empty array', () => {
        manager.set(-15, 5, 0); 
        expect(manager.getArray()).toEqual([]);
        manager.set(3, 5, 10)
        expect(manager.getArray()).toEqual([[3, 10], [5, 0]]);
    
    });


    test('set operation should correctly update overlapping ranges', () => {
        manager.setArray([[-10, 3], [0, 0], [2, 8]]); 
        manager.set(-5, 1, 0); 
        expect(manager.getArray()).toEqual([[-10, 3], [-5, 0], [2, 8]]);
        manager.set(-20, 3, -20); 
        expect(manager.getArray()).toEqual([[-20, -20], [3, 8]]);
        manager.set(-40, 40, 3); 
        expect(manager.getArray()).toEqual([[-40, 3], [40, 8]]);
    }); 

    
    test('set operation should correctly handle setting 0-values', () => {
        manager.setArray([[-25,14],[-10, 3], [1, 0], [2, 8],[16,100], [35,6]]);
        manager.set(-10, 2, 0);
        expect(manager.getArray()).toEqual([[-25,14],[-10,0],[2, 8],[16,100], [35,6]]);
        manager.set(-100, -20, 0);
        expect(manager.getArray()).toEqual([[-20,14], [-10,0], [2, 8],[16,100], [35,6]]);
        manager.set(17, 36, 0);
        expect(manager.getArray()).toEqual([[-20,14], [-10,0], [2, 8],[16,100], [17,0],[36,6]]);
    }); 

    test('findLeftNeighborIndex(binary search) should return closest index with value less than target', () => {
        const arr = [[20,2]];
        expect(manager.findLeftNeighborIndex(arr, 20)).toBe(0);
        const arr2 = [[10,1], [20,2]];
        expect(manager.findLeftNeighborIndex(arr2, 20)).toBe(1);
        const arr3 = [[10,1], [20,2], [30,3]];
        expect(manager.findLeftNeighborIndex(arr3, 30)).toBe(2);
        const arr4 = [[10, 1], [20, 2], [30, 3], [32, 4], [50, 5], [120, 40]];
        expect(manager.findLeftNeighborIndex(arr4, 32)).toBe(3);
    }); 
   
});

