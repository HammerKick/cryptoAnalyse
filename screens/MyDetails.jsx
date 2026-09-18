import {
  ImageBackground,
  Text,
  Image,
  View,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { LineChart } from "react-native-chart-kit";
import background from "../assets/background.png";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getHistory } from "../services/apiCrypto";
import { getEstimation } from "../services/apiIA";

const screenWidth = Dimensions.get("window").width;

function getPercentColor(percent) {
  if (percent > 0) return "green";
  return "red";
}

function getTendanceColor(tendance) {
  if (tendance === "hausse") return "lightgreen";
  if (tendance === "baisse") return "salmon";
  return "orange";
}

export function MyDetails({ route }) {
  const crypt = route.params.crypto;
  const nav = useNavigation();

  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [analyse, setAnalyse] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    chargerHistorique();
  }, []);

  async function chargerHistorique() {
    setIsLoadingHistory(true);
    const data = await getHistory(crypt.id);
    setHistory(data);
    setIsLoadingHistory(false);
  }

  async function lancerAnalyse() {
    setIsAnalysing(true);
    setErreur(null);
    setAnalyse(null);

    try {
      const result = await getEstimation(crypt.id);
      setAnalyse(result);
    } catch (e) {
      console.error("Erreur lors de l'analyse IA :", e);

      setErreur(
        "L'analyse a échoué. Vérifie que le serveur backend Flask est bien lancé et que l'IP dans apiIA.js est correcte.",
      );
    } finally {
      setIsAnalysing(false);
    }
  }

  const priceLisible = (crypt.price ?? 0).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <ImageBackground
      source={background}
      style={{ flex: 1, paddingTop: 60, paddingHorizontal: 10 }}
      imageStyle={{ opacity: 0.6 }}
    >
      <ScrollView>
        <TouchableOpacity onPress={() => nav.goBack()}>
          <FontAwesome name="chevron-left" size={20} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Image
            source={{ uri: crypt.logo }}
            style={{ height: 70, width: 70 }}
          />

          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            {crypt.name}
          </Text>

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Volume : {crypt.volume}
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: getPercentColor(crypt?.percent),
              backgroundColor: "black",
              padding: 5,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            {crypt?.percent}%
          </Text>
        </View>

        {/* Graphe historique des prix (~48h) */}
        <View style={{ marginTop: 20 }}>
          {isLoadingHistory ? (
            <ActivityIndicator size="small" />
          ) : history.length > 0 ? (
            <LineChart
              data={{
                labels: history
                  .filter((_, i) => i % Math.ceil(history.length / 5) === 0)
                  .map((p) => p.heure),

                datasets: [
                  {
                    data: history.map((p) => p.prix),
                  },
                ],
              }}
              width={screenWidth - 20}
              height={200}
              yAxisSuffix=" €"
              chartConfig={{
                backgroundGradientFrom: "#1e2327",
                backgroundGradientTo: "#1e2327",
                decimalPlaces: 0,
                color: () => "#8e44ec",
                labelColor: () => "#ffffff",
              }}
              bezier
              style={{
                borderRadius: 16,
                marginTop: 10,
              }}
            />
          ) : (
            <Text style={{ textAlign: "center" }}>
              Historique indisponible
            </Text>
          )}
        </View>

        {/* Bloc Analyse IA */}
        <View
          style={{
            marginTop: 10,
            marginBottom: 50,
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: 16,
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Analyse IA — {crypt.name}
          </Text>

          <Text
            style={{
              color: "white",
              marginBottom: 10,
            }}
          >
            Prix actuel : {priceLisible} €
          </Text>

          <Button
            title={
              !analyse
                ? "Lancer l'estimation du prix"
                : "Relancer l'estimation du prix"
            }
            onPress={lancerAnalyse}
            disabled={isAnalysing}
          />

          {isAnalysing && (
            <View
              style={{
                marginTop: 15,
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="small" color="white" />

              <Text
                style={{
                  color: "white",
                  marginTop: 5,
                }}
              >
                Analyse en cours...
              </Text>
            </View>
          )}

          {erreur && (
            <Text
              style={{
                color: "red",
                marginTop: 15,
              }}
            >
              {erreur}
            </Text>
          )}

          {analyse && !isAnalysing && (
            <View style={{ marginTop: 15 }}>

              {/* Estimation */}

              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                }}
              >
                Estimation dans 24h :{" "}

                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {analyse.analyse.prix_min_24h} € -{" "}
                  {analyse.analyse.prix_max_24h} €
                </Text>
              </Text>

              {/* Tendance */}

              <Text
                style={{
                  color: getTendanceColor(analyse.analyse.tendance),
                  fontSize: 16,
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                Tendance : {analyse.analyse.tendance}
              </Text>

              {/* Explication */}

              <Text
                style={{
                  color: "white",
                  marginTop: 10,
                }}
              >
                {analyse.analyse.explication}
              </Text>

              {/* Actualités */}

              {analyse.analyse.actualites?.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 17,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Actualités importantes
                  </Text>

                  {analyse.analyse.actualites.map((actu, index) => (
                    <View
                      key={index}
                      style={{
                        marginBottom: 15,
                        paddingBottom: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "gray",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        {actu.titre}
                      </Text>

                      <Text
                        style={{
                          color: "lightgray",
                          marginTop: 3,
                        }}
                      >
                        {actu.source} — {actu.date}
                      </Text>

                      <Text
                        style={{
                          color:
                            actu.impact === "positif"
                              ? "lightgreen"
                              : actu.impact === "negatif"
                                ? "salmon"
                                : "orange",

                          fontWeight: "bold",
                          marginTop: 5,
                        }}
                      >
                        Impact : {actu.impact}
                      </Text>

                      <Text
                        style={{
                          color: "white",
                          marginTop: 5,
                        }}
                      >
                        {actu.explication_impact}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Facteurs positifs */}

              {analyse.analyse.facteurs_positifs?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      color: "lightgreen",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Facteurs positifs
                  </Text>

                  {analyse.analyse.facteurs_positifs.map(
                    (facteur, index) => (
                      <Text
                        key={index}
                        style={{
                          color: "white",
                          marginTop: 5,
                        }}
                      >
                        • {facteur}
                      </Text>
                    ),
                  )}
                </View>
              )}

              {/* Facteurs négatifs */}

              {analyse.analyse.facteurs_negatifs?.length > 0 && (
                <View style={{ marginTop: 15 }}>
                  <Text
                    style={{
                      color: "salmon",
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 5,
                    }}
                  >
                    Facteurs négatifs
                  </Text>

                  {analyse.analyse.facteurs_negatifs.map(
                    (facteur, index) => (
                      <Text
                        key={index}
                        style={{
                          color: "white",
                          marginTop: 5,
                        }}
                      >
                        • {facteur}
                      </Text>
                    ),
                  )}
                </View>
              )}

              {/* Incertitude */}

              <Text
                style={{
                  color: "lightgray",
                  marginTop: 15,
                  fontStyle: "italic",
                }}
              >
                Incertitude : {analyse.analyse.niveau_incertitude} —{" "}
                {analyse.analyse.limites}
              </Text>

            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}