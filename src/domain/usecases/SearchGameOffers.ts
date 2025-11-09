// src/domain/usecases/SearchGameOffers.ts

import { Deal } from '../entities/Deal';
import { IGameRepository } from '../repositories/IGameRepository';

export class SearchGameOffers {
    private readonly repository: IGameRepository;

    constructor(repository: IGameRepository) {
        this.repository = repository;
    }

    async execute(title: string): Promise<Deal[]> {
        // Lógica de negocio antes de la búsqueda (ej. sanitizar input)
        if (!title || title.length < 3) {
            return Promise.resolve([]);
        }
        return this.repository.searchGame(title);
    }
}