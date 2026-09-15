import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity,Text } from "react-native";

export function Mydashboard(){
    const nav = useNavigation();
    return(
        <TouchableOpacity onPress={()=>{
            nav.navigate("detail",{crypto:"j'adore react native",best:true});

        }}>
            <Text>Salut navigation</Text>

        </TouchableOpacity>

    );
}