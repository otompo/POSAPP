import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import { AuthContext } from "../context/authContext";

function Settings({ navigation }) {
  const [auth, setAuth] = useContext(AuthContext);
  useEffect(() => {
    if (!auth) {
      navigation.navigate("Login");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Settings" />
      <Text>{JSON.stringify(auth, null, 2)}</Text>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({});
