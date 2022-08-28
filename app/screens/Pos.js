import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  FlatList,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Text,
  Dimensions,
  SafeAreaView,
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
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";

const { width } = Dimensions.get("window");
function PosScreen({ navigation }) {
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const [productsSearch, setProductsSearch] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
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
        dim.height = (width * 1) / 3.5;
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
    loadProducts();
    loadProductsSearch();
    // loadProductsCount();
  }, [cart]);

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
      const { data } = await axios.get(`/api/admin/products`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // const loadProductsCount = async () => {
  //   const { data } = await axios.get(`/api/admin/products/mobile/count`);
  //   setProductsCount(data);
  // };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      // loadProductsCount();
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

  const rowRenderer = (type, item, index) => {
    // console.log(item);
    return (
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
    );
  };
  if (!products?.length) return null;

  return (
    <>
      <Header
        navigation={navigation}
        HeaderSubTitle="Sell Products"
        HeaderTitle={<MaterialCommunityIcons name="cart-arrow-up" size={25} />}
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

      <SubHeader
        buttonTitle={
          <>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={30}
              color={colors.white}
            />
            <Text
              style={{
                color: colors.white,
                textTransform: "uppercase",
                padding: 5,
              }}
            >
              Scan to add to cart
            </Text>
          </>
        }
        // buttonTitle="Scan To add to Cart"
        // onPress={toggleModal}
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
          </ScrollView>
        </>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <RecyclerListView
            style={{ flex: 1 }}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            rowRenderer={rowRenderer}
            // onEndReached={onEndReached}
            // onEndReachedThreshold={0.5}
            // renderFooter={renderFooter}
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

export default PosScreen;

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
