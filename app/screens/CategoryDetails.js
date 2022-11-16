import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import ListActions from "../components/ListActions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CartContext } from "../context/cartContext";
import { addToCart } from "../actions/Actions";
import Header from "../components/Header";
import colors from "../config/colors";
import axios from "axios";
import ListItems from "../components/ListItems";
import { SafeAreaView } from "react-native";
import FormatCurrency from "../helpers/FormatCurrency";
const { width } = Dimensions.get("window");

function CategoryDetails({ route, navigation }) {
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const category = route.params;
  const id = category._id;
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cartData, setCartData] = useState({});

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
    getProductCategory();
  }, [cart]);

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(products));
  }, [products]);

  const getProductCategory = async () => {
    try {
      setSuccess(true);
      const { data } = await axios.get(`/api/products/${id}`);
      setProducts(data);
      setSuccess(false);
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getProductCategory();
      setRefreshing(false);
    }, 2000);
  };
  // if (success) {
  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //         height: "100%",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Image
  //         source={require("../assets/loader.gif")}
  //         style={{ height: 100, width: 100 }}
  //       />
  //     </View>
  //   );
  // }

  const rowRenderer = (type, item, index) => {
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
        // back={navigation}
        HeaderSubTitle="Sell Products"
        HeaderTitle={<MaterialCommunityIcons name="cart-arrow-up" size={25} />}
        cartData={`${cart?.length}`}
        onPress={() => navigation.navigate("ManageCartItems")}
        backIcon={() => navigation.goBack()}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <RecyclerListView
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
        />
      </SafeAreaView>
    </>
  );
}

export default CategoryDetails;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    borderColor: colors.primary,
    marginRight: 10,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  footerTabs: {
    justifyContent: "flex-end",
    backgroundColor: colors.secoundary,
  },
  infoTop: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
