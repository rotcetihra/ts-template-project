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
export default class MyClass {
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
     * @param data - Объект частично совместимый с {@link MyContract}.
     * @returns Экземпляр {@link MyClass}.
     * @throws {TypeError} Если данные некорректны.
     * @example
     * ```ts
     * const inst = MyClass.fromJSON({ property: "x", doSomething(){} });
     * ```
     */
    static fromJSON(data) {
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
    static isMyContract(value) {
        const v = value;
        return (!!v &&
            typeof v === 'object' &&
            typeof v.property === 'string' &&
            typeof v.doSomething === 'function');
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
     * Реализация свойства из {@link MyContract}.
     *
     * @public
     * @defaultValue "value"
     * @example
     * ```ts
     * new MyClass().property; // "value"
     * ```
     */
    property = 'value';
    /**
     * Старое свойство.
     *
     * @deprecated Используйте {@link property}.
     * @internal
     */
    legacyProperty = 123;
    /**
     * Приватное поле.
     *
     * @private
     */
    secret = 'hidden';
    /**
     * Защищённое поле.
     *
     * @protected
     */
    flag = true;
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
    doSomething(param1, param2) {
        return { param1, param2 };
    }
    overloaded(a) {
        return typeof a === 'string' ? a.length : a.toString();
    }
    /**
     * Генерик-метод.
     *
     * @template T Тип элементов массива.
     * @param items - Входной массив.
     * @returns Первый элемент массива.
     */
    firstItem(items) {
        return items[0];
    }
    /**
     * Устаревший метод.
     *
     * @deprecated Используйте {@link doSomething}.
     */
    oldMethod() {
        // ...
    }
    /**
     * Псевдо-виртуальный метод (для демонстрации тега).
     *
     * @virtual
     */
    virtualMethod() {
        // ...
    }
    /**
     * Внутренний помощник.
     *
     * @internal
     */
    internalHelper() {
        // ...
    }
}
/**
 * Абстрактная база.
 *
 * @abstract
 * @category Абстракции
 */
export class AbstractBase {
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
    doSomething(param1, param2) {
        return { p1: param1, p2: param2 };
    }
}
//# sourceMappingURL=MyClass.mjs.map