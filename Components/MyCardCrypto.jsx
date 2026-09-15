import { Text,TouchableOpacity,View } from "react-native";
export function MyCardCrypto({crypto}){
return(
    <TouchableOpacity>
    <View style={{flexDirection:"row"}}>
        <Text>{crypto.name}</Text>
    </View>
    </TouchableOpacity>
)
}