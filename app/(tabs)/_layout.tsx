
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (

        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#000000ff', 
        }}>
            
            {/* Definimos la pestaña 'deals' */}
            <Tabs.Screen 
                name="deals" // Nombre del archivo (deals.tsx)
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

            {/* 4. Definimos la pestaña 'search' */}
            <Tabs.Screen 
                name="search" // Nombre del archivo (search.tsx)
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