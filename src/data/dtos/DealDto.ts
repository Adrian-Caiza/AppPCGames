// src/data/datasources/dtos/DealDto.ts

/**
 * Define la estructura EXACTA del JSON devuelto por el endpoint /deals de CheapShark API.
 */
export interface DealDto {
    gameID: string;
    steamAppID: string | null;
    /** ID de la oferta */
    dealID: string;
    /** Ahorro en porcentaje */
    savings: string; 
    /** Precio actual de venta */
    salePrice: string; 
    /** Precio normal (MSRP) */
    normalPrice: string;
    /** Enlace de redirección para la compra. */
    dealRating: string;
    thumb: string;
    title: string;
    storeID: string;
}