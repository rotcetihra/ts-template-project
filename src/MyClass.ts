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
    // ------------------------------ СТАТИКА ------------------------------

    /**
     * Версия класса.
     *
     * @public
     * @readonly
     * @defaultValue "1.0.0"
     * @since 0.1.0
     */
    public static readonly VERSION: string = '1.0.0';

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
    public static createDefault(): MyClass {
        return new MyClass();
    }

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
    public static fromJSON(data: Partial<MyContract>): MyClass {
        if (!data || typeof data.property !== 'string') {
            throw new TypeError('Invalid data for MyClass.fromJSON');
        }
        const inst = new MyClass();
        inst.property = data.property;
        return inst;
    }

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
    public static isMyContract(value: unknown): value is MyContract {
        const v = value as MyContract;
        return (
            !!v &&
            typeof v === 'object' &&
            typeof v.property === 'string' &&
            typeof v.doSomething === 'function'
        );
    }

    /**
     * Устаревшая фабрика.
     *
     * @public
     * @deprecated Используйте {@link MyClass.createDefault} или {@link MyClass.fromJSON}.
     * @returns Экземпляр {@link MyClass}.
     */
    public static create(): MyClass {
        return new MyClass();
    }

    // --------------------------- ЭКЗЕМПЛЯР: СВОЙСТВА ---------------------------

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
    public property: string = 'value';

    /**
     * Старое свойство.
     *
     * @deprecated Используйте {@link property}.
     * @internal
     */
    public legacyProperty: number = 123;

    /**
     * Приватное поле.
     *
     * @private
     */
    private secret: string = 'hidden';

    /**
     * Защищённое поле.
     *
     * @protected
     */
    protected flag: boolean = true;

    // ---------------------------- ЭКЗЕМПЛЯР: МЕТОДЫ ----------------------------

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
    public doSomething(param1: string, param2: number): object {
        return { param1, param2 };
    }

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
    overloaded(a: string | number): string | number {
        return typeof a === 'string' ? a.length : a.toString();
    }

    /**
     * Генерик-метод.
     *
     * @template T Тип элементов массива.
     * @param items - Входной массив.
     * @returns Первый элемент массива.
     */
    public firstItem<T>(items: T[]): T {
        return items[0] as T;
    }

    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    public oldMethod(): void {
        // ...
    }

    /**
     * Псевдо-виртуальный метод (для демонстрации тега).
     *
     * @virtual
     */
    public virtualMethod(): void {
        // ...
    }

    /**
     * Внутренний помощник.
     *
     * @internal
     */
    internalHelper(): void {
        // ...
    }
}

/**
 * Абстрактная база.
 *
 * @abstract
 * @category Абстракции
 */
export abstract class AbstractBase {
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
export class Extended extends MyClass {
    /**
     * Переопределённый метод.
     *
     * @override
     */
    public doSomething(param1: string, param2: number): object {
        return { p1: param1, p2: param2 };
    }
}
