
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const colors = {
    background: '#1F2937',
    cardBackground: '#374151', 
    primary: '#50E3C2',
    textSecondary: '#9CA3AF',
};

export default function TabsLayout() {
    return (
        <Tabs 
            screenOptions={{ 
                headerShown: false,
                
                // 1. Color de fondo de la barra de pestañas
                tabBarActiveTintColor: colors.primary,
                
                // 2. Color del icono (gris claro)
                tabBarInactiveTintColor: colors.textSecondary,
                
                // 3. Estilo de la barra de pestañas
                tabBarStyle: {
                    backgroundColor: colors.cardBackground, // Fondo oscuro
                    borderTopWidth: 0, // Quita la línea blanca superior
                    elevation: 0, // Quita la sombra en Android
                    
                },
                tabBarLabelStyle: {
                    fontSize: 15, 
                    marginBottom: 5, 
                },
                
            }}
        >
            
            <Tabs.Screen 
                name="deals" 
                options={{
                    title: 'Ofertas',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                            name="fire" 
                            color={color} 
                            size={size} 
                        />
                    ),
                }}
            />

            <Tabs.Screen 
                name="search"
                options={{
                    title: 'Buscar',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons 
                            name="magnify" 
                            color={color} 
                            size={size} 
                        />
                    ),
                }}
            />

        </Tabs>
    );
}