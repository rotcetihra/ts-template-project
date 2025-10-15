import { MyClass, type DoSomethingResult } from '@/index.js';
/**
 * Расширение с переопределением.
 */
declare class Extended extends MyClass {
    /**
     * Переопределённый метод.
     *
     * @override
     */
    doSomething(param1: string, param2: number): DoSomethingResult;
}
export default Extended;
//# sourceMappingURL=Extended.d.ts.map
