import React, { useState, useEffect } from "react";
import { StyleSheet, ToastAndroid, Platform, AlertIOS } from "react-native";
import Header from "../components/Header";
import axios from "axios";
import Search from "../components/Search";
import ProductsListItems from "../components/ProductsListItems";

function ManageProductsInstock(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadProductsInStock();
  }, [success]);

  const searched = (keyword) => (item) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  };

  const handlePress = () => {
    setKeyword("");
    Keyboard.dismiss();
  };

  const loadProductsInStock = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/instock`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleMakeProductInactive = async (e, slug) => {
    e.preventDefault();
    try {
      setSuccess(true);
      const { data } = await axios.patch(
        `/api/admin/products/available/${slug}`
      );

      setSuccess(false);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("success");
      }
    } catch (err) {
      console.log(err.response.data.message);
      setSuccess(false);
    }
  };

  const handleMakeProductActive = async (e, slug) => {
    e.preventDefault();
    setSuccess(true);
    try {
      const { data } = await axios.put(`/api/admin/products/available/${slug}`);
      setSuccess(false);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "success",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("success");
      }
    } catch (err) {
      console.log(err.response.data.message);
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProductsInStock();
      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header HeaderTitle="Manage Products Instock" justifyContent="center" />
      <Search
        proWidth
        value={keyword}
        setValue={setKeyword}
        placeholder="Search products..."
        handlePress={handlePress}
      />

      <ProductsListItems
        products={products}
        keyword={keyword}
        onRefresh={onRefresh}
        refreshing={refreshing}
        handleMakeProductActive={handleMakeProductActive}
        handleMakeProductInactive={handleMakeProductInactive}
        searched={searched}
      />
    </>
  );
}

export default ManageProductsInstock;

const styles = StyleSheet.create({});
