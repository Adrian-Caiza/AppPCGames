// src/data/repositories/GameRepositoryImpl.ts

import { IGameRepository } from '../../domain/repositories/IGameRepository';
import { Deal } from '../../domain/entities/Deal';
import { CheapSharkApiDataSource } from '../datasources/CheapSharkApiDataSource';
import { dealDtoToEntity } from '../mappers/dealMapper';
import { Store } from '../../domain/entities/Store'; 
import { Game } from '../../domain/entities/Game'; 
import { storeDtoToEntity } from '../mappers/StoreMapper'; 
import { gameSearchDtoToDealEntity } from '../mappers/GameSearchMapper'; 


/**
 * Implementación concreta de IGameRepository.
 * Aquí se maneja la lógica de la fuente de datos (DataSource) y se traduce
 * la respuesta al formato del Dominio usando Mappers.
 */
export class GameRepositoryImpl implements IGameRepository {
    
    // Inyección de Dependencia (a través del constructor)
    // Esto hace que el repositorio sea reusable y testeable.
    private readonly dataSource: CheapSharkApiDataSource;

    constructor(dataSource: CheapSharkApiDataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Implementa el método de la interfaz para obtener las ofertas.
     */
    public async getLatestDeals(): Promise<Deal[]> {
        try {
            // 1. Obtener los DTOs de la API
            const dealDtos = await this.dataSource.getDeals();

            // 2. Mapear cada DTO a nuestra Entidad de Dominio Deal
            const deals = dealDtos.map(dealDtoToEntity);

            // 3. Devolver el array de Entidades
            return deals;

        } catch (error) {
            
            console.error("Error en GameRepositoryImpl.getLatestDeals:", error);
            throw error; 
        }
    }

    /**
     * Implementa la búsqueda de juegos.
     */
    public async searchGame(title: string): Promise<Deal[]> {
        try {
            // 1. Obtener los DTOs de la búsqueda
            const searchDtos = await this.dataSource.searchGames(title);

            // 2. Mapear cada DTO a nuestra Entidad de Dominio Deal
            // (Ya que queremos presentar resultados de búsqueda como una lista de "ofertas")
            const deals = searchDtos.map(gameSearchDtoToDealEntity); 

            return deals;

        } catch (error) {
            console.error("Error en GameRepositoryImpl.searchGame:", error);
            throw error;
        }
    }
    
    /**
     * Implementa la obtención de la lista de tiendas.
     */
    public async getStores(): Promise<Store[]> {
        try {
            // 1. Obtener los DTOs de la API
            const storeDtos = await this.dataSource.getStores();

            // 2. Mapear cada DTO a nuestra Entidad de Dominio Store
            const stores = storeDtos.map(storeDtoToEntity);
            
            return stores;
            
        } catch (error) {
            console.error("Error en GameRepositoryImpl.getStores:", error);
            throw error;
        }
    }

    
}