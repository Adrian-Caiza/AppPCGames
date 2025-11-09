// app/(tabs)/login.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { Link, router } from 'expo-router'; // Importar 'router' para navegación

export default function LoginScreen() {
    const { signIn, isOperationLoading, error, setError } = useAuthViewModel();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, introduce el correo y la contraseña.');
            return;
        }
        
        setError(null); // Limpiar errores previos
        try {
            await signIn(email, password);
            // Si el login es exitoso, el 'onAuthStateChanged' del hook redirigirá
            // o podrías redirigir manualmente si no usas un layout que lo maneje.
            // Ejemplo: router.replace('/');
        } catch (e) {
            // El error se maneja en el hook, solo mostramos una alerta
            Alert.alert('Error de Login', error || 'Ha ocurrido un error inesperado.');
        }
    };
    
    // Si la operación de carga inicial está activa, podríamos mostrar un splash
    // Pero en esta pantalla, nos centramos en el login/registro.

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            {isOperationLoading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <Button title="Entrar" onPress={handleLogin}  />
            )}
            
            <Link href="/register" style={styles.link}>
                ¿No tienes cuenta? Regístrate aquí
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    // ... estilos básicos ...
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, paddingHorizontal: 10 },
    errorText: { color: 'red', marginBottom: 15, textAlign: 'center' },
    link: { color: 'blue', marginTop: 20, textAlign: 'center' }
});