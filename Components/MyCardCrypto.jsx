import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Text,TouchableOpacity,View } from "react-native";
export function MyCardCrypto({crypto}){
    const nav = useNavigation();
     const isPositif = crypto.percent >=0;
     const priceLisible = (crypto.price ?? 0).toLocaleString("fr-FR",{
        minimumFractionDigits:0,
        maximumFractionDigits : 2,

     });
     const lisibleNombre =(crypto.volume ?? 0).toLocaleString("fr-FR",{
        minimumFractionDigits : 0,
        maximumFractionDigits : 0
    });


     const formatPercent =(crypto.percent ?? 0).toLocaleString("fr-FR",{
        minimumFractionDigits : 0,
        maximumFractionDigits : 2
    });
return(
    <TouchableOpacity onPress={()=>{
        nav.navigate("detail",{crypto:crypto});

    }}>
    <LinearGradient 
    colors={["purple","blue","white"]}
    start={{x:0,y:0}}
    end={{x:1,y:1}}
    
    style={{flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"transparent",
        borderRadius:20,
        marginBottom:10,
        marginHorizontal:10,
        padding:10,
        
        }}>
        <View>
            <Image source={{uri:crypto.logo}} style={{height:40,width:40,marginBottom:10}}/>
           
                < Text style={{marginRight:10}}>{crypto.name} {crypto.symbol.toUpperCase()}</Text>

            
            

        </View>
        <View style={{justifyContent:"center"}}>
            <Text>{priceLisible} €</Text>
           
        <Text>{lisibleNombre}</Text>
        <Text style={{color:(isPositif)?"green":"red"}}>{formatPercent} %</Text>


        </View>
     
        
        
    </LinearGradient>
    </TouchableOpacity>
)
}