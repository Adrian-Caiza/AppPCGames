// app/(tabs)/search.tsx

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, Image, TouchableOpacity, Button, Alert } from 'react-native';
import { Deal } from '../../src/domain/entities/Deal';
import { injector } from '../../src/core/injector/Injector';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useStoresViewModel } from '../../src/presentation/hooks/useStoresViewModel'; // Nuevo hook

// --- COMPONENTE INDIVIDUAL DE RESULTADO DE BÚSQUEDA ---
interface SearchDealItemProps {
    deal: Deal;
    getStoreIcon: (id: string) => string | undefined;
    getStoreName: (id: string) => string;
}

const SearchDealItem: React.FC<SearchDealItemProps> = ({ deal, getStoreIcon, getStoreName }) => {
    // Al ser un resultado de búsqueda simple, no siempre tenemos todos los datos de oferta.
    const openSearchLink = () => {
        // En el mapper, definimos el enlace como SEARCH-{gameID}. 
        // Para una búsqueda, redirigiremos al usuario a la página de CheapShark 
        // que lista todas las ofertas de ese GameID.
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
                
                {/* Mostramos información de la tienda, si está disponible */}
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

    // Cargamos los datos de las tiendas
    const { getStoreName, getStoreIcon, isLoading: isStoresLoading } = useStoresViewModel();

    // Función que llama al Caso de Uso de Búsqueda
    const handleSearch = useCallback(async (query: string) => {
        if (!query || query.length < 3) {
            setSearchError('Introduce al menos 3 caracteres para buscar.');
            setResults([]);
            return;
        }

        setIsLoading(true);
        setSearchError(null);
        setResults([]);
        
        try {
            // Llama al Caso de Uso a través del Inyector
            const searchResults = await injector.searchGameOffersUseCase.execute(query);
            setResults(searchResults);

        } catch (err: any) {
            console.error("Search failed:", err);
            setSearchError('Fallo en la búsqueda. Inténtalo más tarde.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Renderizado de la lista
    const renderItem = ({ item }: { item: Deal }) => (
        <SearchDealItem 
            deal={item} 
            getStoreName={getStoreName}
            getStoreIcon={getStoreIcon}
        />
    );

    const isTotalLoading = isLoading || isStoresLoading;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar juego por título..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
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

            {!isTotalLoading && searchError && (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{searchError}</Text>
                </View>
            )}

            {!isTotalLoading && !searchError && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.gameID}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
            
            {!isTotalLoading && !searchError && results.length === 0 && searchTerm.length > 0 && (
                <View style={styles.center}>
                    <Text>No se encontraron resultados para "{searchTerm}".</Text>
                </View>
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
    },
    // Estilos de la Tarjeta de Resultado (similar a DealItem)
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