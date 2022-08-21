import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageDailySales({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Daily Sales" />
      <Text>Manage Daily Sales</Text>
    </View>
  );
}

export default ManageDailySales;

const styles = StyleSheet.create({});
