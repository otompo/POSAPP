import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import HomeScreen from "../../screens/HomeScreen";
import Profile from "../../screens/Profile";

const Tab = createBottomTabNavigator();

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
          name="Home2"
          component={SimpleScreen}
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
                  name="home-circle"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={focused ? "green" : "black"}
                />
                <Text style={{ color: focused ? "crimson" : "black" }}>
                  Home
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{
                    uri: "https://cdn.pixabay.com/photo/2022/08/04/00/51/woman-7363571_960_720.jpg",
                  }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 70,
                    marginTop: 5,
                  }}
                />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default Tabs;

const SimpleScreen = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="OrderScreen" component={OrderScreen} /> */}
      {/* <Stack.Screen name="UpdateProfile" component={UpdateAccount} /> */}
    </Stack.Navigator>
  );
};
