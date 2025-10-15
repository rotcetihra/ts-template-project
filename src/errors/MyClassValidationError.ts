// src/errors/MyClassValidationError.ts

/**
 * Ошибка валидации входных данных для {@link MyClass}.
 *
 * @public
 * @since 0.5.0
 */
class MyClassValidationError extends TypeError {
    /**
     * Создаёт ошибку валидации.
     * @param message Сообщение об ошибке
     */
    constructor(message: string) {
        super(message);
        this.name = 'MyClassValidationError';
    }
}

export default MyClassValidationError;
