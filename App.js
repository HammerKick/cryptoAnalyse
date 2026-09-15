import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { MyButton } from './Components/MyBouton';
import ImageBack from './assets/background.png';
import { useEffect, useState } from 'react';
import { getInfos } from './services/apiCrypto';
import { MyLoading } from './Components/MyLoading';

export default function App() {
  const [valeur,setvaleur] = useState(0);
  const [isLoading,setisLoading] = useState(false);
  const [allCryptos,setallcryptos] =useState([]);

  useEffect(()=>{
    initialiasation();

  },[]);

  async function initialiasation(){
    const data = getInfos();
    setisLoading(true);
    setallcryptos(data);

  }

  function addition(){
    const provoisoire = valeur+1;
    console.log(provoisoire);
    setvaleur(provoisoire);
   

  }

  if(!isLoading){
    return <MyLoading/>
  }else {
  return (
    <ImageBackground style={{flex:1}} source={ImageBack} imageStyle={{opacity:0.5}}>
      <Text style={{fontSize:60,color:"red"}}>{valeur}</Text>
     
     <MyButton name="addition" onPress={()=>{
      setvaleur(valeur+1);
     }}/>
    </ImageBackground>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
});
