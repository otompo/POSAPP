import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
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
import ListItems from "../components/ListItems";
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
  const [products, setProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paydata, setData] = useState(selectPaymentMethod);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [saler, setSaler] = useState("");
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
    setUnitPrice(currentUnitPrice);
  };

  const onSave = ({ id, newUnitPrice }) => {
    console.log(id);
    console.log(newUnitPrice);
    // updateInventory({ id, newUnitPrice });
  };

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null,
    });
    // reset the unit price state value
    setUnitPrice(null);
  };

  const handleSubmit = async () => {
    // console.log(paymentMethod);
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header
        HeaderTitle={<MaterialCommunityIcons name="cart" size={25} />}
        cartData={`${cart?.length}`}
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
        {/* <FlatList
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
            <ListItems
              chevronActive={true}
              iconActive={false}
              // mainTitleText="Name:"
              mainTitle={item.name}
              // subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
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
            />
          </View>
        )}
      /> */}

        {cart.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: (width * 4) / 5,
            }}
          >
            <MaterialCommunityIcons
              name="cart-variant"
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
                  <ListItems
                    chevronActive={true}
                    iconActive={false}
                    // mainTitleText="Name:"
                    mainTitle={item.name}
                    // subSubSubTitle={FormatCurrency(Number(item.sellingPrice))}
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
            // loading={loading}
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
    padding: 5,
    width: "40%",
    backgroundColor: colors.white,
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
});
