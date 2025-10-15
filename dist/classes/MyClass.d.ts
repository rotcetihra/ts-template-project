import { type MyContract, type DoSomethingResult } from '@/index.js';
/**
 * Пакет с примерами документации.
 *
 * @packageDocumentation
 * @category Документация
 * @remarks
 * Набор примеров для проверки TypeDoc. Это учебный модуль, не предназначен для промышленной эксплуатации.
 *
 * @since 0.1.0
 * @author
 * Arhitector
 */
/**
 * Класс `MyClass` реализует {@link MyContract}.
 *
 * @remarks
 * Полигон для демонстрации большинства тегов TypeDoc и базовых приёмов проектирования API.
 *
 * @example
 * ```ts
 * const instance = new MyClass();
 * console.log(instance.property); // "value"
 * ```
 *
 * @category Примеры классов
 * @see {@link MyContract}
 * @since 0.1.0
 * @sealed
 * @class
 */
declare class MyClass implements MyContract {
    /**
     * Версия класса.
     *
     * @public
     * @readonly
     * @defaultValue "1.0.0"
     * @since 0.1.0
     */
    static readonly VERSION: "1.0.0";
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
     * @param data Объект частично совместимый с {@link MyContract}.
     * @returns Экземпляр {@link MyClass}.
     * @throws {MyClassValidationError} Если данные некорректны.
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
     * @param value Любое значение.
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
    get property(): string;
    /**
     * Устанавливает значение {@link MyClass.property | property} с базовой валидацией.
     * @throws {MyClassValidationError} Если передано пустое значение.
     */
    set property(val: string);
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
     * Создаёт новый экземпляр {@link MyClass}.
     *
     * @param init Необязательная инициализация совместимая с {@link MyContract}.
     * @example
     * ```ts
     * const a = new MyClass();
     * const b = new MyClass({ property: "custom" });
     * ```
     */
    constructor(init?: Partial<MyContract>);
    /**
     * Выполняет действие.
     *
     * @public
     * @param param1 Строковый параметр.
     * @param param2 Числовой параметр.
     * @returns Объект с параметрами.
     * @throws {MyClassValidationError} Если параметры некорректны.
     *
     * @remarks
     * Основной метод для демонстрации параметров и возвращаемого значения.
     *
     * @example
     * ```ts
     * const r = new MyClass().doSomething("foo", 42);
     * // r: { param1: "foo", param2: 42 }
     * ```
     *
     * @category Методы
     * @since 0.1.0
     */
    doSomething(param1: string, param2: number): DoSomethingResult;
    /**
     * Метод с перегрузками.
     *
     * @remarks
     * Демонстрация перегрузок и корректной сигнатуры реализации.
     *
     * @overload
     * @param a Строка.
     * @returns Число.
     *
     * @overload
     * @param a Число.
     * @returns Строка.
     */
    overloaded(a: string): number;
    overloaded(a: number): string;
    /**
     * Возвращает первый элемент массива.
     *
     * @template T Тип элементов массива.
     * @param items Входной массив.
     * @returns Первый элемент массива или `undefined`, если массив пуст.
     * @example
     * ```ts
     * new MyClass().firstItem([1,2,3]); // 1
     * new MyClass().firstItem([]);      // undefined
     * ```
     */
    firstItem<T>(items: T[]): T | undefined;
    /**
     * Преобразует состояние экземпляра в объект {@link MyContract}.
     *
     * @public
     * @returns Плоский объект, совместимый с контрактом.
     * @since 0.5.0
     */
    toJSON(): MyContract;
    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    oldMethod(): void;
    /**
     * Метод помечен как виртуальный (для демонстрации тега).
     *
     * @virtual
     */
    virtualMethod(): void;
}
export default MyClass;
//# sourceMappingURL=MyClass.d.ts.map