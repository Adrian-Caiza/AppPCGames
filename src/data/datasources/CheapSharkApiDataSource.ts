// src/data/datasources/CheapSharkApiDataSource.ts

import { CHEAPSHARK_API_URL } from '../../core/constants/api';
import { DealDto } from '../dtos/DealDto';
import { StoreDto } from '../dtos/StoreDto'; // Nuevo DTO
import { GameSearchDto } from '../dtos/GameSearchDto'; // Nuevo DTO
/**
 * Clase que maneja la comunicación directa con la API de CheapShark.
 * Responsable de las llamadas HTTP y el manejo de errores básicos de red.
 */
export class CheapSharkApiDataSource {
    
    // Método para obtener las últimas ofertas (GET /deals)
    public async getDeals(): Promise<DealDto[]> {
        const url = `${CHEAPSHARK_API_URL}/deals?sortBy=recent&pageSize=30`; // Endpoint 1
        
        try {
            const response = await fetch(url);

            if (!response.ok) {
                // Lanza un error si la respuesta HTTP no es exitosa (ej. 404, 500)
                throw new Error(`Error en la API de CheapShark: ${response.status} ${response.statusText}`);
            }

            // El cuerpo de la respuesta es un array de DealDto
            const data: DealDto[] = await response.json();
            return data;
            
        } catch (error) {
            console.error("Error al obtener ofertas de CheapShark:", error);
            // Propagamos un error genérico o específico de dominio para que el Repositorio lo maneje
            throw new Error('No se pudo conectar con el servicio de ofertas de juegos.');
        }
    }
    
    public async searchGames(title: string): Promise<GameSearchDto[]> {
        // Codificamos el título para ser seguro en URL
        const encodedTitle = encodeURIComponent(title);
        const url = `${CHEAPSHARK_API_URL}/games?title=${encodedTitle}`; 

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al buscar juegos: ${response.status}`);
        }
        const data: GameSearchDto[] = await response.json();
        return data;
    }

    // Endpoint 3: Obtener la lista de tiendas (GET /stores)
    public async getStores(): Promise<StoreDto[]> {
        const url = `${CHEAPSHARK_API_URL}/stores`; // Endpoint 3

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error al obtener tiendas: ${response.status}`);
        }
        const data: StoreDto[] = await response.json();
        return data;
    }
    
}