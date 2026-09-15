import { useNavigation } from "@react-navigation/native";
import { Text,TouchableOpacity,View } from "react-native";
export function MyCardCrypto({crypto}){
    const nav = useNavigation();
return(
    <TouchableOpacity onPress={()=>{
        nav.navigate("detail",{crypto:crypto});

    }}>
    <View style={{flexDirection:"row"}}>
        <Text>{crypto.name}</Text>
    </View>
    </TouchableOpacity>
)
}