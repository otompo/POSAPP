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
import ListItems from "../components/ListItems";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import FormatCurrency from "../helpers/FormatCurrency";
import axios from "axios";
import moment from "moment";

var { width } = Dimensions.get("window");
function ManageDailySales({ navigation }) {
  const [startdate, setSartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  // const [quantitySold, setQuantitySold] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  useEffect(() => {
    handleSalesSubmit();
  }, []);

  const handleSalesSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/admin/sales/salesforaparticulardate?startdate=${moment(
          startdate
        ).format("Y/MM/DD")}&enddate=${moment(enddate).format("Y/MM/DD")}`
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

      setRefreshing(false);
    }, 2000);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Daily Sales" />
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

export default ManageDailySales;

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
