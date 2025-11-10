// app/(tabs)/search.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { Deal } from '../../src/domain/entities/Deal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { injector } from '../../src/core/injector/Injector';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useStoresViewModel } from '../../src/presentation/hooks/useStoresViewModel';
import { useDealsViewModel } from '../../src/presentation/hooks/useDealsViewModel';

// --- COMPONENTE INDIVIDUAL DE RESULTADO DE BÚSQUEDA ---
// (Este componente no cambia)
interface SearchDealItemProps {
    deal: Deal;
    getStoreIcon: (id: string) => string | undefined;
    getStoreName: (id: string) => string;
}

const SearchDealItem: React.FC<SearchDealItemProps> = ({ deal, getStoreIcon, getStoreName }) => {
    const openSearchLink = () => {
        Linking.openURL(`https://www.cheapshark.com/redirect?gameID=${deal.gameID}`);
    };
    const storeName = getStoreName(deal.storeID);

    return (
        <TouchableOpacity style={styles.dealCard} onPress={openSearchLink}>
            <Image 
                source={{ uri: deal.thumb }} 
                style={styles.thumbImage} 
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.dealTitle} numberOfLines={2}>
                    {deal.title}
                </Text>
                <Text style={styles.cheapestPrice}>
                    Precio Más Barato: 
                    <Text style={{ fontWeight: 'bold', color: '#4CAF50' }}> ${deal.salePrice.toFixed(2)}</Text>
                </Text>
                <Text style={styles.storeText}>
                    Visto en: {storeName} 
                </Text>
            </View>
            <MaterialCommunityIcons name="magnify" size={24} color="#1565C0" style={styles.linkIcon} />
        </TouchableOpacity>
    );
};


// --- PANTALLA PRINCIPAL DE BÚSQUEDA ---
export default function SearchScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    
    // 1. AÑADIMOS EL NUEVO ESTADO
    const [apiSearchPerformed, setApiSearchPerformed] = useState(false); // <- NUEVA LÍNEA

    // Cargamos los datos de las tiendas
    const { getStoreName, getStoreIcon, isLoading: isStoresLoading } = useStoresViewModel();
    // Cargamos las ofertas iniciales
    const { deals: initialDeals, isLoading: isDealsLoading, error: dealsError, reloadDeals } = useDealsViewModel();

    // Efecto para actualizar los resultados cuando las ofertas iniciales se cargan
    useEffect(() => {
        if (initialDeals.length > 0 && searchTerm.length === 0) {
            setResults(initialDeals);
        }
    }, [initialDeals]);
    
    // 2. ACTUALIZAMOS handleSearch (botón)
    const handleSearch = useCallback(async (query: string) => {
        if (!query || query.length < 3) {
            setSearchError('Introduce al menos 3 caracteres para buscar.');
            setResults(initialDeals); // Volver a ofertas iniciales
            setApiSearchPerformed(false); // <- NUEVA LÍNEA
            return;
        }

        setIsLoading(true);
        setSearchError(null);
        
        try {
            const searchResults = await injector.searchGameOffersUseCase.execute(query);
            setResults(searchResults);
            setApiSearchPerformed(true); // <- NUEVA LÍNEA (Marcamos que la API buscó)
        } catch (err: any) {
            console.error("Search failed:", err);
            setSearchError('Fallo en la búsqueda. Inténtalo más tarde.');
            setApiSearchPerformed(false); // <- NUEVA LÍNEA
        } finally {
            setIsLoading(false);
        }
    }, [initialDeals]);

    // 3. ACTUALIZAMOS handleTextChange (filtro rápido)
    const handleTextChange = (text: string) => {
        setSearchTerm(text);
        setApiSearchPerformed(false); // <- NUEVA LÍNEA (Resetea el flag)
        setSearchError(null); // Limpiamos errores

        if (text.length === 0) {
            setResults(initialDeals); // Si borra todo, muestra ofertas iniciales
        } else if (text.length > 2) {
            const filteredDeals = initialDeals.filter(deal =>
                deal.title.toLowerCase().includes(text.toLowerCase())
            );
            setResults(filteredDeals);
        } else {
             // Si tiene 1 o 2 letras, no filtramos nada, solo mostramos las iniciales
            setResults(initialDeals); // <- NUEVO BLOQUE ELSE
        }
    };

    // Renderizado de la lista
    const renderItem = ({ item }: { item: Deal }) => (
        <SearchDealItem 
            deal={item} 
            getStoreName={getStoreName}
            getStoreIcon={getStoreIcon}
        />
    );
    
    // (isLoading || isDealsLoading)
    const isTotalLoading = isLoading || isStoresLoading || (isDealsLoading && results.length === 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar juego por título..."
                    value={searchTerm}
                    onChangeText={handleTextChange}
                    onSubmitEditing={() => handleSearch(searchTerm)}
                    returnKeyType="search"
                />
                <Button 
                    title="Buscar" 
                    onPress={() => handleSearch(searchTerm)}
                    disabled={isTotalLoading || searchTerm.length < 3}
                />
            </View>

            {isTotalLoading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#1565C0" />
                    <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
                </View>
            )}

            {!isTotalLoading && (dealsError || searchError) && (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{dealsError || searchError}</Text>
                    <Button title="Reintentar" onPress={reloadDeals} />
                </View>
            )}

            {!isTotalLoading && !(dealsError || searchError) && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.dealID}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    
                    // 4. ACTUALIZAMOS ListEmptyComponent
                    ListEmptyComponent={
                        <View style={styles.center}>
                            {apiSearchPerformed ? (
                                // Si la API buscó y no encontró nada:
                                <Text>No se encontraron resultados para "{searchTerm}".</Text>
                            ) : (
                                // Si el filtro local no encontró nada:
                                <Text>No hay coincidencias locales. Presiona 'Buscar'.</Text>
                            )}
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        // Para que el "ListEmptyComponent" no ocupe toda la pantalla
        flexGrow: 1, 
    },
    dealCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 7,
        marginHorizontal: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
    },
    thumbImage: {
        width: 100,
        height: 60,
        borderRadius: 4,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dealTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    cheapestPrice: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    storeText: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },
    linkIcon: {
        marginLeft: 10,
    },
    errorText: {
        color: '#D32F2F',
        marginTop: 20,
        textAlign: 'center',
    }
});