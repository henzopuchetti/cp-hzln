import React, { useCallback, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Character = {id: number; name: string; status: string; species: string;image: string;};

type Props = {
  item: Character;
  isFavorite: (item: Character) => boolean;
  toggleFavorite: (item: Character) => void;
};

export const CharacterCard = ({ item, isFavorite, toggleFavorite }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [favorites, setFavorites] = useState<any[]>([]);

  const handleToggleFavorite = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleFavorite(item);
  };

  useFocusEffect(
  useCallback(() => {
    const loadFavorites = async () => {
      const favs = await AsyncStorage.getItem("favorites");
      setFavorites(favs ? JSON.parse(favs) : []);
    };

    loadFavorites();
  }, [])
);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.foto} />
      
      <View style={styles.informacao}>
        <Text style={styles.nomePersonagem}>{item.name}</Text>
        <Text>Status: <Text>{item.status}</Text></Text>
        <Text>Espécie: {item.species}</Text>
      </View>

      <TouchableOpacity onPress={handleToggleFavorite}>
        <Animated.View style={[styles.coracao, { transform: [{ scale: scaleAnim }] }]}>
          <FontAwesome
            name="heart"
            size={24}
            color={isFavorite(item) ? "#12f600" : "#ccc"}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
    backgroundColor: "#b4fbae",
  },
  foto: {
    width: 100,
    height: 100,  },
  nomePersonagem: {
    fontWeight: "bold",
    fontSize: 20,
  },
  informacao: {
    flex: 1,
    marginLeft: 16,
  },
  coracao: {
    padding: 14,
    elevation: 2,
  },
});
