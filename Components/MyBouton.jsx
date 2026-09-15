import { TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { styleButton } from "./styleBouton/myboutonstyle";

export function MyButton({name = "Connexion", onPress}){
    return <TouchableOpacity style={styleButton.couleur} onPress={onPress}>
        <Text style={{color:"white"}}>{name}</Text>

    </TouchableOpacity>
}