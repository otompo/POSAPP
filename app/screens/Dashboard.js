import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";
import Header from "../components/Header";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormatCurrency from "../helpers/FormatCurrency";
import AdminCards from "../components/AdminCards";
import axios from "axios";
import useNumbers from "../hooks/useNumbers";

function Dashboard({ navigation }) {
  const [state, setState] = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadedTotalProduct, setLoadedTotalProduct] = useState("");
  const [loadedTotalSales, setLoadedTotalSales] = useState([]);
  const [totalSales, setTotalSales] = useState("");

  const { users, categories, products } = useNumbers();

  useEffect(() => {
    if (!state) {
      navigation.navigate("Login");
    }
  }, []);

  useEffect(() => {
    getTotalSales();
  }, []);
  const getTotalSales = async () => {
    try {
      const { data } = await axios.get(`/api/admin/getNumbers/sales`);

      setTotalSales(data.totalSales);
    } catch (err) {
      console.log(err);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getTotalSales();
      setRefreshing(false);
    }, 2000);
  };

  // let sum = 0;
  // loadedTotalSales.forEach((value) => {

  //   sum += value.totalAmount;
  // });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header navigation={navigation} HeaderTitle="Admin Dashboard" />
      <AdminCards title="Total Users" data={users} />
      <AdminCards title="Total Products" data={products} />
      <AdminCards title="Total Categories" data={categories} />
      <AdminCards
        title="Total Sales"
        data={FormatCurrency(Number(totalSales))}
      />
    </ScrollView>
  );
}

export default Dashboard;

const styles = StyleSheet.create({});
