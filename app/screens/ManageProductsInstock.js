import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageProductsInstock({ navigation }) {
  return (
    <>
      <Header HeaderTitle="Products Instock" justifyContent="center" />
      <Text>Products Instock</Text>
    </>
  );
}

export default ManageProductsInstock;

const styles = StyleSheet.create({});
