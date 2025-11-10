// app/(tabs)/deals.tsx

import React from 'react';
import { 
    View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Image, TouchableOpacity,
    StatusBar, // Para la barra de estado
    RefreshControl // Para el pull-to-refresh
} from 'react-native';
import { useDealsViewModel } from '../../src/presentation/hooks/useDealsViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthViewModel } from '../../src/presentation/hooks/useAuthViewModel'; // Para el botón de cerrar sesión
import { Deal } from '../../src/domain/entities/Deal';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Usamos íconos para mejor UI
import * as Linking from 'expo-linking'; // Para abrir el enlace de compra

// Paleta de colores
const colors = {
    background: '#1F2937', // Azul oscuro/gris
    cardBackground: '#374151', // Gris para el fondo del input
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#50E3C2', // Verde menta
    salePriceGreen: '#4CAF50', // Verde de precio
    savingsRed: '#D32F2F', // Rojo de ahorro
    error: '#EF4444',
};

// --- COMPONENTE INDIVIDUAL DE OFERTA ---
interface DealItemProps {
    deal: Deal;
}

const DealItem: React.FC<DealItemProps> = ({ deal }) => {
    // Calculamos el porcentaje de descuento
    const savingsPercentage = Math.round(deal.savings);
    
    // Función para abrir el enlace de la oferta
    const openDealLink = () => {
        Linking.openURL(deal.link);
    };

    return (
        <TouchableOpacity style={styles.dealCard} onPress={openDealLink}>
            <Image 
                source={{ uri: deal.thumb }} 
                style={styles.thumbImage} 
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <Text style={styles.dealTitle} numberOfLines={2}>
                    {deal.title}
                </Text>
                
                <View style={styles.priceContainer}>
                    <Text style={styles.normalPrice}>
                        {deal.normalPrice > 0 ? `$${deal.normalPrice.toFixed(2)}` : ''}
                    </Text>
                    <Text style={styles.salePrice}>
                        ${deal.salePrice.toFixed(2)}
                    </Text>
                </View>
                
                {savingsPercentage > 0 && (
                    <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>
                            -{savingsPercentage}%
                        </Text>
                    </View>
                )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.primary} style={styles.linkIcon} />
        </TouchableOpacity>
    );
};

// --- PANTALLA PRINCIPAL DE OFERTAS ---
export default function DealsScreen() {
    // 1. Consumimos el ViewModel de Ofertas
    const { deals, isLoading, error, reloadDeals } = useDealsViewModel();
    // 2. Consumimos el ViewModel de Auth (para cerrar sesión)
    const { signOut } = useAuthViewModel();

    if (isLoading && deals.length === 0) { // Solo muestra el spinner a pantalla completa en la carga inicial
        return (
            <View style={[styles.container, styles.center]}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Cargando las ofertas más recientes...</Text>
            </View>
        );
    }

    if (error && deals.length === 0) { // Solo muestra el error a pantalla completa si no hay datos
        return (
            <View style={[styles.container, styles.center]}>
                <StatusBar barStyle="light-content" />
                <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.error} />
                <Text style={styles.errorText}>
                    Error: {error}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={reloadDeals}>
                    <Text style={styles.retryButtonText}>Reintentar Carga</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.screenTitle}>🎮 Ofertas Recientes</Text>
                <TouchableOpacity onPress={signOut}>
                    <MaterialCommunityIcons name="logout" size={26} color={colors.error} />
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={deals}
                keyExtractor={(item) => item.dealID}
                renderItem={({ item }) => <DealItem deal={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="gamepad-variant-outline" size={50} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No se encontraron ofertas.</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={reloadDeals}>
                            <Text style={styles.retryButtonText}>Recargar</Text>
                        </TouchableOpacity>
                    </View>
                }
                // Habilitamos el pull-to-refresh
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={reloadDeals}
                        colors={[colors.primary]} // Color del spinner en Android
                        tintColor={colors.primary} // Color del spinner en iOS
                    />
                }
            />
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
    },
    loadingText: {
        marginTop: 10,
        color: colors.textSecondary,
        fontSize: 16,
    },
    errorText: {
        color: colors.error,
        marginTop: 15,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.background, 
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    // Estilos de la Tarjeta de Oferta
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
        backgroundColor: '#555', 
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    dealTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    normalPrice: {
        fontSize: 12,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    salePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.salePriceGreen,
    },
    savingsBadge: {
        position: 'absolute',
        top: -12,
        right: 0,
        backgroundColor: colors.savingsRed,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 15,
    },
    savingsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    linkIcon: {
        marginLeft: 10,
    },
    // Estilos para la lista vacía
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100, 
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: 10,
        marginBottom: 20,
    }
});