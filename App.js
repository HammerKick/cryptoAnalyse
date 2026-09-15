import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { MyHome } from './screens/MyHome';
import { MyDetails } from './screens/MyDetails';
import { Mydashboard } from './screens/MyDashboard';

export default function App() {
  const Stack = createNativeStackNavigator();
  const navTheme = {
    ...DefaultTheme,
    colors : {
      ...DefaultTheme.colors,
      background: "transparent"
    }
  }

  return (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator initialRouteName="dashboard"  screenOption={{headerShown:false,animation:""}}>
    <Stack.Screen name="home" component={MyHome}/>
    <Stack.Screen name="detail" component={MyDetails}/>
    <Stack.Screen name="dashboard" component={Mydashboard}/>

    </Stack.Navigator>

  </NavigationContainer>
  )

  


  


}


