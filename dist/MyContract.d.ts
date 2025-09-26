/**
 * Интерфейс MyContract определяет контракт для реализации в классах.
 *
 * Используйте этот интерфейс для описания набора методов и свойств, которые должны быть реализованы
 * в классах, соответствующих данному контракту. Это позволяет обеспечить единообразие и типовую безопасность
 * при работе с различными реализациями.
 *
 * Пример:
 *
 * ```typescript
 * interface MyContract {
 *   doSomething(): void;
 *   property: string;
 * }
 * ```
 */
interface MyContract {
    doSomething(param1: string, param2: number): void;
    property: string;
}
export type { MyContract };
//# sourceMappingURL=MyContract.d.ts.map