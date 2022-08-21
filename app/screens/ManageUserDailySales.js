import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageUserDailySales({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage User Daily Sales" />
      <Text>ManageUserDailySales</Text>
    </View>
  );
}

export default ManageUserDailySales;

const styles = StyleSheet.create({});
