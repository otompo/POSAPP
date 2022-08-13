import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageExpenses({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Expenses" />
      <Text>Manage Expenses</Text>
    </View>
  );
}

export default ManageExpenses;

const styles = StyleSheet.create({});
