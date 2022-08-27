import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import colors from "../config/colors";
import moment from "moment";
import axios from "axios";
import SubHeader from "../components/SubHeader";
import DatePicker from "../components/DatePicker/DatePicker";
import FormatCurrency from "../helpers/FormatCurrency";
import ListItems from "../components/ListItems";
import PurchaseListItem from "../components/PurchaseListItem";
var { width } = Dimensions.get("window");

function MySales({ navigation }) {
  const [sales, setSales] = useState([]);
  const [startdate, setSartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handleSalesSubmit();
  }, []);

  const handleSalesSubmit = async () => {
    // console.log("startdate", startdate);
    // console.log("enddate", enddate);
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/sales/userdailysalesbydate?startdate=${moment(
          startdate
        ).format("Y/MM/DD")}&enddate=${moment(enddate).format("Y/MM/DD")}`
      );
      // console.log(data);
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

      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="My Sales" />
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
        onPress={handleSalesSubmit}
        backgroundColor="airblue"
      />
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
            {item.products.map((product, i) => (
              <>
                <PurchaseListItem
                  iconActive={false}
                  chevronActive={false}
                  mainTitle={product.name}
                  titleText="Price:"
                  subTitleText="Quantity:"
                  title={FormatCurrency(product.sellingPrice * product.count)}
                  subTitle={product.count}
                />
              </>
            ))}
            <PurchaseListItem
              iconActive={false}
              chevronActive={false}
              // mainTitle={product.name}
              // titleText="Created Date: "
              subTitleText="Grand Total: "
              subSubSubTitleText="Created At: "
              subSubTitleText="Payment Method:"
              subSubTitle={item.paymentMethod}
              subTitle={FormatCurrency(Number(item.grandTotal))}
              subSubSubTitle={`${moment(item && item.createdAt).format(
                "ddd LL"
              )} `}
            />
          </View>
        )}
      />
    </>
  );
}

export default MySales;

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
});
