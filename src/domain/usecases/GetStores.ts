// src/domain/usecases/GetStores.ts

import { Store } from '../entities/Store';
import { IGameRepository } from '../repositories/IGameRepository';

export class GetStores {
    private readonly repository: IGameRepository;

    constructor(repository: IGameRepository) {
        this.repository = repository;
    }

    async execute(): Promise<Store[]> {
        // Lógica para filtrar tiendas inactivas si se desea, etc.
        const stores = await this.repository.getStores();
        return stores.filter(store => store.isActive); // Ejemplo de regla de negocio
    }
}