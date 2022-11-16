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
import { removeFromCart, conformPurchase } from "../actions/Actions";
import CartListItems from "../components/CartListItems";
import ListActions from "../components/ListActions";
import colors from "../config/colors";
import { Button } from "@rneui/themed";
import SubmitButton from "../components/Button/SubmitButton";
import axios from "axios";
import { PurchaseContext } from "../context/purchaseContext";

var { width } = Dimensions.get("window");
function ManagePurcahseCartItems({ navigation }) {
  const { stateData, dispatch } = useContext(PurchaseContext);
  const { cart } = stateData;
  const [grandQuantity, setGrandQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(false);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  useEffect(() => {
    const getgrandQuantity = () => {
      const res = cart.reduce((prev, item) => {
        setCount(item.count);
        return prev + item.count;
      }, 0);

      setGrandQuantity(res);
    };
    getgrandQuantity();
  }, [cart]);

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
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/admin/products/purchase`, {
        cart,
        grandQuantity,
      });
      setLoading(false);
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
        HeaderSubTitle="Purcahse Cart Items"
        HeaderTitle={
          <MaterialCommunityIcons name="cart-arrow-down" size={25} />
        }
        cartData={`${cart?.length}`}
        backIcon={() => navigation.goBack()}
      />
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ManageAllPurchaseProducts")}
          style={{
            backgroundColor: colors.airblue,
            padding: 10,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                textTransform: "uppercase",
                fontSize: 20,
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              View All Purcahsed Products
            </Text>
          </View>
        </TouchableOpacity>

        {cart.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: (width * 4) / 5,
            }}
          >
            <MaterialCommunityIcons
              name="cart-arrow-down"
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
                    title={`${item.count}`}
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
                                    conformPurchase(
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
                title="Submit"
                onPress={handleSubmit}
                loading={loading}
                disabled={count <= 0}
              />
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
}

export default ManagePurcahseCartItems;

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
