import { expect } from '@jest/globals';

class TestHelper {
    _actual: unknown;

    public static expect(actual: unknown) {
        const test: TestHelper = new TestHelper();

        test._actual = actual;

        return test;
    }

    public toBeClass(): void {
        expect(
            typeof this._actual === 'function' &&
                /^class\s/.test(Function.prototype.toString.call(this._actual)),
        ).toBe(true);
    }
}

export default TestHelper;
