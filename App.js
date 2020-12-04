import React from "react";
import { StatusBar, LogBox } from "react-native";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import {
   Raleway_800ExtraBold,
   Raleway_500Medium,
   Raleway_600SemiBold,
   useFonts,
} from "@expo-google-fonts/raleway";
import * as Notifications from "expo-notifications";
import Routes from "./src/routes";

export default function App() {
   // YellowBox.ignoreWarnings(['Setting a timer']);
   // console.disableYellowBox = true;

   LogBox.ignoreAllLogs(true);
   const [fontsLoaded] = useFonts({
      Raleway_800ExtraBold,
      Raleway_600SemiBold,
      Raleway_500Medium,
   });

   Notifications.setNotificationHandler({
      handleNotification: async () => ({
         shouldShowAlert: true,
         shouldPlaySound: false,
         shouldSetBadge: false,
      }),
   });

   if (!fontsLoaded) {
      return <AppLoading />;
   }
   return (
      <NavigationContainer>
         <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
         />
         <Routes />
      </NavigationContainer>
   );
}
