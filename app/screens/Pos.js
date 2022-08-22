import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  ScrollView,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListActions from "../components/ListActions";
import Header from "../components/Header";
import axios from "axios";
import Search from "../components/Search";
import ListItems from "../components/ListItems";
import FormatCurrency from "../helpers/FormatCurrency";
import SubmitButton from "../components/Button/SubmitButton";
import { CartContext } from "../context/cartContext";
import { addToCart } from "../actions/Actions";

function PosScreen({ navigation }) {
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const [productsSearch, setProductsSearch] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const searched = (keyword) => (item) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  };

  const handlePress = () => {
    setKeyword("");
    Keyboard.dismiss();
  };

  useEffect(() => {
    loadProducts();
    loadProductsSearch();
    loadProductsCount();
  }, []);

  const loadProductsSearch = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products`);
      setProductsSearch(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/mobile?page=` + page
      );
      setPage(page + 1);
      setProducts([...products, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadProductsCount = async () => {
    const { data } = await axios.get(`/api/admin/products/mobile/count`);
    setProductsCount(data);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      setRefreshing(false);
    }, 2000);
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //         height: "100%",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <View style={styles.footer}>
        {productsCount > products?.length && (
          <SubmitButton
            loading={loading}
            title="Load more"
            onPress={loadProducts}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <Header
        navigation={navigation}
        HeaderTitle={<MaterialCommunityIcons name="cart" size={25} />}
        cartData={`${cart?.length}`}
        onPress={() => navigation.navigate("ManageCartItems")}
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {productsSearch.length &&
              productsSearch.filter(searched(keyword)).map((product, index) => (
                <>
                  <ListItems
                    key={index}
                    chevronActive={true}
                    iconActive={false}
                    mainTitleText="Name:"
                    subTitleText="Quantity:"
                    subSubSubTitleText="Selling Price:"
                    mainTitle={product.name}
                    subTitle={`${product.quantity}`}
                    subSubSubTitle={FormatCurrency(
                      Number(product.sellingPrice)
                    )}
                    rightContent={(reset) => (
                      <ListActions
                        bcolor="online"
                        icon="cart"
                        onPress={() => {
                          dispatch(addToCart(product, cart)), reset();
                        }}
                      />
                    )}
                  />
                </>
              ))}
            {/* {productsCount > products?.length && (
              <SubmitButton
                title="Load more"
                loading={loading}
                onPress={loadProducts}
              />
            )} */}
          </ScrollView>
        </>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(product, index) => index.toString()}
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
                subTitleText="Quantity:"
                subSubSubTitleText="Selling Price:"
                mainTitle={item.name}
                subTitle={`${item.quantity}`}
                subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
                rightContent={(reset) => (
                  <ListActions
                    bcolor="online"
                    icon="cart"
                    onPress={() => {
                      dispatch(addToCart(item, cart)), reset();
                    }}
                  />
                )}
              />
            </View>
          )}
          enableEmptySections={true}
          ListFooterComponent={renderFooter}
        />
      )}
    </>
  );
}

export default PosScreen;

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
