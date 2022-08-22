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
