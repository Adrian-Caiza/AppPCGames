// src/presentation/hooks/useDealsViewModel.ts

import { useState, useEffect } from 'react';
import { Deal } from '../../domain/entities/Deal';
import { injector } from '../../core/injector/Injector';

/**
 * Hook personalizado que actúa como el View Model para la pantalla de Ofertas.
 * - Gestiona el estado de carga y error.
 * - Llama al Caso de Uso de Dominio.
 */
export function useDealsViewModel() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadDeals = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Acceder al Caso de Uso a través del Inyector
            const dealsList = await injector.getLatestDealsUseCase.execute();
            
            // 2. Actualizar el estado de la UI
            setDeals(dealsList);

        } catch (err) {
            console.error(err);
            // 3. Manejar error
            setError('Error al cargar las ofertas. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDeals();
    }, []);

    // Se expone el estado y las funciones que la vista necesita
    return {
        deals,
        isLoading,
        error,
        reloadDeals: loadDeals,
    };
}