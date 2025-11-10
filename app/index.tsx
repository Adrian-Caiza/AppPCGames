// app/index.tsx

import { Redirect } from 'expo-router';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const { user, isInitialLoading } = useAuthViewModel();

    if (isInitialLoading) {
        // Muestra un spinner con tu tema oscuro mientras se verifica la sesión
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#1F2937' }}>
                <ActivityIndicator size="large" color="#50E3C2" />
            </View>
        );
    }

    if (!user) {
        // No hay usuario, redirigir a la pantalla de login
        return <Redirect href="/login" />;
    }

    // Hay un usuario, redirigir a la app principal (pantalla de ofertas)
    return <Redirect href="/(tabs)/deals" />;
}