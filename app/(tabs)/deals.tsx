// app/(tabs)/deals.tsx

import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useDealsViewModel } from '../../src/presentation/hooks/useDealsViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthViewModel } from '../../src/presentation/hooks/useAuthViewModel'; // Para el botón de cerrar sesión
import { Deal } from '../../src/domain/entities/Deal';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Usamos íconos para mejor UI
import * as Linking from 'expo-linking'; // Para abrir el enlace de compra

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
                        {deal.normalPrice > 0 ? `$${deal.normalPrice.toFixed(2)}` : 'N/A'}
                    </Text>
                    <Text style={styles.salePrice}>
                        ${deal.salePrice.toFixed(2)}
                    </Text>
                </View>
                
                <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>
                        -{savingsPercentage}%
                    </Text>
                </View>
            </View>
            <MaterialCommunityIcons name="tag-outline" size={24} color="#1565C0" style={styles.linkIcon} />
        </TouchableOpacity>
    );
};

// --- PANTALLA PRINCIPAL DE OFERTAS ---
export default function DealsScreen() {
    // 1. Consumimos el ViewModel de Ofertas
    const { deals, isLoading, error, reloadDeals } = useDealsViewModel();
    // 2. Consumimos el ViewModel de Auth (para cerrar sesión)
    const { signOut } = useAuthViewModel();

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#1565C0" />
                <Text style={{ marginTop: 10 }}>Cargando las ofertas más recientes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>
                    Error: {error}
                </Text>
                <Button title="Reintentar Carga" onPress={reloadDeals} color="#D32F2F" />
            </View>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.screenTitle}>🔥 Ofertas Recientes</Text>
                <Button title="Salir" onPress={signOut} color="#D32F2F" />
            </View>
            
            <FlatList
                data={deals}
                keyExtractor={(item) => item.dealID}
                renderItem={({ item }) => <DealItem deal={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No se encontraron ofertas. Intenta recargar.</Text>
                        <Button title="Recargar" onPress={reloadDeals} />
                    </View>
                }
                // Habilitamos el pull-to-refresh para llamar al Caso de Uso nuevamente
                onRefresh={reloadDeals}
                refreshing={isLoading} 
            />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    // Estilos de la Tarjeta de Oferta
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
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    normalPrice: {
        fontSize: 12,
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    salePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50', // Verde para el precio de oferta
    },
    savingsBadge: {
        position: 'absolute',
        top: -15,
        right: 0,
        backgroundColor: '#D32F2F', // Rojo para el ahorro
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
    errorText: {
        color: '#D32F2F',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    }
});