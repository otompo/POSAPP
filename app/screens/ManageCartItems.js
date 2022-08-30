import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  AlertIOS,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import Header from "../components/Header";
import {
  removeFromCart,
  increase,
  decrease,
  conform,
} from "../actions/Actions";
import ModalTopInfor from "../components/ModalTopInfor";
import Modal from "react-native-modal";
import { CartContext } from "../context/cartContext";
import CartListItems from "../components/CartListItems";
import ListActions from "../components/ListActions";
import FormatCurrency from "../helpers/FormatCurrency";
import colors from "../config/colors";
import { Button } from "@rneui/themed";
import AdminCards from "../components/AdminCards";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import DropDown from "../components/DropDown";
import axios from "axios";

const selectPaymentMethod = () => {
  return [
    {
      name: "Cash",
    },
    {
      name: "MobileMoney",
    },
    {
      name: "Gift",
    },
  ];
};

var { width } = Dimensions.get("window");
function ManageCartItems({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const [subTotal, setSubTotal] = useState(0);
  const [quantitySold, setQuantitySold] = useState("");
  const [loading, setLoading] = useState(false);
  const [paydata, setData] = useState(selectPaymentMethod);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [grandTotal, setGandTotal] = useState(0);
  const [count, setCount] = useState("");

  const [unitPrice, setUnitPrice] = useState(null);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const getSubTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.sellingPrice * item.count;
      }, 0);

      setSubTotal(res);
    };

    const getQuantitySold = () => {
      const res = cart.reduce((prev, item) => {
        return prev + item.count;
      }, 0);

      setQuantitySold(res);
    };

    getSubTotal();
    getQuantitySold();
  }, [cart]);

  useEffect(() => {
    setGandTotal(subTotal);
  }, [subTotal]);

  const onEdit = ({ id, currentUnitPrice }) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });
    // setUnitPrice(currentUnitPrice);
  };

  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: null,
    });

    // setUnitPrice(null);
  };

  const handleSubmit = async (e) => {
    if (!paymentMethod || !paidAmount) {
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
      setLoading(true);
      const { data } = await axios.post(`/api/sales`, {
        cart,
        subTotal,
        paymentMethod,
        quantitySold,
        paidAmount,
        grandTotal,
      });
      setLoading(false);
      setPaidAmount("");
      setModalVisible(false);
      dispatch({ type: "ADD_CART", payload: [] });
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
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        HeaderTitle={<MaterialCommunityIcons name="cart-arrow-up" size={25} />}
        cartData={`${cart?.length}`}
        onPress={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.container}>
        <AdminCards
          paddingVertical={5}
          backgroundColor="warning"
          fontSize={15}
          fcolor="white"
          dataColor="white"
          title="Grand  Total"
          data={FormatCurrency(Number(grandTotal))}
        />

        {cart.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: (width * 4) / 5,
            }}
          >
            <MaterialCommunityIcons
              name="cart-arrow-up"
              size={85}
              color={colors.primary}
            />

            <Text style={{ fontSize: 20, color: colors.primary }}>
              Cart is Empty
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(card, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    backgroundColor: "white",
                    elevation: 2,
                    marginBottom: 5,
                  }}
                >
                  <CartListItems
                    chevronActive={true}
                    iconActive={false}
                    mainTitle={item.name}
                    title={item.count}
                    subSubTitleText="Available Qty:"
                    subSubTitle={item.quantity}
                    rightContent={(reset) => (
                      <ListActions
                        bcolor="danger"
                        icon="cart-remove"
                        onPress={() => {
                          dispatch(removeFromCart(cart, item._id));
                          reset();
                        }}
                      />
                    )}
                    leftContent={(reset) => (
                      <>
                        {inEditMode.status && inEditMode.rowKey === item._id ? (
                          <View style={{ backgroundColor: colors.gray }}>
                            <TextInput
                              style={styles.TextInput}
                              keyboardType="numeric"
                              placeholder="Enter QTY..."
                              value={count}
                              onChangeText={(text) => setCount(text)}
                            />
                          </View>
                        ) : null}

                        {inEditMode.status && inEditMode.rowKey === item._id ? (
                          <React.Fragment>
                            <View style={styles.leftconstiner}>
                              <Button
                                icon={
                                  <MaterialCommunityIcons
                                    name="check-circle"
                                    size={30}
                                    color={colors.white}
                                    style={{ marginTop: -6 }}
                                  />
                                }
                                onPress={() => {
                                  dispatch(
                                    conform(
                                      cart,
                                      count,
                                      item.quantity,
                                      item._id
                                    )
                                  );
                                  reset();
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
                                  reset();
                                }}
                                buttonStyle={[
                                  styles.buttonStyle,
                                  {
                                    backgroundColor: colors.danger,
                                    marginRight: -5,
                                    right: 5,
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
                                size={55}
                                color={colors.white}
                              />
                            }
                            buttonStyle={{
                              backgroundColor: colors.medium,
                              borderRadius: 7,
                              width: "100%",
                              height: "100%",
                            }}
                            titleStyle={{
                              textTransform: "uppercase",
                            }}
                          />
                        )}
                      </>
                    )}
                  />
                </View>
              )}
            />
            <View
              style={{
                marginVertical: 5,
                marginHorizontal: 35,
                alignContent: "center",
              }}
            >
              <SubmitButton
                title="Proceed Width Payment"
                onPress={toggleModal}
                // loading={loading}
              />
            </View>
          </>
        )}
      </SafeAreaView>
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
          <ModalTopInfor title="+ Payment" handlePress={toggleModal} />
          <AppTextInput
            autoCorrect={false}
            keyboardType="numeric"
            icon="cash"
            placeholder="Enter paid amount"
            value={paidAmount}
            setValue={setPaidAmount}
          />
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={paydata}
            search
            maxHeight={300}
            labelField="name"
            valueField="name"
            searchPlaceholder="Search..."
            placeholder="Select Payment Mathod"
            value={paymentMethod}
            onChange={(item) => {
              setPaymentMethod(item.name);
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
          <View style={{ marginVertical: 10 }}>
            <Text>Amount To Pay: {FormatCurrency(grandTotal)}</Text>
            <Text>
              Balance:{" "}
              {paidAmount < grandTotal
                ? `Input Paid Amount`
                : ` ${FormatCurrency(paidAmount - grandTotal)}`}{" "}
            </Text>
          </View>
          <SubmitButton
            title="Proceed"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </Modal>
    </>
  );
}

export default ManageCartItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  CardData: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.airblue,
    height: 50,
    margin: 15,
    padding: 5,
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

  dropdown: {
    height: 50,
    // borderBottomColor: colors.white,
    // borderBottomWidth: 0.5,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: colors.white,
    padding: 15,
    marginHorizontal: 5,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  labelText: { fontSize: 12 },
  buttonStyle: {
    backgroundColor: colors.online,
    borderRadius: 7,
    width: "75%",
    height: "50%",
    padding: 10,
    marginLeft: 3,
  },
  leftconstiner: {
    flexDirection: "row",
    backgroundColor: colors.gray,
    minHeight: "90%",
    width: "100%",
  },
});
