import { ActivityIndicator, View,Text } from "react-native";

export function MyLoading (){
    return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size={"large"} color={"black"}/>
        <Text style={{fontSize:20}}>En chargement ...</Text>
    </View>
    )
}