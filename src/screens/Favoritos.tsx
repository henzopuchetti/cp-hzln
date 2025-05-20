import React, { useEffect, useState } from "react";
import {View, Text, FlatList, Image, TouchableOpacity, StyleSheet,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const favoritos = "favorites";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);

useFocusEffect(
  useCallback(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem(favoritos);
      setFavorites(favs ? JSON.parse(favs) : []);
    };

    loadFavorites();
  }, [])
);

  const removeFavorite = async (id: number) => {
    const updated = favorites.filter((char) => char.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem(favoritos, JSON.stringify(updated));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.foto} />
      <View style={styles.informacao}>
        <Text style={styles.nome}>{item.name}</Text>
        <Text>Status: <Text>{item.status}</Text></Text>
        <TouchableOpacity onPress={() => removeFavorite(item.id)}>
          <Text>Remover Personagem</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

return (
  <View style={{ flex: 1, padding: 8 }}>
    <Text style={styles.titulo}>Personagens Favoritos</Text>

    {favorites.length === 0 ? (
      <Text style={styles.textoVazio}>Está vazio por aqui. 😢</Text>
    ) : (
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    )}
  </View>
);
}

const styles = StyleSheet.create({
  titulo: {
    color: "#12ff00",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    marginBottom: 5,
    overflow: "hidden",
    shadowColor: "#000",
    backgroundColor: "#b4fbae",

  },
  foto: {
    width: 100,
    height: 100,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  informacao: {
    padding: 10,
    justifyContent: "center",
  },
  textoVazio: {
    marginTop: 360,
    textAlign: "center",
    fontSize: 25,
    color: "#8c968b",
  },
});
