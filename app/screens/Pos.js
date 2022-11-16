import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  Text,
  Dimensions,
  SafeAreaView,
  ToastAndroid,
  Platform,
  AlertIOS,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListActions from "../components/ListActions";
import Header from "../components/Header";
import axios from "axios";
import Search from "../components/Search";
import ListItems from "../components/ListItems";
import CategoriesMenu from "../components/CategoriesMenu";
import FormatCurrency from "../helpers/FormatCurrency";
import { CartContext } from "../context/cartContext";
import { addToCart } from "../actions/Actions";
import Modal from "react-native-modal";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import ModalTopInfor from "../components/ModalTopInfor";
import * as Haptics from "expo-haptics";
const { width } = Dimensions.get("window");

function PosScreen({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const [productsSearch, setProductsSearch] = useState([]);
  // const [productsCount, setProductsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);

  let yourArr = [];
  yourArr.push(scannedData);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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

  useEffect(() => {
    loadProducts();
    loadProductsSearch();
    loadCategories();
  }, [cart]);

  const askPermissions = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setShowScanner(status == "granted");
    })();
  };

  const searched = (keyword) => (item) => {
    return item.name.toLowerCase().includes(keyword.toLowerCase());
  };

  const handlePress = () => {
    setKeyword("");
    Keyboard.dismiss();
  };

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

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`/api/category`);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleScanned = ({ type, data }) => {
    let stringdata = JSON.parse(data);
    setScannedData(stringdata);
    // Vibration.vibrate();
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // console.log(data.name);
    // if (Platform.OS === "android") {
    //   ToastAndroid.showWithGravityAndOffset(
    //     "Success",
    //     ToastAndroid.SHORT,
    //     ToastAndroid.BOTTOM,
    //     25,
    //     50
    //   );
    // } else {
    //   AlertIOS.alert("Success");
    // }

    // if (data) {
    // setShowScanner(false);
    // setScanned(true);
    // setScannedData("");
    // setScanned(false);
    // }
  };

  // const loadProductsCount = async () => {
  //   const { data } = await axios.get(`/api/admin/products/mobile/count`);
  //   setProductsCount(data);
  // };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      loadCategories();
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
        onPress={() => (askPermissions, setModalVisible(true))}
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
        <>
          <View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              style={styles.flatList}
              keyExtractor={(category) => category._id.toString()}
              renderItem={({ item }) => (
                <CategoriesMenu
                  title={item.name}
                  // icon={item.icon}
                  onPress={() => navigation.navigate("CategoryDetails", item)}
                />
              )}
            />
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <RecyclerListView
              dataProvider={dataProvider}
              layoutProvider={layoutProvider}
              rowRenderer={rowRenderer}
              scrollViewProps={{
                refreshControl: (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                ),
              }}
            />
          </SafeAreaView>
        </>
      )}

      <Modal isVisible={isModalVisible}>
        <View
          style={{
            // flex: 1,
            color: colors.white,
            backgroundColor: colors.white,
            borderRadius: 5,
            padding: 10,
          }}
        >
          <ModalTopInfor title="+ SCAN DATA" handlePress={toggleModal} />

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleScanned}
              style={{
                height: width,
                width: width,
                flexDirection: "column",
                justifyContent: "center",
              }}
            />
          </View>

          <ScrollView
            contentContainerStyle={{
              marginVertical: 20,
              marginHorizontal: 20,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {scannedData.name}
              </Text>
              {scannedData ? (
                <TouchableOpacity
                  onPress={() => {
                    // console.log(yourArr);
                    dispatch(addToCart(scannedData, yourArr));
                  }}
                  style={{
                    height: 35,
                    width: 35,
                    backgroundColor: colors.toolbar,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    elevation: 2,
                  }}
                >
                  {/* <Text>addToCart</Text> */}
                  <MaterialCommunityIcons
                    name="cart"
                    size={25}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  flatList: {
    height: 62,
    flexGrow: 0,
  },
});
