import { Text } from "react-native";

export function MyDetails({route}){
    const crypt = route.params.crypto;
    const bestial = route.params.best;
    return(
        <Text>Je suis dans la page détails {crypt}</Text>
    )
}