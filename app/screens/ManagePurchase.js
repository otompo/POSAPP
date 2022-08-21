import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManagePurchase({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Purchase" />
      <Text>ManagePurchase</Text>
    </View>
  );
}

export default ManagePurchase;

const styles = StyleSheet.create({});
