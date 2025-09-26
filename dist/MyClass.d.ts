/**
 * Пакет с примерами документации.
 *
 * @packageDocumentation
 * @category Документация
 * @remarks
 * Модуль для тестирования TypeDoc. Не пытайся это запускать в проде.
 *
 * @since 0.1.0
 * @author Dmitry
 */
export interface MyContract {
    doSomething(param1: string, param2: number): object;
    property: string;
}
/**
 * Класс `MyClass` реализует {@link MyContract}.
 *
 * @remarks
 * Полигон для проверки почти всех тегов TypeDoc.
 *
 * @example
 * ```ts
 * const instance = new MyClass();
 * console.log(instance.property);
 * ```
 *
 * @category Примеры классов
 * @see {@link MyContract}
 * @since 0.1.0
 * @sealed
 * @class
 */
export default class MyClass implements MyContract {
    /**
     * Версия класса.
     *
     * @public
     * @readonly
     * @defaultValue "1.0.0"
     * @since 0.1.0
     */
    static readonly VERSION: string;
    /**
     * Создаёт новый экземпляр с начальными значениями.
     *
     * @public
     * @returns Экземпляр {@link MyClass}.
     * @example
     * ```ts
     * const instance = MyClass.createDefault();
     * ```
     */
    static createDefault(): MyClass;
    /**
     * Создаёт экземпляр из «сырых» данных.
     *
     * @public
     * @param data - Объект частично совместимый с {@link MyContract}.
     * @returns Экземпляр {@link MyClass}.
     * @throws {TypeError} Если данные некорректны.
     * @example
     * ```ts
     * const inst = MyClass.fromJSON({ property: "x", doSomething(){} });
     * ```
     */
    static fromJSON(data: Partial<MyContract>): MyClass;
    /**
     * Проверяет, соответствует ли значение контракту {@link MyContract}.
     *
     * @public
     * @param value - Любое значение.
     * @returns `true`, если объект выглядит как `MyContract`.
     * @example
     * ```ts
     * MyClass.isMyContract({ property: "p", doSomething(){} }) === true;
     * ```
     */
    static isMyContract(value: unknown): value is MyContract;
    /**
     * Устаревшая фабрика.
     *
     * @public
     * @deprecated Используйте {@link MyClass.createDefault} или {@link MyClass.fromJSON}.
     * @returns Экземпляр {@link MyClass}.
     */
    static create(): MyClass;
    /**
     * Реализация свойства из {@link MyContract}.
     *
     * @public
     * @defaultValue "value"
     * @example
     * ```ts
     * new MyClass().property; // "value"
     * ```
     */
    property: string;
    /**
     * Приватное поле.
     *
     * @private
     */
    private secret;
    /**
     * Защищённое поле.
     *
     * @protected
     */
    protected flag: boolean;
    /**
     * Выполняет действие.
     *
     * @public
     * @param param1 - Строковый параметр.
     * @param param2 - Числовой параметр.
     * @returns Объект с параметрами.
     * @throws {Error} Если параметры некорректны.
     *
     * @remarks
     * Основной метод для демонстрации параметров и возвращаемого значения.
     *
     * @example
     * ```ts
     * const r = new MyClass().doSomething("foo", 42);
     * ```
     *
     * @category Методы
     * @since 0.1.0
     */
    doSomething(param1: string, param2: number): object;
    /**
     * Метод с перегрузками.
     *
     * @remarks
     * Демонстрация перегрузок и `@overload`.
     *
     * @overload
     * @param a - Строка.
     * @returns Число.
     *
     * @overload
     * @param a - Число.
     * @returns Строка.
     */
    overloaded(a: string): number;
    overloaded(a: number): string;
    /**
     * Генерик-метод.
     *
     * @template T Тип элементов массива.
     * @param items - Входной массив.
     * @returns Первый элемент массива.
     */
    firstItem<T>(items: T[]): T;
    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    oldMethod(): void;
    /**
     * Псевдо-виртуальный метод (для демонстрации тега).
     *
     * @virtual
     */
    virtualMethod(): void;
}
/**
 * Абстрактная база.
 *
 * @abstract
 * @category Абстракции
 */
export declare abstract class AbstractBase {
    /**
     * Абстрактный метод.
     *
     * @abstract
     */
    abstract mustImplement(): void;
}
/**
 * Расширение с переопределением.
 */
export declare class Extended extends MyClass {
    /**
     * Переопределённый метод.
     *
     * @override
     */
    doSomething(param1: string, param2: number): object;
}
//# sourceMappingURL=MyClass.d.ts.map