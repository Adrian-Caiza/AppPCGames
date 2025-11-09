import { User } from "../entities/User";
export interface IAuthRepository {// Registrar nuevo usuario con datos adicionales   
    register(     
        email: string,     
        password: string,     
        displayName: string 
    ): Promise<User>;

    // Iniciar sesión   
    signIn(email: string, password: string): Promise<User>;  

    // Cerrar sesión   
    signOut(): Promise<void>; 

    // Registra un nuevo usuario
    register(email: string, password: string): Promise<User>;

    // Obtener usuario actualmente autenticado   
    getCurrentUser(): Promise<User | null>; 

    // Escuchar cambios de autenticación (observer pattern) 
    onAuthStateChanged(callback: (user: User | null) => void): () => void;
} 
