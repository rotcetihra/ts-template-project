// tests/features/MyClass.test.ts

import { type MyContract, MyClass } from '@/index.js';
import { test, expect, describe } from '@jest/globals';

describe('MyClass | features (behavior-level)', () => {
    test('создание по умолчанию: значение по умолчанию и базовые методы работают', () => {
        const instance = MyClass.createDefault();
        expect(instance).toBeInstanceOf(MyClass);
        expect(instance.property).toBe('value');

        const r = instance.doSomething('foo', 42);
        expect(r).toEqual({ param1: 'foo', param2: 42 });
    });

    test('создание из JSON-данных: корректно инициализирует состояние', () => {
        const data: Partial<MyContract> = {
            property: 'x',
            // заглушка, чтобы соответствовать контракту
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            doSomething() {},
        } as unknown as MyContract;

        const inst = MyClass.fromJSON(data);
        expect(inst.property).toBe('x');
    });

    test('перегрузки: строка → число длины, число → строка', () => {
        const inst = new MyClass();
        expect(inst.overloaded('abcd')).toBe(4);
        expect(inst.overloaded(123)).toBe('123');
    });

    test('firstItem<T>() возвращает первый элемент или undefined', () => {
        const inst = new MyClass();
        expect(inst.firstItem([1, 2, 3])).toBe(1);
        expect(inst.firstItem<string>([])).toBeUndefined();
    });

    test('toJSON(): отдает совместимый с MyContract объект, который ведет себя корректно', () => {
        const inst = new MyClass({ property: 'p' });
        const json = inst.toJSON();

        // жизненный сценарий: «вызвал метод из сериализованного контракта»
        const r = json.doSomething('a', 1);
        expect(r).toEqual({ param1: 'a', param2: 1 });
        expect(json.property).toBe('p');
    });
});
