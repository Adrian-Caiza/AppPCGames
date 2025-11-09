// src/domain/entities/Deal.ts

/**
 * Define la estructura de una Oferta de Juego (Deal) en nuestra aplicación.
 * Esta entidad es PURA y no debe depender de la estructura JSON de la API.
 */
export interface Deal {
    /** ID único de la oferta (diferente al ID del juego). */
    dealID: string;

    /** Título del juego. */
    title: string;

    /** Precio actual de la oferta. */
    salePrice: number;

    /** Precio normal del juego. */
    normalPrice: number;

    /** El mejor precio histórico conocido. */
    savings: number;

    /** ID de la tienda donde se encuentra la oferta. */
    storeID: string;
    
    /** Enlace completo para redirigir a la compra (generado al mapear). */
    link: string;
    
    /** Imagen de la carátula del juego. */
    thumb: string;
    
    /** ID único del juego (propio de CheapShark). */
    gameID: string;
}