// src/data/datasources/dtos/StoreDto.ts

/**
 * Define la estructura EXACTA del JSON devuelto por el endpoint /stores de CheapShark API.
 */
export interface StoreDto {
    storeID: string;
    storeName: string;
    isActive: number; // La API lo devuelve como un número (0 o 1)
    images: {
        banner: string;
        logo: string;
        icon: string; // Usaremos este para el icono.
    };
}