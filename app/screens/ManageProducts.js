import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ToastAndroid,
  Platform,
  AlertIOS,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
} from "react-native";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import ModalTopInfor from "../components/ModalTopInfor";
import ListItems from "../components/ListItems";
import ListActions from "../components/ListActions";
import colors from "../config/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import Header from "../components/Header";
import FormatCurrency from "../helpers/FormatCurrency";
import SubHeader from "../components/SubHeader";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "../components/Search";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";
const { width } = Dimensions.get("window");
function ManageProducts({ navigation }) {
  const [value, setValue] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalAboutOutStock, setTotalAboutOutStock] = useState("");
  const [totalInStock, setTotalInStock] = useState("");
  const [totalOutOfStock, setTotalOutOfStock] = useState("");
  const [totalAboutToExpire, setTotalAboutToExpire] = useState("");
  const [totalExpire, setTotalExpire] = useState("");
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState({});
  const [actionTriggered, setActionTriggered] = useState("");
  const [name, setName] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [slug, setSlug] = useState("");
  const [expireDate, setExpireDate] = useState(new Date());
  const [newName, setNewName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newCostPrice, setNewCostPrice] = useState("");
  const [newSellingPrice, setNewSellingPrice] = useState("");
  const [newExpiredDate, setNewExpiredDate] = useState("");
  var previousDate = moment(newExpiredDate).format("MMM Do, Y");
  const [dates, setDates] = useState(Date(previousDate).toDateString);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [preCategoriesName, setPreCategoriesName] = useState([]);
  const [preCategoriesId, setPreCategoriesId] = useState([]);
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
        dim.height = (width * 1) / 2;
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
    if (!current) {
      return;
    } else {
      setNewName(current.name);
      setNewQuantity(current.quantity);
      setNewCostPrice(current.costPrice);
      setNewSellingPrice(current.sellingPrice);
      setNewExpiredDate(current.expireDate);
      setSlug(current.slug);
    }
  }, [current]);

  useEffect(() => {
    if (!current) {
      return;
    } else {
      let arrName = [];
      let arrId = [];
      current &&
        current.category &&
        current.category.map((c) => arrName.push(c.name));
      current &&
        current.category &&
        current.category.map((c) => arrId.push(c._id));
      // console.log(arrName);
      setPreCategoriesName(arrName);
      setPreCategoriesId(arrId[0]);
    }
  }, [current]);

  const preCate = async () => {
    if (!current) {
      return;
    } else {
      let arrName = [];
      let arrId = [];
      (await current) &&
        current.category &&
        current.category.map((c) => arrName.push(c.name));
      (await current) &&
        current.category &&
        current.category.map((c) => arrId.push(c._id));
      // console.log(arrName);
      setPreCategoriesName(arrName);
      setPreCategoriesId(arrId[0]);
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setExpireDate(date);
    setDates(date);
    setNewExpiredDate(date);
    hideDatePicker();
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadTotalInStock();
    loadTotalOutOfStock();
    loadTotalAboutToExpire();
    loadTotalExpired();
    loadTotalAboutOutOfStock();
  }, [success]);

  const handleCreateSubmit = async (e) => {
    if (!name || !costPrice || !quantity || !value || !sellingPrice) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "All fields is required",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("All fields are required");
      }

      return;
    }
    try {
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/products`, {
        name,
        quantity,
        costPrice,
        sellingPrice,
        selectedCategory: value && value,
        expireDate,
      });
      setName("");
      setQuantity("");
      setCostPrice("");
      setSellingPrice("");
      setValue(null);
      setExpireDate(new Date());
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
      console.log(err);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          err.response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert(err.response.data.message);
      }
      setSuccess(false);
    }
  };

  const loadTotalInStock = async () => {
    try {
      // setSuccess(true);
      const { data } = await axios.get(`/api/admin/products/instock`);
      setTotalInStock(data.total);
      // setSuccess(false);
    } catch (err) {
      console.log(err);
      // setSuccess(false);
    }
  };

  const loadTotalAboutOutOfStock = async () => {
    try {
      const { data } = await axios.get(`/api/admin/products/aboutoutstock`);
      setTotalAboutOutStock(data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTotalOutOfStock = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/outofstock`);
      setTotalOutOfStock(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadTotalAboutToExpire = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/products/productsabouttoexpired`
      );
      setTotalAboutToExpire(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadTotalExpired = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/products/expired`);
      setTotalExpire(data.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`/api/admin/category`);
      setCategories(data.category);
    } catch (err) {
      console.log(err);
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

  const handleDelete = async (index) => {
    try {
      setLoading(true);
      let allProducts = products;
      const removed = allProducts.splice(index, 1);
      setProducts(allProducts);
      const { data } = await axios.delete(
        `/api/admin/products/${removed[0]._id}`
      );

      setLoading(false);
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
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRestockSubmit = async () => {
    try {
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/outofstock/update/${slug}`,
        {
          quantity: newQuantity,
          currentQty: current.quantity,
        }
      );
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
      setNewQuantity("");
      setSuccess(false);
      setModalVisible(false);
    } catch (err) {
      setSuccess(false);
      setQuantity("");
    }
  };

  const handleUpdateSubmit = async () => {
    if (selectedCategory.length === 0) {
      try {
        setSuccess(true);
        const { data } = await axios.put(`/api/admin/products/edit/${slug}`, {
          name: newName,
          quantity: newQuantity,
          costPrice: newCostPrice,
          sellingPrice: newSellingPrice,
          expireDate: newExpiredDate,
          selectedCategory: preCategoriesId,
        });

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
        setSelectedCategory([]);
        setPreCategoriesId([]);
      } catch (err) {
        console.log(err.response.data.message);
        setSuccess(false);
      }
    } else {
      try {
        setSuccess(true);
        const { data } = await axios.put(`/api/admin/products/edit/${slug}`, {
          name: newName,
          quantity: newQuantity,
          costPrice: newCostPrice,
          sellingPrice: newSellingPrice,
          expireDate: newExpiredDate,
          selectedCategory,
        });

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
        setSelectedCategory([]);
      } catch (err) {
        console.log(err.response.data.message);
        setSuccess(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadProducts();
      loadCategories();
      loadTotalInStock();
      loadTotalOutOfStock();
      loadTotalAboutToExpire();
      loadTotalExpired();
      setRefreshing(false);
    }, 2000);
  };

  const rowRenderer = (type, item, index) => {
    // console.log(item);
    return (
      <ListItems
        chevronActive={true}
        iconActive={true}
        icon="cog"
        mainTitleText="Name:"
        titleText="Category:"
        subTitleText="Quantity:"
        subSubTitleText="Cost Price:"
        subSubSubTitleText="Selling Price:"
        subSubSubSubTitleText="Expired Date:"
        subSubSubSubSubTitleText="CreatedAt:"
        mainTitle={item.name}
        subTitle={`${item.quantity}`}
        subSubTitle={FormatCurrency(Number(item.costPrice))}
        subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
        title={
          item && item.category && item.category.map((c, i) => `${c && c.name}`)
        }
        subSubSubSubTitle={`${moment(item && item.expireDate).format("LL")} `}
        subSubSubSubSubTitle={`${moment(item.createdAt).format("LL")} `}
        rightContent={(reset) => (
          <ListActions
            icon={"delete-empty"}
            onPress={() => (handleDelete(index), reset())}
          />
        )}
        leftContent={(reset) => (
          <>
            <ListActions
              minHeight="100%"
              bcolor="airblue"
              icon="pencil"
              onPress={() => {
                // navigation.navigate("ManageEditExpenses", item);
                setCurrent(item);
                setModalVisible(true);
                setActionTriggered("ACTION_2");
                reset();
              }}
            />
          </>
        )}
      />
    );
  };
  if (!products?.length) return null;

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Products" />
      <Search
        proWidth
        value={keyword}
        setValue={setKeyword}
        placeholder="Search products..."
        handlePress={handlePress}
      />
      <SubHeader
        buttonTitle="+ ADD PRODUCT"
        onPress={() => {
          setModalVisible(true);
          setActionTriggered("ACTION_1");
        }}
      />
      <View style={{ height: 80 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Menu
            title="In-Stock"
            subTitle={totalInStock && totalInStock}
            onPress={() => navigation.navigate("ManageProductsInstock")}
          />
          <Menu
            title="Out-of-Stock"
            subTitle={totalOutOfStock && totalOutOfStock}
            onPress={() => navigation.navigate("ManageProductOutOfStock")}
          />
          <Menu
            title="ABOUT TO Go OUTOF STOCK"
            subTitle={totalAboutOutStock && totalAboutOutStock}
            onPress={() => navigation.navigate("ManageProductsAboutOutOfStock")}
          />
          <Menu
            title="About-to Expire"
            subTitle={totalAboutToExpire && totalAboutToExpire}
            onPress={() => navigation.navigate("ManageProductsAboutToExpire")}
          />
          <Menu
            title="Expired"
            subTitle={totalExpire && totalExpire}
            onPress={() => navigation.navigate("ManageExpiredProducts")}
          />
        </ScrollView>
      </View>
      {keyword ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            // style={{ backgroundColor: colors.danger }}
          >
            {products.length > 0 ? (
              products.filter(searched(keyword)).map((product, index) => (
                <ListItems
                  key={index}
                  chevronActive={true}
                  iconActive={true}
                  icon="cog"
                  mainTitleText="Name:"
                  titleText="Category:"
                  subTitleText="Quantity:"
                  subSubTitleText="Cost Price:"
                  subSubSubTitleText="Selling Price:"
                  subSubSubSubTitleText="Expired Date:"
                  subSubSubSubSubTitleText="CreatedAt:"
                  mainTitle={product.name}
                  subTitle={`${product.quantity}`}
                  subSubTitle={FormatCurrency(Number(product.costPrice))}
                  subSubSubTitle={FormatCurrency(Number(product.sellingPrice))}
                  category={
                    product &&
                    product.category &&
                    product.category.map((c, i) => `${c && c.name} `)
                  }
                  title={
                    product &&
                    product.category &&
                    product.category.map((c, i) => `${c && c.name}`)
                  }
                  subSubSubSubTitle={`${moment(
                    product && product.expireDate
                  ).format("LL")} `}
                  subSubSubSubSubTitle={`${moment(product.createdAt).format(
                    "LL"
                  )} `}
                  rightContent={(reset) => (
                    <ListActions
                      icon={"delete-empty"}
                      onPress={() => (handleDelete(index), reset())}
                    />
                  )}
                  leftContent={(reset) => (
                    <>
                      <ListActions
                        minHeight="100%"
                        bcolor="airblue"
                        icon="pencil"
                        onPress={() => {
                          // navigation.navigate("ManageEditExpenses", item);
                          setCurrent(product);
                          setModalVisible(true);
                          setActionTriggered("ACTION_2");
                          reset();
                        }}
                      />
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
            // onEndReached={onEndReached}
            // onEndReachedThreshold={0.5}
            // renderFooter={renderFooter}
            // renderAheadOffset={0}
            scrollViewProps={{
              refreshControl: (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ),
            }}
          />
        </SafeAreaView>
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
          <ModalTopInfor
            title={
              actionTriggered === "ACTION_1" ? (
                <Text
                  style={{ textTransform: "uppercase", color: colors.primary }}
                >
                  + ADD PRODUCT
                </Text>
              ) : (
                <Text
                  style={{ textTransform: "uppercase", color: colors.primary }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={colors.dark}
                  />
                  {current.name}
                </Text>
              )
            }
            handlePress={toggleModal}
          />
          {actionTriggered === "ACTION_1" ? (
            <>
              <AppTextInput
                autoCapitalize="words"
                autoCorrect={false}
                icon="pencil"
                placeholder="Enter full name"
                value={name}
                setValue={setName}
              />

              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="rhombus-split"
                placeholder="Enter Quantity"
                keyboardType="numeric"
                value={quantity}
                setValue={setQuantity}
              />

              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter Cost Price"
                keyboardType="numeric"
                value={costPrice}
                setValue={setCostPrice}
              />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter Selling Price"
                keyboardType="numeric"
                value={sellingPrice}
                setValue={setSellingPrice}
              />
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  autoCorrect={false}
                  style={{
                    borderBottomWidth: 0.5,
                    height: 50,
                    width: "80%",
                    borderBottomColor: colors.primary,
                    borderRadius: 2,
                  }}
                  value={moment(expireDate).format("LL")}
                  onChangeText={setExpireDate}
                />
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateButton}
                >
                  <Text style={styles.text}>Expiry</Text>
                  <Text style={styles.text}>Date</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                minimumDate={new Date()}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                placeholderText="This is disabled"
              />
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={categories}
                search
                maxHeight={300}
                labelField="name"
                valueField="_id"
                placeholder="Select Category"
                searchPlaceholder="Search..."
                value={value}
                onChange={(item) => {
                  setValue(item._id);
                }}
                renderLeftIcon={() => (
                  <MaterialCommunityIcons
                    style={styles.icon}
                    color={colors.primary}
                    name="check-circle"
                    size={20}
                  />
                )}
              />
              <SubmitButton
                title="Save"
                onPress={handleCreateSubmit}
                loading={loading}
              />
            </>
          ) : (
            <>
              <Text style={styles.labelText}>Product Name</Text>
              <AppTextInput
                autoCapitalize="words"
                autoCorrect={false}
                icon="pencil"
                placeholder="Enter full name"
                value={newName}
                setValue={setNewName}
              />
              <Text style={styles.labelText}>Product Quantity</Text>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="rhombus-split"
                placeholder="Enter Quantity"
                keyboardType="numeric"
                value={`${newQuantity}`}
                setValue={setNewQuantity}
                editable={false}
              />
              <Text style={styles.labelText}>Product Cost Price</Text>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter Cost Price"
                keyboardType="numeric"
                value={`${newCostPrice}`}
                setValue={setNewCostPrice}
              />
              <Text style={styles.labelText}>Product Selling Price</Text>
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter Selling Price"
                keyboardType="numeric"
                value={`${newSellingPrice}`}
                setValue={setNewSellingPrice}
              />
              <Text style={styles.labelText}>Select Expiry Date</Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  autoCorrect={false}
                  style={{
                    borderBottomWidth: 0.5,
                    height: 50,
                    width: "80%",
                    borderBottomColor: colors.primary,
                    borderRadius: 2,
                  }}
                  value={
                    moment(dates).format("LL")
                      ? moment(newExpiredDate).format("LL")
                      : moment(newExpiredDate).format("LL")
                  }
                  onChangeText={(date) => setDates(date)}
                />
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateButton}
                >
                  <Text style={styles.text}>Expiry</Text>
                  <Text style={styles.text}>Date</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Text style={styles.labelText}>Select Category</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={categories}
                search
                maxHeight={300}
                labelField="name"
                valueField="_id"
                placeholder={preCategoriesName[0]}
                searchPlaceholder="Search..."
                value={selectedCategory}
                onChange={(item) => {
                  setSelectedCategory(item._id);
                }}
                renderLeftIcon={() => (
                  <MaterialCommunityIcons
                    style={styles.icon}
                    color={colors.primary}
                    name="check-circle"
                    size={20}
                  />
                )}
              />

              <SubmitButton
                title="Update"
                onPress={handleUpdateSubmit}
                loading={loading}
              />
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

export default ManageProducts;

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 60,
    height: 60,
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold",
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  labelText: { fontSize: 12 },
});
