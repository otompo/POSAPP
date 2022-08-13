import React, { useContext, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Home({ navigation }) {
  const [auth, setAuth] = useContext(AuthContext);
  //   const { user } = state;
  useEffect(() => {
    if (!auth) {
      navigation.navigate("SIgin");
    }
  }, []);

  const handleSignout = async () => {
    setAuth({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Home" />
      <Text>Home</Text>
      <Text>{JSON.stringify(auth, null, 2)}</Text>
      <View>
        <TouchableOpacity onPress={handleSignout}>
          <Text>LogOut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({});
