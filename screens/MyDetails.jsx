import { ImageBackground, Text,Image, View, TouchableOpacity } from "react-native";
import background from "../assets/background.png"
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export function MyDetails({route}){
    const crypt = route.params.crypto;
    const nav = useNavigation();
 
    return(
        <ImageBackground source={background} style={{flex:1,paddingTop:60,paddingHorizontal:10}} imageStyle={{opacity:0.6}}>
            <TouchableOpacity onPress={()=>{
                nav.goBack();

            }}>
                    <FontAwesome name="chevron-left" size={20}/>

            </TouchableOpacity>
        
            <View style={{alignItems:"center"}}>
                <Image source={{uri:crypt.logo}} style={{height : 70,width:70}}/>
            <Text style={{fontSize:25,fontWeight:"bold",}}>{crypt.name}</Text>

            </View>
            

        </ImageBackground>
        
    )
}