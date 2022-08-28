import React, { useEffect, useState, useContext } from "react";
import {
  RefreshControl,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import ListActions from "../components/ListActions";
import ListItems from "../components/ListItems";
import Header from "../components/Header";
import Search from "../components/Search";
import { addToPurchase } from "../actions/Actions";
import FormatCurrency from "../helpers/FormatCurrency";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PurchaseContext } from "../context/purchaseContext";
import axios from "axios";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import colors from "../config/colors";

const { width } = Dimensions.get("window");

function ManagePurchase({ navigation }) {
  const { stateData, dispatch } = useContext(PurchaseContext);
  const { cart } = stateData;
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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
  }, [cart]);

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
              dispatch(addToPurchase(item, cart)), reset();
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
        HeaderTitle={
          <MaterialCommunityIcons name="cart-arrow-down" size={25} />
        }
        HeaderSubTitle="Purchase Products"
        cartData={`${cart?.length}`}
        onPress={() => navigation.navigate("ManagePurcahseCartItems")}
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
            {products.length &&
              products.filter(searched(keyword)).map((product, index) => (
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
                          dispatch(addToPurchase(product, cart)), reset();
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

export default ManagePurchase;

const styles = StyleSheet.create({});
