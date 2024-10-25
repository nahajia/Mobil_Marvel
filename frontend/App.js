import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Ipcim from './Ipcim';

export default function App() {
  const [adatok, setAdatok] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const letoltes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(Ipcim.Ipcim + "film");
      if (!response.ok) {
        throw new Error("Hiba történt a filmek letöltése során.");
      }
      const data = await response.json();
      setAdatok(data);
    } catch (error) {
      console.error("Letöltési hiba:", error);
      Alert.alert("Hiba", "Nem sikerült letölteni az adatokat.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    letoltes();
  }, []);

  const szavazas = async (id) => {
    try {
      const bemenet = { "bevitel1": id };
      const response = await fetch(Ipcim.Ipcim + "szavazatFelvitel", {
        method: "POST",
        body: JSON.stringify(bemenet),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
      if (!response.ok) {
        throw new Error("Hiba történt a szavazat rögzítése során.");
      }
      const message = await response.text();
      Alert.alert("", message);
    } catch (error) {
      console.error("Szavazási hiba:", error);
      Alert.alert("Hiba", "Nem sikerült rögzíteni a szavazatot.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Marvel filmek</Text>
      {isLoading ? (
        <Text>Betöltés...</Text>
      ) : (
        <FlatList
          data={adatok}
          renderItem={({ item }) => (
            <View style={{ margin: 10 }}>
              <Text style={{ fontSize: 20, color: "#cc0000" }}>{item.film_cim}</Text>
              <Image
                source={{ uri: Ipcim.Ipcim + item.film_kep }}
                style={{ width: 250, height: 250 }}
              />
              <TouchableOpacity
                style={{ backgroundColor: "#0000ff", paddingTop: 10 }}
                onPress={() => szavazas(item.film_id)}
              >
                <Text style={{ color: "white", fontSize: 20 }}>Erre szavazok</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.film_id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 50,
  },
});
