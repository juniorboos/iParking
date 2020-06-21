import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NewReservation from './pages/NewReservation';

const AppStack = createStackNavigator();

const Routes = () => {
   return (
      <NavigationContainer>
         <AppStack.Navigator 
            headerMode="none" 
            screenOptions={{
               cardStyle: {
                  backgroundColor: '#EBEBEB'
               }
            }}
         >
            <AppStack.Screen name="Login" component={Login} />
            <AppStack.Screen name="Register" component={Register} />
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="NewReservation" component={NewReservation} />
         </AppStack.Navigator>
      </NavigationContainer>
   )
}

export default Routes;
