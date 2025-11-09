// src/domain/usecases/SignInUser.ts

import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class SignInUser {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    execute(email: string, password: string): Promise<User> {
        // Validación de negocio antes de llamar al repositorio:
        if (!email || !password) {
            throw new Error("El correo y la contraseña son requeridos.");
        }
        return this.repository.signIn(email, password);
    }
}