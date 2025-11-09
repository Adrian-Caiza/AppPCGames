// src/domain/usecases/RegisterUser.ts

import { User } from '../entities/User';
import { IAuthRepository } from '../repositories/IAuthRepository';

export class RegisterUser {
    private readonly repository: IAuthRepository;

    constructor(repository: IAuthRepository) {
        this.repository = repository;
    }

    async execute(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new Error("El correo y la contraseña son requeridos.");
        }
        return this.repository.register(email, password);
    }
}
