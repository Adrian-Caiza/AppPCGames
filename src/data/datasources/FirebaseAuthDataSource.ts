// src/data/datasources/FirebaseAuthDataSource.ts

import { auth } from '../../../FirebaseConfig';
import { UserCredential, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

/**
 * Clase que maneja las interacciones directas con Firebase Auth SDK.
 */
export class FirebaseAuthDataSource {
    
    // Iniciar Sesión
    async signIn(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Registrar Usuario
    async register(email: string, password: string): Promise<UserCredential> {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // Cerrar Sesión
    async signOut(): Promise<void> {
        return signOut(auth);
    }

    // Observar el estado de Auth
    onAuthStateChanged(callback: (user: UserCredential['user'] | null) => void): () => void {
        return onAuthStateChanged(auth, callback as any);
    }
}