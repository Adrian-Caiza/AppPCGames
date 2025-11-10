// app/login.tsx

import React, { useState } from 'react';
import { 
    View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, 
    TouchableOpacity, // Importamos TouchableOpacity para el botón
    KeyboardAvoidingView, // Para evitar que el teclado tape los inputs
    Platform, // Para detectar el sistema operativo
    StatusBar // Para controlar la barra de estado
} from 'react-native';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { Link, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos los iconos

export default function LoginScreen() {
    const { signIn, isOperationLoading, error, setError } = useAuthViewModel();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, introduce el correo y la contraseña.');
            return;
        }
        
        setError(null);
        try {
            await signIn(email, password);
            router.replace('/(tabs)/deals');
        } catch (e) {
            Alert.alert('Error de Login', error || 'Ha ocurrido un error inesperado.');
        }
    };
    
    // Paleta de colores inspirada en la imagen
    const colors = {
        background: '#1F2937', // Azul oscuro/gris
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        placeholder: '#6B7280',
        primary: '#50E3C2', // Verde menta
        secondary: '#374151', // Gris para el fondo del input
        error: '#EF4444',
    };

    // Aplicamos los estilos en el StyleSheet
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 25,
            backgroundColor: colors.background,
        },
        logoTitle: {
            fontSize: 48,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 10,
        },
        title: {
            fontSize: 22,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 30,
        },
        
        // Contenedor para el icono y el input
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.secondary,
            borderRadius: 12,
            paddingHorizontal: 15,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: colors.secondary,
        },
        inputIcon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            height: 50,
            color: colors.text,
            fontSize: 16,
        },

        errorText: {
            color: colors.error,
            marginBottom: 15,
            textAlign: 'center',
            fontSize: 14,
            fontWeight: 'bold',
        },
        
        // Estilos del nuevo botón
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 15,
            borderRadius: 30, // Bordes muy redondeados
            alignItems: 'center',
            marginTop: 10,
            marginBottom: 25,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        buttonText: {
            color: colors.background, // Texto oscuro en el botón
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        
        registerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        registerText: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        registerLink: {
            color: colors.primary, // Color primario para el enlace
            fontSize: 14,
            fontWeight: 'bold',
        }
    });

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            {/* Pone el texto de la barra de estado en blanco */}
            <StatusBar barStyle="light-content" />

            {/* Título de la App */}
            <Text style={styles.logoTitle}>GameLoot</Text>
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            {/* Input de Correo */}
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email-outline" size={20} color={colors.placeholder} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>
            
            {/* Input de Contraseña */}
            <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock-outline" size={20} color={colors.placeholder} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            {isOperationLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                // Botón personalizado
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            )}
            
            {/* Enlace de Registro */}
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>¿No tienes cuenta? </Text>
                {/* Usamos asChild para que el Link aplique sus propiedades al TouchableOpacity */}
                <Link href="/register" asChild> 
                    <TouchableOpacity>
                        <Text style={styles.registerLink}>Regístrate aquí</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </KeyboardAvoidingView>
    );
}