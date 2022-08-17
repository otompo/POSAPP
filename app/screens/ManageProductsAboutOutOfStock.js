import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageProductsAboutOutOfStock(props) {
  return (
    <>
      <Header
        HeaderTitle="Products About to OutOf Stock"
        justifyContent="center"
      />
      <Text>Products Instock</Text>
    </>
  );
}

export default ManageProductsAboutOutOfStock;

const styles = StyleSheet.create({});
