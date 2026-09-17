import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    backgroundColor: "white",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default function SearchCrypto({ data, onSearchInput }) {
  const [searchInput, setSearchInput] = useState("");

  return (
    <View>
      <Text style={{ textAlign: "center" }}>Rechercher une crypto :</Text>
      <TextInput
        style={styles.input}
        placeholder="Rechercher une crypto"
        value={searchInput}
        onChangeText={(text) => {
          setSearchInput(text);
          onSearchInput(text);
        }}
      />
    </View>
  );
}
