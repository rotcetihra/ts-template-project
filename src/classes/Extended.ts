// src/classes/Extended.ts

import { MyClass, type DoSomethingResult } from '@/index.js';

/**
 * Расширение с переопределением.
 */
class Extended extends MyClass {
    /**
     * Переопределённый метод.
     *
     * @override
     */
    public override doSomething(
        param1: string,
        param2: number,
    ): DoSomethingResult {
        return { param1: param1.toUpperCase(), param2: Math.abs(param2) };
    }
}

export default Extended;
