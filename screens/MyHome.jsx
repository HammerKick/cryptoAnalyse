import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ImageBack from "../assets/background.png";
import { useEffect, useState } from "react";
import { getInfos } from "../services/apiCrypto";
import { MyLoading } from "../Components/MyLoading";
import { MyCardCrypto } from "../Components/MyCardCrypto";
import { useNavigation } from "@react-navigation/native";
import SearchCrypto from "../Components/SearchCrypto";

export function MyHome() {
  const [isLoading, setisLoading] = useState(false);
  const [allCryptos, setallcryptos] = useState([]);
  const [dataCryptos, setdataCryptos] = useState([]);

  useEffect(() => {
    initialiasation();
  }, []);

  useEffect(() => {}, []);

  async function initialiasation() {
    const data = await getInfos();
    setisLoading(true);
    setallcryptos(data);
    setdataCryptos(data);
  }

  function onSearchInput(input) {
    const filteredCryptos = allCryptos.filter((crypto) => {
      return crypto.name.toLowerCase().includes(input.toLowerCase());
    });
    if (input === "") {
      setdataCryptos(allCryptos);
    } else {
      setdataCryptos(filteredCryptos);
    }
  }

  if (!isLoading) {
    return <MyLoading />;
  } else {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        source={ImageBack}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={{ marginTop: 120, alignItems: "center" }}>
          <SearchCrypto data={dataCryptos} onSearchInput={onSearchInput} />
        </View>
        <View style={{ marginBottom: 60 }} />

        {dataCryptos.length > 0 ? (
          <FlatList
            data={dataCryptos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return <MyCardCrypto crypto={item} />;
            }}
          />
        ) : (
          <Text style={{ textAlign: "center" }}>Aucun résultat trouvé</Text>
        )}
      </ImageBackground>
    );
  }
}
