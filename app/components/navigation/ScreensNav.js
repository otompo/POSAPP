import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../screens/Profile";
import Login from "../../screens/Login";
import Dashboard from "../../screens/Dashboard";
import { AuthContext } from "../../context/authContext";

const Stack = createNativeStackNavigator();
function ScreensNav(props) {
  const [state, setState] = useContext(AuthContext);
  const authenticated = state && state.token !== "" && state.user !== null;

  return (
    <Stack.Navigator
      initialRouteName="Login"
      //   screenOptions={{ headerShown: false }}
    >
      {authenticated ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              title: "Dashboard",
            }}
          />

          <Stack.Screen
            name="Profile"
            component={Profile}
            options={({ route }) => ({
              title: "",
              headerTransparent: true,
              headerBackTitle: "",
              headerTintColor: "#ffffff",
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default ScreensNav;

const styles = StyleSheet.create({});
