// src/domain/entities/Game.ts

/**
 * Representa un Juego. Se usa para la funcionalidad de búsqueda.
 */
export interface Game {
    gameID: string;
    title: string;
    steamAppID: string;
    thumb: string;
    // Opcionalmente, puedes añadir más campos de la API de búsqueda si son necesarios
}