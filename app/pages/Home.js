import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
// El paquete de Expo es la mejor alternativa para Expo Go
import * as Location from 'expo-location'; 

export default function Home () {
  const [direccion, setDireccion] = useState('Buscando ubicación...');
  const [cargando, setCargando] = useState(true);

  // 1. Función principal para obtener y convertir la ubicación
  const obtenerUbicacionYDireccion = async () => {
    setCargando(true);
    setDireccion('Solicitando permisos de ubicación...');

    try {
      // 2. Solicitar Permisos
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setDireccion('Permiso de ubicación denegado 😞');
        Alert.alert(
          'Permiso Requerido',
          'La aplicación necesita acceder a tu ubicación para mostrar la dirección.'
        );
        setCargando(false);
        return;
      }

      setDireccion('Obteniendo coordenadas...');

      // 3. Obtener Coordenadas
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Alta precisión
      });
      
      const { latitude, longitude } = location.coords;

      setDireccion(`Coordenadas obtenidas: Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)}...`);

      // 4. Geocodificación Inversa (¡La función mágica de Expo!)
      let geocode = await Location.reverseGeocodeAsync({ 
        latitude, 
        longitude 
      });

      if (geocode && geocode.length > 0) {
        const addr = geocode[0];
        // Formatear la dirección para mostrarla
        const formattedAddress = [
          addr.streetNumber,
          addr.street,
          addr.city,
          addr.postalCode,
          addr.country,
        ]
        .filter(Boolean) // Filtra valores nulos o vacíos
        .join(', ');

        setDireccion(formattedAddress || 'Dirección no disponible con el detalle actual.');
      } else {
        setDireccion('Geocodificación inversa fallida. No se pudo obtener la dirección.');
      }

    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      setDireccion(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // Intentar obtener la ubicación al montar el componente
    obtenerUbicacionYDireccion();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📍 Mi Dirección Actual</Text>
      
      <View style={styles.card}>
        {cargando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.texto}>{direccion}</Text>
          </View>
        ) : (
          <Text style={styles.textoDireccion}>{direccion}</Text>
        )}
      </View>
      
      {!cargando && (
        <View style={{ marginTop: 20 }}>
          <Button 
            title="Recargar Ubicación" 
            onPress={obtenerUbicacionYDireccion} 
            color="#007AFF"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: '90%',
    minHeight: 120,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  texto: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  textoDireccion: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000',
  },
});
