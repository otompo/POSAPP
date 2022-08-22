import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import AdminCards from "../components/AdminCards";
import DatePicker from "../components/DatePicker/DatePicker";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import FormatCurrency from "../helpers/FormatCurrency";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import ListItems from "../components/ListItems";

var { width } = Dimensions.get("window");
function ManageUserDailySales({ navigation }) {
  const [startdate, setSartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [loadedUsers, setLoadedUsers] = useState([]);
  const [saler, setSaler] = useState("");
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [quantitySold, setQuantitySold] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    handleSalesSubmit();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/users`);
      setLoadedUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err.response.data);
      setLoading(false);
    }
  };
  const handleSalesSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/sales/admingetuserdailysalesbydate?startdate=${moment(
          startdate
        ).format("Y/MM/DD")}&enddate=${moment(enddate).format(
          "Y/MM/DD"
        )}&saler=${saler}`
      );
      setSales(data.docs);
      // setQuantitySold(data.result.quantitySold);
      setTotalAmount(data.result.grandTotal);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      handleSalesSubmit();
      loadUsers();
      setRefreshing(false);
    }, 2000);
  };
  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage User Daily Sales" />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <DatePicker date={startdate} setDate={setSartDate} titleOne="Start" />
        </View>
        <View style={styles.subContainer}>
          <DatePicker date={enddate} setDate={setEndDate} titleOne="End" />
        </View>
      </View>
      <View
        style={{
          backgroundColor: colors.airblue,
          marginTop: -10,
        }}
      >
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={loadedUsers}
          search
          maxHeight={300}
          labelField="name"
          valueField="_id"
          searchPlaceholder="Search..."
          placeholder="Select User..."
          value={saler}
          onChange={(item) => {
            setSaler(item._id);
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
      </View>
      <SubHeader
        loading={loading}
        buttonTitle="Submit"
        onPress={handleSalesSubmit}
        backgroundColor="airblue"
      />
      <View
        style={{
          backgroundColor: colors.airblue,
          marginBottom: 10,
          marginTop: -10,
        }}
      >
        <AdminCards
          fontSize={15}
          title="Total  Sales for Selected Days"
          data={FormatCurrency(Number(totalAmount))}
        />
      </View>
      <FlatList
        data={sales}
        keyExtractor={(sale, index) => index.toString()}
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
            <ListItems
              chevronActive={false}
              iconActive={false}
              mainTitle={
                item &&
                item.products &&
                item.products.map((product, i) => (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      {/* <Text>{i + 1}</Text> */}
                      <Text style={{ color: colors.infor }}>
                        {product && product.name}
                        {", "}
                      </Text>
                    </View>
                    <View>
                      <Text>
                        <Text
                          style={{ color: colors.primary, fontWeight: "bold" }}
                        >
                          Price:
                        </Text>{" "}
                        {FormatCurrency(product.sellingPrice * product.count)}{" "}
                      </Text>
                    </View>
                    <View>
                      <Text>
                        {" "}
                        <Text
                          style={{ color: colors.primary, fontWeight: "bold" }}
                        >
                          Quantity:
                        </Text>{" "}
                        {product.count}{" "}
                      </Text>
                    </View>
                  </>
                ))
              }
              titleText="Grand Amount:"
              subSubTitleText="CreatedAt:"
              title={FormatCurrency(Number(item.grandTotal))}
              subTitle={item.paymentMethod}
              subTitleText="Payment Method:"
              subSubTitle={`${moment(item && item.createdAt).format(
                "ddd LL"
              )} `}
              // rightContent={(reset) => (
              //   <ListActions
              //     icon={"delete-empty"}
              //     onPress={() => (handleDelete(index), reset())}
              //   />
              // )}
            />
          </View>
        )}
      />
    </>
  );
}

export default ManageUserDailySales;

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
  dropdown: {
    margin: 16,
    height: 50,
    // borderBottomColor: colors.white,
    // borderBottomWidth: 0.5,
    borderColor: colors.white,
    borderWidth: 0.5,
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
    color: colors.white,
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
