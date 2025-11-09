// _layout.tsx

import { Stack, Redirect } from 'expo-router';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
    const { user, isInitialLoading } = useAuthViewModel();

    // 1. Mostrar pantalla de carga mientras Firebase inicializa
    if (isInitialLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // 2. Redirección basada en el estado de autenticación

    // Si no hay usuario y no estamos en las rutas de Auth (Login/Register)
    // Redirigimos al usuario a la pantalla de Login
    if (!user) {
        // En un escenario real con grupos de rutas, se usa un layout específico.
        // Aquí forzamos la navegación al login si no estamos ya allí
        return (
            <Stack>
                {/* Ocultamos las rutas de la app principal si no hay sesión */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} redirect={true}/>
                <Stack.Screen name="login" options={{ headerShown: false }}/>
                <Stack.Screen name="register" options={{ headerShown: false }}/>
            </Stack>
        );
    }
    
    // Si hay usuario, permitimos el acceso a las pestañas y redirigimos fuera de login/register
    if (user) {
        return (
            <Stack>
                {/* Mostramos las rutas de la app principal (ej. Deals, Search) */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
                {/* Redirigimos lejos de las pantallas de Auth si ya estamos logeados */}
                <Redirect href="/deals" /> 
            </Stack>
        );
    }
}