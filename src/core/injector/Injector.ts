// src/core/injector/Injector.ts

// Data
import { CheapSharkApiDataSource } from '../../data/datasources/CheapSharkApiDataSource';
import { GameRepositoryImpl } from '../../data/repositories/GameRepositoryImpl';
import { FirebaseAuthDataSource } from '../../data/datasources/FirebaseAuthDataSource';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
// Domain
import { GetLatestDeals } from '../../domain/usecases/GetLatestDeals';
import { IGameRepository } from '../../domain/repositories/IGameRepository';
import { SearchGameOffers } from '../../domain/usecases/SearchGameOffers'; // Nuevo
import { GetStores } from '../../domain/usecases/GetStores'; // Nuevo
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { SignInUser } from '../../domain/usecases/SignInUser';
import { RegisterUser } from '../../domain/usecases/RegisterUser';

// Inicializamos el DataSource de la API
const cheapSharkDataSource = new CheapSharkApiDataSource();

// Inicializamos la Implementación del Repositorio
// Aquí conectamos la implementación del Repositorio con el DataSource
const gameRepository: IGameRepository = new GameRepositoryImpl(cheapSharkDataSource);
const firebaseAuthDataSource = new FirebaseAuthDataSource();
const authRepository: IAuthRepository = new AuthRepositoryImpl(firebaseAuthDataSource);
/**
 * Clase contenedora que expone los Casos de Uso y Repositorios.
 * La Presentación solo accederá a esta clase para obtener lo que necesita.
 */
export class Injector {
    
    // Casos de Uso
    
    public get getLatestDealsUseCase(): GetLatestDeals {
        // Inicializamos el Caso de Uso, inyectando el Repositorio
        return new GetLatestDeals(gameRepository);
    }

    public get searchGameOffersUseCase(): SearchGameOffers {
        return new SearchGameOffers(gameRepository); // Nuevo
    }

    public get getStoresUseCase(): GetStores {
        return new GetStores(gameRepository); // Nuevo
    }

    // Repositorios (útil si la Presentación necesita acceder directamente a un Repositorio)
    
    public get gameRepository(): IGameRepository {
        return gameRepository;
    }
    
    // Casos de Uso de Autenticación
    public get signInUserUseCase(): SignInUser {
        return new SignInUser(authRepository);
    }
    
    public get registerUserUseCase(): RegisterUser {
        return new RegisterUser(authRepository);
    }
    
    public get authRepository(): IAuthRepository {
        return authRepository;
    }
}

// Exportamos una instancia única (Singleton) para toda la aplicación
export const injector = new Injector();