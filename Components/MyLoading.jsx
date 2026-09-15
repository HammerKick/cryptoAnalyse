import { ActivityIndicator, View,Text } from "react-native";

export function MyLoading (){
    return (
    <View>
        <ActivityIndicator size={"large"} color={"black"}/>
        <Text style={{fontSize:20}}>En chargement ...</Text>
    </View>
    )
}