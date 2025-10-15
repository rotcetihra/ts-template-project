// src/classes/MyClass.ts

import {
    type MyContract,
    type DoSomethingResult,
    MyClassValidationError,
} from '@/index.js';

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
class MyClass implements MyContract {
    // ------------------------------ СТАТИКА ------------------------------

    /**
     * Версия класса.
     *
     * @public
     * @readonly
     * @defaultValue "1.0.0"
     * @since 0.1.0
     */
    public static readonly VERSION = '1.0.0' as const;

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
     * @param data Объект частично совместимый с {@link MyContract}.
     * @returns Экземпляр {@link MyClass}.
     * @throws {MyClassValidationError} Если данные некорректны.
     * @example
     * ```ts
     * const inst = MyClass.fromJSON({ property: "x", doSomething(){} });
     * ```
     */
    public static fromJSON(data: Partial<MyContract>): MyClass {
        if (!data || typeof data.property !== 'string') {
            throw new MyClassValidationError(
                'Invalid data for MyClass.fromJSON',
            );
        }
        return new MyClass({ property: data.property });
    }

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
     * Закрытое хранилище значения {@link MyClass.property | property}.
     * @internal
     */
    private _property = 'value';

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
    public get property(): string {
        return this._property;
    }

    /**
     * Устанавливает значение {@link MyClass.property | property} с базовой валидацией.
     * @throws {MyClassValidationError} Если передано пустое значение.
     */
    public set property(val: string) {
        if (typeof val !== 'string' || val.trim() === '') {
            throw new MyClassValidationError(
                'property must be a non-empty string',
            );
        }
        this._property = val;
    }

    /**
     * Старое свойство.
     *
     * @deprecated Используйте {@link property}.
     * @internal
     */
    public legacyProperty = 123;

    /**
     * Приватное поле.
     *
     * @private
     */
    private secret = 'hidden';

    /**
     * Защищённое поле.
     *
     * @protected
     */
    protected flag = true;

    // ------------------------------ КОНСТРУКТОР ------------------------------

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
    constructor(init?: Partial<MyContract>) {
        if (init?.property !== undefined) {
            this.property = init.property;
        }

        this.secret;
    }

    // ---------------------------- ЭКЗЕМПЛЯР: МЕТОДЫ ----------------------------

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
    public doSomething(param1: string, param2: number): DoSomethingResult {
        if (typeof param1 !== 'string' || !Number.isFinite(param2)) {
            throw new MyClassValidationError(
                'Invalid arguments for doSomething',
            );
        }
        return { param1, param2 };
    }

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
    public overloaded(a: string): number;
    public overloaded(a: number): string;
    public overloaded(a: string | number): string | number {
        return typeof a === 'string' ? a.length : a.toString();
    }

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
    public firstItem<T>(items: T[]): T | undefined {
        return items[0];
    }

    /**
     * Преобразует состояние экземпляра в объект {@link MyContract}.
     *
     * @public
     * @returns Плоский объект, совместимый с контрактом.
     * @since 0.5.0
     */
    public toJSON(): MyContract {
        return {
            property: this.property,
            // Реализация метода из контракта как заглушка
            doSomething: (p: string, n: number) => ({ param1: p, param2: n }),
        } as unknown as MyContract;
    }

    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    public oldMethod(): void {
        // no-op
    }

    /**
     * Метод помечен как виртуальный (для демонстрации тега).
     *
     * @virtual
     */
    public virtualMethod(): void {
        // no-op
    }

    /**
     * Внутренний помощник.
     *
     * @internal
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    internalHelper(): void {}
    /* eslint-enable @typescript-eslint/no-empty-function */
}

export default MyClass;
