import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageStatistics({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Daily Sales" />
      <Text>Manage Statistics</Text>
    </View>
  );
}

export default ManageStatistics;

const styles = StyleSheet.create({});
