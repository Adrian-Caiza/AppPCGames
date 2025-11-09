// src/domain/entities/Store.ts

/**
 * Representa una tienda de juegos digital.
 */
export interface Store {
    storeID: string;
    storeName: string;
    isActive: boolean;
    // La API también da un ícono/logo, podríamos incluirlo
    iconUrl: string;
}