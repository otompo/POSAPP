import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  RefreshControl,
  TextInput,
  ToastAndroid,
  Platform,
  AlertIOS,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import DatePicker from "../components/DatePicker/DatePicker";
import FormatCurrency from "../helpers/FormatCurrency";
import ListItems from "../components/ListItems";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import moment from "moment";
import axios from "axios";
import PurchaseListItem from "../components/PurchaseListItem";
import ListActions from "../components/ListActions";
import ModalTopInfor from "../components/ModalTopInfor";
import Modal from "react-native-modal";
import AppTextInput from "../components/Auth/AppTextInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
var { width } = Dimensions.get("window");

function ManageAllPurchaseProducts({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ok, setOk] = useState(false);
  const [productsPurchase, setProductsPurchase] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [startdate, setSartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(null);
  const [currentInvoiceID, setCurrentInvoiceID] = useState("");

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    handlePurcahaseSubmit();
  }, [success]);

  const handleUpdateQuantity = async ({
    slug,
    newQuantity,
    previousQuantity,
    purchaseId,
  }) => {
    try {
      setOk(true);
      setSuccess(true);
      const { data } = await axios.put(
        `/api/admin/products/purchase/update/${slug}`,
        {
          purchaseId,
          previousQuantity,
          newQuantity,
          currentInvoiceID,
        }
      );

      setOk(false);
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
    } catch (error) {
      console.log(error);
      setOk(false);
      setSuccess(false);
    }
  };

  const handlePurcahaseSubmit = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/admin/products/purchase/productspurchasebydate?startdate=${moment(
          startdate
        ).format("Y/MM/DD")}&enddate=${moment(enddate).format("Y/MM/DD")}`
      );
      setProductsPurchase(data.docs);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      handlePurcahaseSubmit();
      setRefreshing(false);
    }, 2000);
  };

  const onEdit = ({ id, addedQuantity }) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });
    setQuantity(addedQuantity);
  };

  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null,
    });

    // setUnitPrice(null);
  };

  return (
    <>
      <Header
        justifyContent="center"
        HeaderTitle="Manage All Purchased Products"
        backIcon={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <DatePicker date={startdate} setDate={setSartDate} titleOne="Start" />
        </View>
        <View style={styles.subContainer}>
          <DatePicker date={enddate} setDate={setEndDate} titleOne="End" />
        </View>
      </View>
      <SubHeader
        loading={loading}
        buttonTitle="Submit"
        onPress={handlePurcahaseSubmit}
        backgroundColor="airblue"
      />

      <FlatList
        data={productsPurchase}
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
            {item.products.map((product, i) => (
              <>
                <PurchaseListItem
                  iconActive={false}
                  chevronActive={false}
                  mainTitle={product.name}
                  titleText="Previous Qty:"
                  subTitleText="Added Qty:"
                  subSubTitleText=" New Qty:"
                  title={product.quantity}
                  subTitle={product.count}
                  subSubTitle={product.count + product.quantity}
                />
              </>
            ))}
            <PurchaseListItem
              rightContent={(reset) => (
                <ListActions
                  bcolor="online"
                  icon={"pencil"}
                  onPress={() => {
                    setModalVisible(true);
                    reset();
                    setCurrentProduct(item.products);
                    setCurrentInvoiceID(item.invoiceID);
                  }}
                />
              )}
            />
          </View>
        )}
      />
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
            title="Edit Purchased Products"
            handlePress={toggleModal}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {currentProduct.map((item) => (
              <>
                <View key={item._id}>
                  <Text>{item.name}</Text>
                  {inEditMode.status && inEditMode.rowKey === item._id ? (
                    <AppTextInput
                      autoCorrect={false}
                      placeholder="Enter Quantity..."
                      keyboardType="numeric"
                      value={quantity}
                      setValue={setQuantity}
                    />
                  ) : (
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {item.count}
                    </Text>
                  )}

                  {inEditMode.status && inEditMode.rowKey === item._id ? (
                    <React.Fragment>
                      <View style={styles.leftconstiner}>
                        <Button
                          title={
                            ok ? (
                              <ActivityIndicator
                                size="small"
                                color={colors.white}
                              />
                            ) : null
                          }
                          icon={
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={30}
                              color={colors.white}
                              style={{ marginTop: -6 }}
                            />
                          }
                          onPress={() => {
                            handleUpdateQuantity({
                              slug: item.slug,
                              id: item._id,
                              previousQuantity: item.quantity,
                              purchaseId: item.purchaseId,
                              newQuantity: quantity,
                            });
                          }}
                          buttonStyle={styles.buttonStyle}
                          titleStyle={{
                            textTransform: "uppercase",
                          }}
                        />

                        <Button
                          icon={
                            <MaterialCommunityIcons
                              name="close-circle-outline"
                              size={30}
                              color={colors.white}
                              style={{ marginTop: -6 }}
                            />
                          }
                          onPress={() => {
                            onCancel();
                          }}
                          buttonStyle={[
                            styles.buttonStyle,
                            {
                              backgroundColor: colors.danger,
                            },
                          ]}
                          titleStyle={{
                            textTransform: "uppercase",
                          }}
                        />
                      </View>
                    </React.Fragment>
                  ) : (
                    <Button
                      onPress={() =>
                        onEdit({
                          id: item._id,
                        })
                      }
                      icon={
                        <MaterialCommunityIcons
                          name="pencil"
                          size={28}
                          color={colors.white}
                        />
                      }
                      buttonStyle={{
                        backgroundColor: colors.medium,
                        borderRadius: 7,
                        width: (width * 2) / 2.4,
                        height: 45,
                        marginVertical: 10,
                      }}
                      titleStyle={{
                        textTransform: "uppercase",
                      }}
                    />
                  )}
                </View>
              </>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

export default ManageAllPurchaseProducts;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.airblue,
  },

  subContainer: {
    width: (width * 2) / 5,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  TextInput: {
    borderWidth: 1,
    borderColor: colors.white,
    padding: 7,
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    width: "95%",
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: colors.toolbar,
    borderRadius: 10,
    elevation: 6,
  },
  cartDataStyle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  leftconstiner: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: colors.online,
    borderRadius: 7,
    width: (width * 2) / 5.2,
    height: 45,
    padding: 10,
    // marginLeft: 3,
  },
});
