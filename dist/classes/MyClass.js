// src/classes/MyClass.ts
import { MyClassValidationError } from '@/index.js';
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
class MyClass {
    // ------------------------------ СТАТИКА ------------------------------
    /**
     * Версия класса.
     *
     * @public
     * @readonly
     * @defaultValue "1.0.0"
     * @since 0.1.0
     */
    static VERSION = '1.0.0';
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
    static createDefault() {
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
    static fromJSON(data) {
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
    static isMyContract(value) {
        const v = value;
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
    static create() {
        return new MyClass();
    }
    // --------------------------- ЭКЗЕМПЛЯР: СВОЙСТВА ---------------------------
    /**
     * Закрытое хранилище значения {@link MyClass.property | property}.
     * @internal
     */
    _property = 'value';
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
    get property() {
        return this._property;
    }
    /**
     * Устанавливает значение {@link MyClass.property | property} с базовой валидацией.
     * @throws {MyClassValidationError} Если передано пустое значение.
     */
    set property(val) {
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
    legacyProperty = 123;
    /**
     * Защищённое поле.
     *
     * @protected
     */
    flag = true;
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
    constructor(init) {
        if (init?.property !== undefined) {
            this.property = init.property;
        }
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
    doSomething(param1, param2) {
        if (typeof param1 !== 'string' || !Number.isFinite(param2)) {
            throw new MyClassValidationError(
                'Invalid arguments for doSomething',
            );
        }
        return { param1, param2 };
    }
    overloaded(a) {
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
    firstItem(items) {
        return items[0];
    }
    /**
     * Преобразует состояние экземпляра в объект {@link MyContract}.
     *
     * @public
     * @returns Плоский объект, совместимый с контрактом.
     * @since 0.5.0
     */
    toJSON() {
        return {
            property: this.property,
            // Реализация метода из контракта как заглушка
            doSomething: (p, n) => ({ param1: p, param2: n }),
        };
    }
    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    oldMethod() {
        // no-op
    }
    /**
     * Метод помечен как виртуальный (для демонстрации тега).
     *
     * @virtual
     */
    virtualMethod() {
        // no-op
    }
    /**
     * Внутренний помощник.
     *
     * @internal
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    internalHelper() {}
}
export default MyClass;
//# sourceMappingURL=MyClass.js.map
