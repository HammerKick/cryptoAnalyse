import { Text } from "react-native";

export function MyDetails({route}){
    const crypt = route.params.crypto;
 
    return(
        <Text>Je suis dans la page détails {crypt.name}</Text>
    )
}