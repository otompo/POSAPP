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
} from "react-native";
import FormatCurrency from "../helpers/FormatCurrency";
import ListActions from "../components/ListActions";
import ListItems from "../components/ListItems";
import Header from "../components/Header";
import colors from "../config/colors";
import axios from "axios";
import moment from "moment";

function ManageProductsInstock(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProductsInStock();
  }, [success]);

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
      {/* <Text>{JSON.stringify(products, null, 2)}</Text> */}
      <FlatList
        data={products}
        keyExtractor={(product) => product._id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <View
            style={{
              backgroundColor: "white",
              elevation: 2,
              marginBottom: 5,
            }}
          >
            <ListItems
              chevronActive={true}
              iconActive={false}
              mainTitleText="Name:"
              titleText="Category:"
              subTitleText="Quantity:"
              subSubTitleText="Cost Price:"
              subSubSubTitleText="Selling Price:"
              subSubSubSubTitleText="Expired Date:"
              mainTitle={item.name}
              subTitle={`${item.quantity}`}
              subSubTitle={FormatCurrency(Number(item.costPrice))}
              subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
              title={
                item &&
                item.category &&
                item.category.map((c, i) => `${c && c.name}`)
              }
              subSubSubSubTitle={`${moment(item && item.expireDate).format(
                "LL"
              )} `}
              rightContent={(reset) => (
                <>
                  {item && item.active ? (
                    <>
                      <ListActions
                        bcolor="online"
                        icon={"check-circle"}
                        onPress={(e) => (
                          handleMakeProductActive(e, item.slug), reset()
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <ListActions
                        icon={"close-circle-outline"}
                        onPress={(e) => (
                          handleMakeProductInactive(e, item.slug), reset()
                        )}
                      />
                    </>
                  )}
                </>
              )}
            />
          </View>
        )}
      />
    </>
  );
}

export default ManageProductsInstock;

const styles = StyleSheet.create({});
