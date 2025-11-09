// app/(tabs)/register.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';


export default function RegisterScreen() {
    // 1. Obtener la lógica de autenticación del ViewModel
    const { register, isOperationLoading, error, setError, user } = useAuthViewModel();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registered, setRegistered] = useState(false);

    const handleRegister = async () => {
        // Validación de campos vacíos
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Por favor, rellena todos los campos.');
            return;
        }

        // Validación de coincidencia de contraseñas
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }

        // Validación de longitud (Regla de Negocio simple)
        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        
        setError(null); // Limpiar errores previos

        try {
            await register(email, password);
            // Si el registro es exitoso, Firebase inicia sesión automáticamente.
            // La navegación se manejará a través del _layout.tsx.
            setRegistered(true);
            Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada. Serás redirigido.');
            // Opcional: Redirigir manualmente si es necesario (ej: router.replace('/'));
        } catch (e: any) {
            // El error se maneja y se almacena en el hook, lo mostramos aquí.
            const registerError = error || 'Ha ocurrido un error inesperado durante el registro.';
            Alert.alert('Error de Registro', registerError);
        }
    };
    
    useEffect(() => {
        if (registered && user) {
            // Esperar un pequeño tiempo antes de redirigir (opcional)
            const timer = setTimeout(() => {
                router.replace('/(tabs)/deals');
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [registered, user]);
    // Si el usuario ya está autenticado, redirigimos inmediatamente (redundante si lo maneja _layout)
    useEffect(() => {
        if (user && !isOperationLoading) {
            router.replace('/(tabs)/deals');
        }
    }, [user, isOperationLoading]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Crear Nueva Cuenta</Text>

                {/* 🧩 Campo Nombre */}
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Completo"
                    value={name}
                    onChangeText={setName}
                    editable={!isOperationLoading}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isOperationLoading}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña (mín. 6 caracteres)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!isOperationLoading}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar Contraseña"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isOperationLoading}
                />
                
                {error && <Text style={styles.errorText}>{error}</Text>}

                {isOperationLoading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : (
                    <Button 
                        title="Registrarse" 
                        onPress={handleRegister}  
                        color="#4CAF50"
                    />
                )}
                
                <Link href="/login" style={styles.link}>
                    ¿Ya tienes cuenta? Inicia Sesión
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: { 
        padding: 20, 
        backgroundColor: '#f5f5f5',
    },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold',
        marginBottom: 30, 
        textAlign: 'center',
        color: '#333',
    },
    input: { 
        height: 50, 
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15, 
        paddingHorizontal: 15,
        fontSize: 16,
    },
    errorText: { 
        color: '#D32F2F', 
        marginBottom: 15, 
        textAlign: 'center',
        fontWeight: 'bold',
    },
    link: { 
        color: '#1976D2', 
        marginTop: 25, 
        textAlign: 'center',
        fontSize: 16,
    }
});