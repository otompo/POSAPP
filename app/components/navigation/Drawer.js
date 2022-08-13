import React, { useContext, useEffect, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../../context/authContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../../screens/Home";
import Dashboard from "../../screens/Dashboard";
import PosScreen from "../../screens/Pos";
import Settings from "../../screens/Settings";
import MySales from "../../screens/MySales";
import Profile from "../../screens/Profile";
import colors from "../../config/colors";
import DrawerItems from "../../Layout/DrawerItems";
import ManageCategories from "../../screens/ManageCategories";
import ManageProducts from "../../screens/ManageProducts";
import ManageExpenses from "../../screens/ManageExpenses";
import ManageStaff from "../../screens/ManageStaff";
import ManageTrashStaff from "../../screens/ManageTrashStaff";
import { Text, View } from "react-native";
import axios from "axios";

const Drawer = createDrawerNavigator();
function DrawRoot() {
  const [auth, setAuth] = useContext(AuthContext);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (auth.user) {
      const { role } = auth.user;

      setRole(role);
    }
  }, [auth]);

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: "#fff",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
          // marginVertical: 2,
        },
      }}
      drawerContent={(props) => <DrawerItems {...props} />}
    >
      <Drawer.Screen
        name="POS"
        component={PosScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="post"
              size={25}
              style={{ marginBottom: 3, alignSelf: "center" }}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="My Sales"
        component={MySales}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="currency-usd"
              size={25}
              style={{ marginBottom: 3, alignSelf: "center" }}
              color={color}
            />
          ),
        }}
      />
      {role.includes("admin") ? (
        <>
          <Drawer.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="speedometer"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Categories"
            component={ManageCategories}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="domain"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Products"
            component={ManageProducts}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="dolly"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Expenses"
            component={ManageExpenses}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="home-export-outline"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Staff"
            component={ManageStaff}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-group"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Manage Trash Staff"
            component={ManageTrashStaff}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="delete-empty"
                  // name="account-lock"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="cog"
                  size={25}
                  style={{ marginBottom: 3, alignSelf: "center" }}
                  color={color}
                />
              ),
            }}
          />
        </>
      ) : null}

      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account"
              size={25}
              style={{ marginBottom: 3, alignSelf: "center" }}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawRoot;
