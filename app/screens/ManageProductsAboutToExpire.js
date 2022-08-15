import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Header from "../components/Header";

function ManageProductsAboutToExpire(props) {
  return (
    <>
      <Header HeaderTitle="Products About To Expire" justifyContent="center" />
      <Text>Products Instock</Text>
    </>
  );
}

export default ManageProductsAboutToExpire;

const styles = StyleSheet.create({});
