import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";
import { AuthContext } from "../context/authContext";

function Profile({ navigation }) {
  const [auth, setAuth] = useContext(AuthContext);

  useEffect(() => {
    if (!auth) {
      navigation.navigate("Login");
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Profile" />
      <Text>{JSON.stringify(auth, null, 2)}</Text>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({});
