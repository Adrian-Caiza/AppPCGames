// src/data/mappers/DealMapper.ts

import { DealDto } from '../dtos/DealDto';
import { Deal } from '../../domain/entities/Deal';
import { CHEAPSHARK_REDIRECT_URL } from '../../core/constants/api'; // Necesitamos crear este archivo de constantes

/**
 * Convierte un DealDto (objeto crudo de la API) a una Entidad Deal del Dominio.
 *
 * @param dto El objeto DealDto de la API.
 * @returns La entidad Deal limpia.
 */
export function dealDtoToEntity(dto: DealDto): Deal {
    // La API de CheapShark requiere que construyamos la URL de redirección
    // usando la 'dealID' y una URL base para que ellos puedan rastrear las compras.
    const redirectLink = `${CHEAPSHARK_REDIRECT_URL}?dlid=${dto.dealID}`;

    return {
        dealID: dto.dealID,
        title: dto.title,
        // Conversión crucial: Los precios vienen como string y los convertimos a number.
        salePrice: parseFloat(dto.salePrice),
        normalPrice: parseFloat(dto.normalPrice),
        // Conversión crucial: El ahorro viene como string.
        savings: parseFloat(dto.savings), 
        storeID: dto.storeID,
        link: redirectLink,
        thumb: dto.thumb,
        gameID: dto.gameID,
    };
}