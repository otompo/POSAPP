import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Header from "../components/Header";

function ManageProducts({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Products" />
      <Text>Manage Products</Text>
    </View>
  );
}

export default ManageProducts;

const styles = StyleSheet.create({});
