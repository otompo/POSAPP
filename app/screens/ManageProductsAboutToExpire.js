import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ToastAndroid,
  Platform,
  AlertIOS,
  ScrollView,
} from "react-native";
import FormatCurrency from "../helpers/FormatCurrency";
import ListActions from "../components/ListActions";
import ListItems from "../components/ListItems";
import Header from "../components/Header";
import colors from "../config/colors";
import axios from "axios";
import moment from "moment";
import Search from "../components/Search";
import ProductsListItems from "../components/ProductsListItems";

function ManageProductsAboutToExpire(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState("");

  const searched = (keyword) => (item) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  };

  const handlePress = () => {
    setKeyword("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    loadProductsAboutToExpire();
  }, [success]);

  const loadProductsAboutToExpire = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`
      );
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
      }
    } catch (err) {
      console.log(err.response.data.message);
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProductsAboutToExpire();
      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header
        HeaderTitle="Manage Products About To Expire"
        justifyContent="center"
      />
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

export default ManageProductsAboutToExpire;

const styles = StyleSheet.create({});
