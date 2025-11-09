// src/data/datasources/dtos/GameSearchDto.ts

/**
 * Define la estructura EXACTA del JSON devuelto por el endpoint /games de CheapShark API.
 */
export interface GameSearchDto {
    gameID: string;
    steamAppID: string | null;
    cheapest: string; // Precio más barato actual (como string)
    external: string; // Título del juego
    thumb: string;
}