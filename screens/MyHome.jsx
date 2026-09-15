
import { FlatList, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import ImageBack from '../assets/background.png';
import { useEffect, useState } from 'react';
import { getInfos } from '../services/apiCrypto';
import { MyLoading } from '../Components/MyLoading';
import { MyCardCrypto } from '../Components/MyCardCrypto';
import { useNavigation } from '@react-navigation/native';

export function MyHome(){
    
      const [isLoading,setisLoading] = useState(false);
      const [allCryptos,setallcryptos] =useState([]);
      const [dataCryptos,setdataCryptos] = useState([]);
     

        useEffect(()=>{
          initialiasation();
      
        },[]);
      
        async function initialiasation(){
          const data = await getInfos();
          setisLoading(true);
          setallcryptos(data);
          setdataCryptos(data);
          console.log(data);
      
        }


      if(!isLoading){
    return <MyLoading/>
  }else {
  return (
    <ImageBackground style={{flex:1}} source={ImageBack} imageStyle={{opacity:0.5}}>
      
      <FlatList
       data={dataCryptos}
      
       keyExtractor={(item)=> item.id}
        renderItem={({item})=>{
          return <MyCardCrypto crypto={item}/>
        }}

      />
     
   
    </ImageBackground>
  );
}
}