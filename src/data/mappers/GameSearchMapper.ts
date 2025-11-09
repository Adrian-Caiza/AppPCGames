// src/data/mappers/GameSearchMapper.ts

import { GameSearchDto } from '../dtos/GameSearchDto';
import { Deal } from '../../domain/entities/Deal';
import { CHEAPSHARK_REDIRECT_URL } from '../../core/constants/api';

/**
 * Nota: El endpoint /games devuelve una lista de juegos, no de ofertas.
 * Para simplificar, mapearemos este resultado a una lista de ofertas (Deal)
 * ya que CheapShark presenta el juego y su precio más bajo.
 */
export function gameSearchDtoToDealEntity(dto: GameSearchDto): Deal {
    // Al no tener un dealID específico, creamos uno temporal o usamos un enlace genérico.
    // Usaremos el gameID como base y un valor predeterminado para el enlace.

    return {
        gameID: dto.gameID,
        title: dto.external, // El título del juego en este DTO es 'external'
        salePrice: parseFloat(dto.cheapest),
        normalPrice: 0, // No disponible en este endpoint, usamos 0.
        savings: 0,     // No disponible en este endpoint, usamos 0.
        storeID: '0',   // No disponible en este endpoint, usamos '0' o null.
        // Creamos un enlace genérico de búsqueda o dejamos que la lógica posterior lo genere.
        link: `${CHEAPSHARK_REDIRECT_URL}?dlid=${dto.gameID}`, 
        thumb: dto.thumb,
        dealID: `SEARCH-${dto.gameID}`
    };
}