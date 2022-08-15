import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageExpiredProducts(props) {
  return (
    <>
      <Header HeaderTitle="Expired Products" justifyContent="center" />
      <Text>Products Instock</Text>
    </>
  );
}

export default ManageExpiredProducts;

const styles = StyleSheet.create({});
