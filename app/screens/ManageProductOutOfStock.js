import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageProductOutOfStock(props) {
  return (
    <>
      <Header HeaderTitle="Products OutOf Stock" justifyContent="center" />
      <Text>Products Instock</Text>
    </>
  );
}

export default ManageProductOutOfStock;

const styles = StyleSheet.create({});
