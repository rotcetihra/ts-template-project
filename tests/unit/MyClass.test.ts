// tests/unit/MyClass.test.ts

import { type MyContract, MyClassValidationError, MyClass } from '@/index.js';
import { test, describe, expect } from '@jest/globals';

describe('MyClass | unit', () => {
    // ---------- статические ----------

    test('static VERSION — строка с ожидаемым значением', () => {
        expect(typeof MyClass.VERSION).toBe('string');
        expect(MyClass.VERSION).toBe('1.0.0');
    });

    test('static createDefault() — возвращает экземпляр', () => {
        const v = MyClass.createDefault();
        expect(v).toBeInstanceOf(MyClass);
        expect(v.property).toBe('value');
    });

    test('static fromJSON(): валидные/невалидные данные', () => {
        const good = MyClass.fromJSON({
            property: 'ok',
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            doSomething() {},
        } as unknown as MyContract);
        expect(good.property).toBe('ok');

        expect(() => MyClass.fromJSON(null as unknown as MyContract)).toThrow(
            MyClassValidationError,
        );
        expect(() =>
            MyClass.fromJSON({ property: 123 } as unknown as MyContract),
        ).toThrow(MyClassValidationError);
    });

    test('static isMyContract(): положительные и отрицательные кейсы', () => {
        const ok: MyContract = {
            property: 'p',
            doSomething(p: string, n: number) {
                return { param1: p, param2: n };
            },
        };
        const noMethod = { property: 'p' };
        const noProp = {
            doSomething() {
                return false;
            },
        };
        const wrong = 42;

        expect(MyClass.isMyContract(ok)).toBe(true);
        expect(MyClass.isMyContract(noMethod)).toBe(false);
        expect(MyClass.isMyContract(noProp)).toBe(false);
        expect(MyClass.isMyContract(wrong)).toBe(false);
    });

    test('static create() — legacy фабрика (помечена deprecated), но работает', () => {
        const inst = MyClass.create();
        expect(inst).toBeInstanceOf(MyClass);
    });

    // ---------- экземпляр: свойства ----------

    test('property getter/setter: успешная установка и ошибки валидации', () => {
        const inst = new MyClass();

        // get по умолчанию
        expect(inst.property).toBe('value');

        // ok
        inst.property = 'hello';
        expect(inst.property).toBe('hello');

        // bad: пустая строка
        expect(() => {
            inst.property = '';
        }).toThrow(MyClassValidationError);

        // bad: не строка
        expect(() => {
            // @ts-expect-error намеренно ломаем типы для рантайм-проверки
            inst.property = 123;
        }).toThrow(MyClassValidationError);
    });

    // ---------- экземпляр: методы ----------

    test('doSomething(): валидные → объект, невалидные → MyClassValidationError', () => {
        const inst = new MyClass();
        expect(inst.doSomething('foo', 42)).toEqual({
            param1: 'foo',
            param2: 42,
        });

        expect(() =>
            // @ts-expect-error рантайм-валидация строки
            inst.doSomething(0, 1),
        ).toThrow(MyClassValidationError);

        expect(() => inst.doSomething('x', Number.NaN)).toThrow(
            MyClassValidationError,
        );
    });

    test('overloaded(): соблюдает контракт перегрузок', () => {
        const inst = new MyClass();
        const r1 = inst.overloaded('xyz');
        expect(r1).toBe(3);
        const r2 = inst.overloaded(9000);
        expect(r2).toBe('9000');
    });

    test('firstItem<T>(): generic корректно выводит тип и возвращает значение', () => {
        const inst = new MyClass();
        const a = inst.firstItem([true, false]);
        expect(a).toBe(true);

        const none = inst.firstItem<number>([]);
        expect(none).toBeUndefined();
    });

    test('toJSON(): форма совместима с MyContract, включая callable doSomething', () => {
        const inst = new MyClass({ property: 'pp' });
        const json = inst.toJSON();

        expect(json.property).toBe('pp');
        const out = json.doSomething('k', 7);
        expect(out).toEqual({ param1: 'k', param2: 7 });
    });
});
