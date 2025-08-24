import MyClass from '@/MyClass.mts';
import Test from 'tests/TestHelper.mts';

describe('class MyClass', () => {
    test('существует и доступен', () => {
        expect(MyClass).not.toBeUndefined();
        Test.expect(MyClass).toBeClass();
    });
});
