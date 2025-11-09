// src/domain/usecases/GetLatestDeals.ts

import { Deal } from '../entities/Deal';
import { IGameRepository } from '../repositories/IGameRepository';

/**
 * Caso de Uso que encapsula la lógica para obtener las últimas ofertas de juegos.
 * Esta clase es el punto de entrada desde la capa de Presentación.
 */
export class GetLatestDeals {
    
    // El Caso de Uso requiere la interfaz del Repositorio (Inyección de Dependencia)
    private readonly repository: IGameRepository;

    constructor(repository: IGameRepository) {
        this.repository = repository;
    }

    /**
     * El método principal del Caso de Uso.
     * @returns Una promesa que resuelve con un array de entidades Deal.
     */
    async execute(): Promise<Deal[]> {
        // Toda la lógica de negocio iría aquí, si la hubiera (ej. filtrar por región,
        // aplicar un descuento especial, ordenar, etc.)

        // Por ahora, simplemente llamamos al repositorio para obtener los datos
        return this.repository.getLatestDeals();
    }
}