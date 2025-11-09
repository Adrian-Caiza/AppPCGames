// src/data/mappers/UserMapper.ts

import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../../domain/entities/User';

/**
 * Convierte un objeto Firebase User a una Entidad User de Dominio.
 */
export function firebaseUserToEntity(firebaseUser: FirebaseUser): User {
    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || '',
        createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
    };
}