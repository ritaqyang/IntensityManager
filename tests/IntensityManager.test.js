const IntensityManager = require('../src/IntensityManager'); 

describe('IntensityManager', () => {
    let manager;

    beforeEach(() => {
        manager = new IntensityManager();
    });
    test('findLeftNeighborIndex should return closest index, 1 item', () => {
        const arr = [[20,2]];
        expect(manager.findLeftNeighborIndex(arr, 20)).toBe(0);
    }); 
    test('findLeftNeighborIndex should return closest index, 2 items', () => {
        const arr = [[10,1], [20,2]];
        expect(manager.findLeftNeighborIndex(arr, 20)).toBe(1);
    }); 
    test('findLeftNeighborIndex should return closest index, 3 items', () => {
        const arr = [[10,1], [20,2], [30,3]];
        expect(manager.findLeftNeighborIndex(arr, 30)).toBe(2);
    }); 

    test('add operation, empty array', () => {
        manager.add(10, 30, 1);
        expect(manager.getArray()).toEqual([[10, 1], [30, 0]]);
    });

    test('add operation should correctly update', () => {
         manager.add(10, 30, 1); 
         manager.add(20, 40, 1); 
         manager.add(10, 40, -2); 
        expect(manager.getArray()).toEqual([[10,-1], [20,0], [30,-1], [40,0]]);
    });

    test('add operation should properly combine ranges', () => {
        manager.add(10, 30, 1); 
        expect(manager.getArray()).toEqual([[10,1],[30,0]]);
        manager.add(20, 40, 1); 
        expect(manager.getArray()).toEqual([[10,1],[20,2],[30,1],[40,0]]);
        manager.add(10, 40, -1); 
        expect(manager.getArray()).toEqual([[20,1],[30,0]]);
    });

    test('set operation should correctly set on empty array', () => {
        manager.set(-5, 1, 0); 
        expect(manager.getArray()).toEqual([]);
        manager.set(-5, 1, 2);
        expect(manager.getArray()).toEqual([[-5, 2], [1, 0]]);
    });


    test('set operation should correctly update overlapping ranges', () => {
        manager.setArray([[-10, 3], [0, 0], [2, 8]]); 
        manager.set(-5, 1, 0); 
        expect(manager.getArray()).toEqual([[-10, 3], [-5, 0], [2, 8]]);
    }); 

    
    test('set operation should correctly handle 0-values', () => {
        manager.setArray([[-10, 3], [0, 0], [2, 8]]);
        manager.set(-10, 2, 0);
        expect(manager.getArray()).toEqual([[2, 8]]);
        
    }); 

   

   
});

