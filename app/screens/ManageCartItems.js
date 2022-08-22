import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import {
  removeFromCart,
  increase,
  decrease,
  conform,
} from "../actions/Actions";
import { CartContext } from "../context/cartContext";
import ListItems from "../components/ListItems";
import ListActions from "../components/ListActions";
import FormatCurrency from "../helpers/FormatCurrency";
import colors from "../config/colors";
import { Button } from "@rneui/themed";
import AdminCards from "../components/AdminCards";

const dataItems = () => {
  return {
    inventory: [
      {
        id: 1,
        product_name: "Weetabix",
        product_category: "Cereal",
        unit_price: "501",
      },
      {
        id: 2,
        product_name: "Colgate Toothpaste",
        product_category: "Toiletries",
        unit_price: "119",
      },
      {
        id: 3,
        product_name: "Imperial Leather Soap",
        product_category: "Toiletries",
        unit_price: "235",
      },
      {
        id: 4,
        product_name: "Sunlight Detergent",
        product_category: "Toiletries",
        unit_price: "401",
      },
    ],
  };
};

function ManageCartItems() {
  const [actionTriggered, setActionTriggered] = useState("");
  const { stateData, dispatch } = useContext(CartContext);
  const { cart } = stateData;
  const [subTotal, setSubTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [quantitySold, setQuantitySold] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [grandTotal, setGandTotal] = useState(0);
  const [count, setCount] = useState("");

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

  const [data, setData] = useState(dataItems);
  // console.log(data);

  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: null,
  });

  const [unitPrice, setUnitPrice] = useState(null);

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

  return (
    <>
      <Header
        HeaderTitle={<MaterialCommunityIcons name="cart" size={25} />}
        cartData={`${cart?.length}`}
        onPress={() => console.log("Free Data")}
      />
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
      <ScrollView>
        {cart.map((item) => (
          <View style={styles.CardData} key={item._id}>
            <View>
              <Text>{item.name}</Text>
            </View>
            {inEditMode.status && inEditMode.rowKey === item._id ? (
              <TextInput
                style={styles.TextInput}
                keyboardType="numeric"
                placeholder="Enter QTY..."
                value={count}
                onChangeText={(text) => setCount(text)}
              />
            ) : (
              <View style={styles.cartDataStyle}>
                <Text style={{ color: colors.white }}>{item.count}</Text>
              </View>
            )}
            {inEditMode.status && inEditMode.rowKey === item._id ? (
              <React.Fragment>
                <Button
                  title="Confirm"
                  // onPress={() =>
                  //   onSave({ id: item._id, newUnitPrice: unitPrice })
                  // }
                  onPress={() => dispatch(conform(cart, count, item._id))}
                  buttonStyle={{
                    backgroundColor: colors.online,
                    borderRadius: 7,
                  }}
                  titleStyle={{
                    textTransform: "uppercase",
                  }}
                />

                <Button
                  title="Close"
                  // onPress={() => dispatch(decrease(cart, item._id))}
                  onPress={() => onCancel()}
                  buttonStyle={{
                    backgroundColor: colors.danger,
                    borderRadius: 7,
                  }}
                  titleStyle={{
                    textTransform: "uppercase",
                  }}
                />
              </React.Fragment>
            ) : (
              <Button
                title="Edit"
                onPress={() =>
                  onEdit({ id: item._id, currentUnitPrice: item.count })
                }
                buttonStyle={{
                  backgroundColor: colors.secondary,
                  borderRadius: 7,
                }}
                titleStyle={{
                  textTransform: "uppercase",
                }}
              />
            )}
            {/* <Button
                title="Confirm"
                // onPress={onPress}
                buttonStyle={{
                  backgroundColor: colors.primary,
                  borderRadius: 7,
                }}
                titleStyle={{
                  textTransform: "uppercase",
                }}
              /> */}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

export default ManageCartItems;

const styles = StyleSheet.create({
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
});
