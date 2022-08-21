import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageReports(props) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} HeaderTitle="Manage Reports" />
      <Text>Manage Reports</Text>
    </View>
  );
}

export default ManageReports;

const styles = StyleSheet.create({});
