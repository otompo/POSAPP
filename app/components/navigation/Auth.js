import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Signin } from "../../screens/Signin";

const Stack = createNativeStackNavigator();

function Auth(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={Signin} />
    </Stack.Navigator>
  );
}

export default Auth;

const styles = StyleSheet.create({});
