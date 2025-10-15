// src/classes/Extended.ts
import { MyClass } from '@/index.js';
/**
 * Расширение с переопределением.
 */
class Extended extends MyClass {
    /**
     * Переопределённый метод.
     *
     * @override
     */
    doSomething(param1, param2) {
        return { param1: param1.toUpperCase(), param2: Math.abs(param2) };
    }
}
export default Extended;
//# sourceMappingURL=Extended.js.map