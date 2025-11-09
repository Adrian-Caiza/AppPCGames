// src/presentation/hooks/useStoresViewModel.ts

import { useState, useEffect } from 'react';
import { Store } from '../../domain/entities/Store';
import { injector } from '../../core/injector/Injector';

export function useStoresViewModel() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStores = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Llamada al Caso de Uso de Dominio
            const storesList = await injector.getStoresUseCase.execute();
            setStores(storesList);
        } catch (err) {
            console.error("Error loading stores:", err);
            setError('No se pudo cargar la lista de tiendas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    // Función auxiliar para obtener el nombre de la tienda por su ID
    const getStoreName = (storeID: string): string => {
        const store = stores.find(s => s.storeID === storeID);
        return store ? store.storeName : 'Tienda Desconocida';
    };
    
    // Función auxiliar para obtener el logo de la tienda por su ID
    const getStoreIcon = (storeID: string): string | undefined => {
        const store = stores.find(s => s.storeID === storeID);
        return store ? store.iconUrl : undefined;
    };


    return {
        stores,
        isLoading,
        error,
        getStoreName,
        getStoreIcon,
        reloadStores: loadStores,
    };
}