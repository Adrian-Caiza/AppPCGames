// src/data/repositories/AuthRepositoryImpl.ts

import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import { FirebaseAuthDataSource } from '../datasources/FirebaseAuthDataSource';
import { firebaseUserToEntity } from '../mappers/UserMapper';

export class AuthRepositoryImpl implements IAuthRepository {
    private readonly dataSource: FirebaseAuthDataSource;

    constructor(dataSource: FirebaseAuthDataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Implementa el inicio de sesión.
     */
    async signIn(email: string, password: string): Promise<User> {
        try {
            const credential = await this.dataSource.signIn(email, password);
            // Mapeamos el objeto Firebase User a nuestra Entidad User de Dominio
            return firebaseUserToEntity(credential.user);
        } catch (error: any) {
            // Manejo de errores específicos de Firebase 
            console.error("Error al iniciar sesión:", error.code, error.message);
            // Relanzamos el error para que la capa de Presentación lo maneje
            throw new Error(`Fallo en el inicio de sesión: ${error.message}`);
        }
    }

    /**
     * Implementa el registro de un nuevo usuario.
     */
    async register(email: string, password: string): Promise<User> {
        try {
            const credential = await this.dataSource.register(email, password);
            // Mapeamos el objeto Firebase User a nuestra Entidad User de Dominio
            return firebaseUserToEntity(credential.user);
        } catch (error: any) {
            console.error("Error al registrar:", error.code, error.message);
            throw new Error(`Fallo en el registro: ${error.message}`);
        }
    }

    /**
     * Implementa el cierre de sesión.
     */
    async signOut(): Promise<void> {
        return this.dataSource.signOut();
    }

    /**
     * Obtiene el usuario actualmente autenticado (útil para la carga inicial).
     */
    async getCurrentUser(): Promise<User | null> {
        // La implementación real de getCurrentUser a menudo depende de 'onAuthStateChanged'
        // para asegurar que la sesión esté cargada.
        // Por simplicidad, aquí usaremos una promesa que resuelve el estado actual.
        return new Promise(resolve => {
            const unsubscribe = this.dataSource.onAuthStateChanged(firebaseUser => {
                unsubscribe(); // Nos desuscribimos inmediatamente después de obtener el estado
                if (firebaseUser) {
                    resolve(firebaseUserToEntity(firebaseUser));
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Implementa el observador de cambios de estado de autenticación.
     */
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return this.dataSource.onAuthStateChanged(firebaseUser => {
            // Cuando Firebase detecta un cambio, llamamos al callback con la entidad limpia
            if (firebaseUser) {
                callback(firebaseUserToEntity(firebaseUser));
            } else {
                callback(null);
            }
        });
    }
}