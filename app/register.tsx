// app/register.tsx

import React, { useState } from 'react';
import { 
    View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, ScrollView,
    TouchableOpacity, // Importamos para el botón
    KeyboardAvoidingView, // Para el teclado
    Platform, // Para detectar el SO
    StatusBar // Para la barra de estado
} from 'react-native';
import { useAuthViewModel } from '../src/presentation/hooks/useAuthViewModel';
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos iconos


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
            // ----- ¡MEJORA DE LÓGICA AQUÍ! -----
            // Ahora pasamos el 'name' para guardarlo en Firestore
            await register(email, password, name);
            // ------------------------------------

            setRegistered(true);
            Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada. Serás redirigido.');
        } catch (e: any) {
            // El error se maneja y se almacena en el hook
            console.log('Error de Registro', e);
        }
    };
    
    // Estos hooks de useEffect para la redirección están perfectos
    useEffect(() => {
        if (registered && user) {
            const timer = setTimeout(() => {
                router.replace('/(tabs)/deals');
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [registered, user]);

    useEffect(() => {
        if (user && !isOperationLoading) {
            router.replace('/(tabs)/deals');
        }
    }, [user, isOperationLoading]);


    // Paleta de colores (la misma del login)
    const colors = {
        background: '#1F2937', // Azul oscuro/gris
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        placeholder: '#6B7280',
        primary: '#50E3C2', // Verde menta
        secondary: '#374151', // Gris para el fondo del input
        error: '#EF4444',
    };

    // Aplicamos los estilos
    const styles = StyleSheet.create({
        keyboardView: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: 'center',
        },
        container: { 
            padding: 25,
        },
        title: { 
            fontSize: 28, 
            fontWeight: 'bold',
            marginBottom: 30, 
            textAlign: 'center',
            color: colors.text, // Texto blanco
        },
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
            fontWeight: 'bold',
            fontSize: 14,
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 15,
            borderRadius: 30,
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
            color: colors.background,
            fontSize: 16,
            fontWeight: 'bold',
            textTransform: 'uppercase',
        },
        loginContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        loginText: {
            color: colors.textSecondary,
            fontSize: 14,
        },
        loginLink: { 
            color: colors.primary, 
            fontSize: 14,
            fontWeight: 'bold',
        }
    });

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Crear Nueva Cuenta</Text>

                    {/* Campo Nombre */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="account-outline" size={20} color={colors.placeholder} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre Completo"
                            placeholderTextColor={colors.placeholder}
                            value={name}
                            onChangeText={setName}
                            editable={!isOperationLoading}
                        />
                    </View>
                    
                    {/* Campo Correo */}
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
                            editable={!isOperationLoading}
                        />
                    </View>
                    
                    {/* Campo Contraseña */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-outline" size={20} color={colors.placeholder} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña (mín. 6 caracteres)"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            editable={!isOperationLoading}
                        />
                    </View>
                    
                    {/* Campo Confirmar Contraseña */}
                    <View style={styles.inputContainer}>
                        <MaterialCommunityIcons name="lock-check-outline" size={20} color={colors.placeholder} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar Contraseña"
                            placeholderTextColor={colors.placeholder}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            editable={!isOperationLoading}
                        />
                    </View>
                    
                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {isOperationLoading ? (
                        <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>Registrarse</Text>
                        </TouchableOpacity>
                    )}
                    
                    {/* Enlace de Login */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Inicia Sesión</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}