import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ToastAndroid,
  Platform,
  AlertIOS,
  SafeAreaView,
  Dimensions,
  RefreshControl,
  View,
  Text,
  ScrollView,
  Keyboard,
} from "react-native";
import FormatCurrency from "../helpers/FormatCurrency";
import ListActions from "../components/ListActions";
import ListItems from "../components/ListItems";
import Header from "../components/Header";
import colors from "../config/colors";
import axios from "axios";
import moment from "moment";
import Search from "../components/Search";

import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

const { width } = Dimensions.get("window");

function ManageProductsAboutToExpire(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    })
  );

  const [layoutProvider] = useState(
    new LayoutProvider(
      (index) => {
        return index;
      },
      (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = (width * 1) / 2.3;
      }
    )
  );

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(products));
  }, [products]);

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

  const rowRenderer = (type, item, index) => {
    // console.log(item);
    return (
      <ListItems
        key={index}
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
          item && item.category && item.category.map((c, i) => `${c && c.name}`)
        }
        subSubSubSubTitle={`${moment(item && item.expireDate).format("LL")} `}
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
    );
  };
  if (!products?.length) return null;

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
      {keyword ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // style={{ backgroundColor: colors.danger }}
          >
            {products.length > 0 ? (
              products.filter(searched(keyword)).map((product, index) => (
                <ListItems
                  chevronActive={true}
                  iconActive={false}
                  mainTitleText="Name:"
                  titleText="Category:"
                  subTitleText="Quantity:"
                  subSubTitleText="Cost Price:"
                  subSubSubTitleText="Selling Price:"
                  subSubSubSubTitleText="Expired Date:"
                  mainTitle={product.name}
                  subTitle={`${product.quantity}`}
                  subSubTitle={FormatCurrency(Number(product.costPrice))}
                  subSubSubTitle={FormatCurrency(Number(product.sellingPrice))}
                  title={
                    product &&
                    product.category &&
                    product.category.map((c, i) => `${c && c.name}`)
                  }
                  subSubSubSubTitle={`${moment(
                    product && product.expireDate
                  ).format("LL")} `}
                  rightContent={(reset) => (
                    <>
                      {product && product.active ? (
                        <>
                          <ListActions
                            bcolor="online"
                            icon={"check-circle"}
                            onPress={(e) => (
                              handleMakeProductActive(e, product.slug), reset()
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <ListActions
                            icon={"close-circle-outline"}
                            onPress={(e) => (
                              handleMakeProductInactive(e, product.slug),
                              reset()
                            )}
                          />
                        </>
                      )}
                    </>
                  )}
                />
              ))
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: colors.dark, fontSize: 20 }}>
                  No Result found
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            rowRenderer={rowRenderer}
            renderAheadOffset={0}
            scrollViewProps={{
              refreshControl: (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ),
            }}
          />
        </SafeAreaView>
      )}
    </>
  );
}

export default ManageProductsAboutToExpire;

const styles = StyleSheet.create({});
