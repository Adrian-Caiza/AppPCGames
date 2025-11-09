// src/presentation/hooks/useAuthViewModel.ts

import { useState, useEffect } from 'react';
import { User } from '../../domain/entities/User';
import { injector } from '../../core/injector/Injector';

/**
 * Hook central de autenticación (Auth View Model).
 * Maneja el estado global del usuario y las interacciones de autenticación.
 */
export function useAuthViewModel() {
    // El usuario autenticado (null si no hay sesión)
    const [user, setUser] = useState<User | null>(null);
    // Indica si el estado de autenticación inicial está siendo cargado (al inicio de la app)
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    // Indica si una operación (login, register) está en curso
    const [isOperationLoading, setIsOperationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Lógica de Observación de Estado de Firebase ---
    useEffect(() => {
        // Obtenemos el repositorio de Auth para suscribirnos a los cambios
        const unsubscribe = injector.authRepository.onAuthStateChanged(currentUser => {
            setUser(currentUser);
            setIsInitialLoading(false);
        });

        // La función retornada se ejecuta cuando el componente (o hook) se desmonta
        return unsubscribe;
    }, []);
    // --- Fin de Lógica de Observación ---

    // --- Operaciones ---

    const signIn = async (email: string, password: string) => {
        setIsOperationLoading(true);
        setError(null);
        try {
            // Llama al Caso de Uso de Dominio
            const newUser = await injector.signInUserUseCase.execute(email, password);
            // El estado 'user' se actualizará automáticamente por el 'onAuthStateChanged'
            // setUser(newUser); // Esto es redundante, pero posible si no se usa onAuthStateChanged
            return newUser; 
        } catch (err: any) {
            const message = err.message.includes('auth/wrong-password') 
                ? 'Credenciales incorrectas.'
                : err.message.includes('auth/user-not-found') 
                ? 'Usuario no encontrado.'
                : 'Fallo al iniciar sesión.';
            setError(message);
        } finally {
            setIsOperationLoading(false);
        }
    };
    
    const register = async (email: string, password: string) => {
        setIsOperationLoading(true);
        setError(null);
        try {
            // El Caso de Uso de Registro también necesita ser implementado en el Dominio/Injector
            const newUser = await injector.registerUserUseCase.execute(email, password);
            return newUser;
        } catch (err: any) {
            const message = err.message.includes('auth/email-already-in-use') 
                ? 'El correo ya está en uso.'
                : 'Fallo al registrar el usuario.';
            setError(message);
        } finally {
            setIsOperationLoading(false);
        }
    };

    const signOut = async () => {
        setError(null);
        try {
            await injector.authRepository.signOut();
            // setUser(null); // 'onAuthStateChanged' se encarga de esto
        } catch (err: any) {
            setError('Fallo al cerrar sesión.');
        }
    };

    return {
        user,
        isInitialLoading,
        isOperationLoading,
        error,
        signIn,
        register,
        signOut,
        setError // Permite a la UI limpiar el error
    };
}