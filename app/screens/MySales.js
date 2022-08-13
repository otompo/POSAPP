import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function MySales({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="My Sales" />
      <Text>MySales</Text>
    </View>
  );
}

export default MySales;

const styles = StyleSheet.create({});
