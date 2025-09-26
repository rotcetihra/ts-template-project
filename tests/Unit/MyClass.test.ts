import MyClass from '@/MyClass.js';
import Test from 'tests/TestHelper.js';

describe('class MyClass', () => {
    test('существует и доступен', () => {
        expect(MyClass).not.toBeUndefined();
        Test.expect(MyClass).toBeClass();
    });
});
