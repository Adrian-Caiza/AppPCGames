// app/(tabs)/search.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { Deal } from '../../src/domain/entities/Deal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { injector } from '../../src/core/injector/Injector';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useStoresViewModel } from '../../src/presentation/hooks/useStoresViewModel';
import { useDealsViewModel } from '../../src/presentation/hooks/useDealsViewModel';

// Paleta de colores
const colors = {
    background: '#1F2937', // Azul oscuro/gris
    cardBackground: '#374151', // Gris para el fondo del input
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    placeholder: '#6B7280',
    primary: '#50E3C2', // Verde menta
    salePriceGreen: '#4CAF50', // Verde de precio
    error: '#EF4444',
};

// --- COMPONENTE INDIVIDUAL DE RESULTADO DE BÚSQUEDA ---
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
                    <Text style={styles.salePriceHighlight}> ${deal.salePrice.toFixed(2)}</Text>
                </Text>
                <Text style={styles.storeText}>
                    Visto en: {storeName} 
                </Text>
            </View>
            {/* Icono actualizado para consistencia */}
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} style={styles.linkIcon} />
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
    // Cargamos las ofertas iniciales (para cuando la barra esté vacía)
    const { deals: initialDeals, isLoading: isDealsLoading, error: dealsError, reloadDeals } = useDealsViewModel();

    // 1. Cargamos las ofertas iniciales en los resultados
    useEffect(() => {
        if (initialDeals.length > 0) {
            setResults(initialDeals);
        }
    }, [initialDeals]);

    // 2. CREAMOS UNA FUNCIÓN REUTILIZABLE PARA LA BÚSQUEDA EN API
    const runSearch = useCallback(async (query: string) => {
        if (!query || query.length < 3) {
            setResults(initialDeals); // Volver a ofertas iniciales si la búsqueda es corta
            setSearchError(null);
            return;
        }

        setIsLoading(true);
        setSearchError(null);
        
        try {
            const searchResults = await injector.searchGameOffersUseCase.execute(query);
            setResults(searchResults);
        } catch (err: any) {
            console.error("Search failed:", err);
            setSearchError('Fallo en la búsqueda. Inténtalo más tarde.');
        } finally {
            setIsLoading(false);
        }
    }, [initialDeals]); // Depende de 'initialDeals' para poder resetear la lista

    // 3. AÑADIMOS EL "DEBOUNCER" 
    useEffect(() => {
        if (searchTerm.length === 0) {
            setResults(initialDeals);
            setSearchError(null);
            return; 
        }
        if (searchTerm.length < 3) {
            setSearchError(null);
            return; 
        }
        const handler = setTimeout(() => {
            runSearch(searchTerm); // Llama a la API
        }, 500); 

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, runSearch, initialDeals]); 

    // 4. SIMPLIFICAMOS EL MANEJADOR DEL TEXTO
    const handleTextChange = (text: string) => {
        setSearchTerm(text);
    };

    // 5. SIMPLIFICAMOS EL MANEJADOR DEL BOTÓN "BUSCAR"
    const handleSearchButton = () => {
        runSearch(searchTerm); // Ejecuta la búsqueda inmediatamente
    };

    // Renderizado de la lista
    const renderItem = ({ item }: { item: Deal }) => (
        <SearchDealItem 
            deal={item} 
            getStoreName={getStoreName}
            getStoreIcon={getStoreIcon}
        />
    );
    
    const isTotalLoading = isLoading || isStoresLoading || (isDealsLoading && results.length === 0);
    const isButtonDisabled = isTotalLoading || searchTerm.length < 3;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.searchContainer}>
                
                {/* Input de búsqueda estilizado */}
                <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="magnify" size={20} color={colors.placeholder} style={styles.inputIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar juego por título..."
                        placeholderTextColor={colors.placeholder}
                        value={searchTerm}
                        onChangeText={handleTextChange} 
                        onSubmitEditing={handleSearchButton} 
                        returnKeyType="search"
                        autoCapitalize="none"
                    />
                </View>

            </View>

            {isTotalLoading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Cargando datos...</Text>
                </View>
            )}

            {!isTotalLoading && (dealsError || searchError) && (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.error} />
                    <Text style={styles.errorText}>{dealsError || searchError}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={reloadDeals}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!isTotalLoading && !(dealsError || searchError) && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.dealID}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled" // Para que se pueda presionar un item sin que se cierre el teclado
                    
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <MaterialCommunityIcons name="gamepad-variant-outline" size={50} color={colors.textSecondary} />
                            {searchTerm.length < 3 ? (
                                <Text style={styles.emptyText}>Escribe al menos 3 letras para buscar.</Text>
                            ) : (
                                <Text style={styles.emptyText}>No se encontraron resultados para "{searchTerm}".</Text>
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
        backgroundColor: colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        textAlign: 'center',
    },
    loadingText: {
        color: colors.textSecondary,
        marginTop: 10,
        fontSize: 16,
    },
    errorText: {
        color: colors.error,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryButtonText: {
        color: colors.background,
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: colors.cardBackground, // Fondo del contenedor de búsqueda
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background, // Fondo del input
        borderRadius: 12,
        paddingHorizontal: 15,
        marginRight: 10,
        height: 45,
    },
    inputIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        color: colors.text,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 15,
        height: 45,
    },
    disabledButton: {
        opacity: 0.5,
    },
    searchButtonText: {
        color: colors.background,
        fontWeight: 'bold',
        fontSize: 14,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 20,
        flexGrow: 1, 
    },
    dealCard: {
        flexDirection: 'row',
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        marginVertical: 7,
        marginHorizontal: 15,
        padding: 12,
        alignItems: 'center',
    },
    thumbImage: {
        width: 100,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#555', // Placeholder
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dealTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 5,
    },
    cheapestPrice: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 5,
    },
    salePriceHighlight: {
        fontWeight: 'bold',
        color: colors.salePriceGreen,
    },
    storeText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 3,
    },
    linkIcon: {
        marginLeft: 10,
    },
});