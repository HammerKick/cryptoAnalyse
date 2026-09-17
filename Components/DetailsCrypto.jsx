import { View } from "react-native";

export default function DetailsCrypto({ route }) {
  async function init() {
    setIsLoading(true);
    const data = await getInfos();
    setCrypto(data.find((item) => item.id === id));
    setIsLoading(false);
  }

  const crypto = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>{crypto?.name}</Text>
      <Text style={{ fontSize: 20 }}>{crypto?.price}$</Text>
      <Text
        style={{ fontSize: 20, color: crypto?.percent > 0 ? "green" : "red" }}
      >
        {crypto?.percent}%
      </Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        Volume: {crypto?.volume}
      </Text>
      <Button screen="Home">Retour</Button>
    </View>
  );
}
