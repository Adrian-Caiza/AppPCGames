// src/domain/repositories/IGameRepository.ts

import { Deal } from '../entities/Deal';
import { Store } from '../entities/Store';

/**
 * IGameRepository define la interfaz para obtener datos relacionados con juegos y ofertas.
 * La capa de Dominio SOLO conoce esta interfaz.
 */
export interface IGameRepository {

    /**
     * @returns Una promesa que resuelve con un array de las ofertas más recientes.
     */
    getLatestDeals(): Promise<Deal[]>;

    /**
     * Busca ofertas por título de juego.
     * @param title El título del juego a buscar.
     * @returns Una promesa que resuelve con un array de ofertas relacionadas.
     */
    searchGame(title: string): Promise<Deal[]>;
    
    /**
     * @returns Una promesa que resuelve con un array de todas las tiendas soportadas.
     */
    getStores(): Promise<Store[]>;
}