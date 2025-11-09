// src/data/mappers/StoreMapper.ts

import { StoreDto } from '../dtos/StoreDto';
import { Store } from '../../domain/entities/Store';

export function storeDtoToEntity(dto: StoreDto): Store {
    return {
        storeID: dto.storeID,
        storeName: dto.storeName,
        isActive: dto.isActive === 1, // Conversión: 1/0 a true/false
        iconUrl: `https://www.cheapshark.com${dto.images.icon}`, // URL base + ruta del ícono
    };
}