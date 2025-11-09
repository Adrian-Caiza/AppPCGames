// app/_layout.tsx
import React from 'react';
import { Stack, Redirect } from 'expo-router';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
    const { user, isInitialLoading } = useAuthViewModel();

    if (isInitialLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // Si no hay usuario: mostramos las pantallas públicas (login/register).
    // Dejar (tabs) declarado permite navegar hacia allá al iniciar sesión.
    if (!user) {
        return (
            <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        );
    }

    // Si hay usuario, mostramos las tabs (app principal) y evitamos que el usuario vuelva a login/register.
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            {/* Si quieres redirigir automáticamente, podrías usar: <Redirect href="/deals" /> */}
        </Stack>
    );
}
