import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { getInfos } from "../services/apiCrypto";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

export default function PanelCrypto({ id }) {
  const [isLoading, setIsLoading] = useState(true);
  const [crypto, setCrypto] = useState({});

  async function init() {
    setIsLoading(true);
    const data = await getInfos();
    setCrypto(data.find((item) => item.id === id));
    setIsLoading(false);
  }

  useEffect(() => {
    init();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container}>
      <Image
        source={{ uri: crypto?.logo }}
        style={{ width: 100, height: 100 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{crypto?.name}</Text>
      <Text>{crypto?.price}$</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: crypto?.percent > 0 ? "green" : "red",
        }}
      >
        {crypto?.percent}%
      </Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        Volume: {crypto?.volume}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
