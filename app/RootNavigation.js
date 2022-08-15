import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext, AuthProvider } from "./context/authContext";
import { Image, Text, View, StatusBar } from "react-native";
import Profile from "./screens/Profile";
import colors from "./config/colors";
import Login from "./screens/Login";
import Home from "./screens/Home";
import DrawRoot from "./components/navigation/Drawer";
import PosScreen from "./screens/Pos";
import ManageStaff from "./screens/ManageStaff";
import ManageTrashStaff from "./screens/ManageTrashStaff";
import ManageEditExpenses from "./screens/ManageEditExpenses";
import ManageProductsInstock from "./screens/ManageProductsInstock";
import ManageExpiredProducts from "./screens/ManageExpiredProducts";
import ManageProductsAboutToExpire from "./screens/ManageProductsAboutToExpire";
import ManageProductOutOfStock from "./screens/ManageProductOutOfStock";
import ManageProductsAboutOutOfStock from "./screens/ManageProductsAboutOutOfStock";
// import ManageTrashStaff from "./screens/ManageTrashStaff";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootNavigation() {
  return (
    <AuthProvider>
      <StatusBar backgroundColor={colors.primary} />
      <NavigationContainer>
        <ScreensNav />
      </NavigationContainer>
    </AuthProvider>
  );
}

function Tabs(props) {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Pos"
          component={PosScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="post"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={focused ? "green" : "black"}
                />
                <Text style={{ color: focused ? "crimson" : "black" }}>
                  POS
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ManageStaff"
          component={ManageStaff}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="account-group"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={focused ? "green" : "black"}
                />
                <Text style={{ color: focused ? "crimson" : "black" }}>
                  Manage Staff
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="ManageTrashStaff"
          component={ManageTrashStaff}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="account-group"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={focused ? "green" : "black"}
                />
                <Text style={{ color: focused ? "crimson" : "black" }}>
                  Trash Staff
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

function ScreensNav(props) {
  const [auth, setAuth] = useContext(AuthContext);
  const authenticated = auth && auth.token !== "" && auth.user !== null;

  return (
    <Stack.Navigator initialRouteName="Login">
      {authenticated ? (
        <>
          <Stack.Screen
            name="DrawRoot"
            component={DrawRoot}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageEditExpenses"
            component={ManageEditExpenses}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageProductsInstock"
            component={ManageProductsInstock}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageExpiredProducts"
            component={ManageExpiredProducts}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageProductsAboutToExpire"
            component={ManageProductsAboutToExpire}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageProductOutOfStock"
            component={ManageProductOutOfStock}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageProductsAboutOutOfStock"
            component={ManageProductsAboutOutOfStock}
            options={{ headerShown: false }}
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
