import SearchCrypto from "./SearchCrypto";

export default function Home() {
  const nav = useNavigation();
  return (
    <View source={ImageBack} imageStyle={{ opacity: 0.5 }}>
      <SearchCrypto />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
          marginTop: 100,
        }}
      >
        <Link screen="Details" params={{ id: "bitcoin" }}>
          <PanelCrypto id={"bitcoin"} />
        </Link>
        <Link screen="Details" params={{ id: "ethereum" }}>
          <PanelCrypto id={"ethereum"} />
        </Link>
        <Link screen="Details" params={{ id: "tether" }}>
          <PanelCrypto id={"tether"} />
        </Link>
        <Link screen="Details" params={{ id: "binancecoin" }}>
          <PanelCrypto id={"binancecoin"} />
        </Link>
      </View>
    </View>
  );
}
