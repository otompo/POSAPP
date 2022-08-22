import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  ToastAndroid,
  Platform,
  AlertIOS,
  FlatList,
  RefreshControl,
} from "react-native";
import DatePicker from "../components/DatePicker/DatePicker";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";
import colors from "../config/colors";
import axios from "axios";
import moment from "moment";
import AdminCards from "../components/AdminCards";
import FormatCurrency from "../helpers/FormatCurrency";
import ListItems from "../components/ListItems";
import ListActions from "../components/ListActions";
import ConvertError from "../helpers/ConvertError";
var { width } = Dimensions.get("window");

function ManageReports({ navigation }) {
  const [costStartDate, setCostStartDate] = useState(new Date());
  const [costEndDate, setCostEndDate] = useState(new Date());

  const [salesStartDate, setSalesStartDate] = useState(new Date());
  const [salesEndDate, setSalesEndDate] = useState(new Date());

  const [expensesStartDate, setExpensesStartDate] = useState(new Date());
  const [expensesEndDate, setExpensesEndDate] = useState(new Date());

  const [totalCost, setTotalCost] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [subProfit, setSubProfit] = useState(0);
  const [profit, setProfit] = useState(0);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handleSalesSubmit();
    handleExpensesSubmit();
    handleCostSubmit();
  }, []);

  useEffect(() => {
    setSubProfit(totalSales - totalCost);
    setProfit(subProfit - totalExpenses);
  }, [totalSales, totalCost, subProfit, totalExpenses]);

  useEffect(() => {
    getAllReports();
  }, [success]);

  const handleCostSubmit = async () => {
    try {
      // setLoading(true);
      const { data } = await axios.get(
        `/api/admin/cost/totalcostforseslecteddays?costStartDate=${moment(
          costStartDate
        ).format("Y/MM/DD")}&costEndDate=${moment(costEndDate).format(
          "Y/MM/DD"
        )}`
      );
      setTotalCost(data.total);
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  const handleSalesSubmit = async () => {
    try {
      // setLoading(true);
      const { data } = await axios.get(
        `/api/admin/sales/totalsalesforseslecteddays?salesStartDate=${moment(
          salesStartDate
        ).format("Y/MM/DD")}&salesEndDate=${moment(salesEndDate).format(
          "Y/MM/DD"
        )}`
      );
      setTotalSales(data.grandTotal);
      // setLoading(false);
    } catch (err) {
      console.log(err);
      // setLoading(false);
    }
  };

  const handleExpensesSubmit = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/expenses/totalexpensesforadays?expensesStartDate=${moment(
          expensesStartDate
        ).format("Y/MM/DD")}&expensesEndDate=${moment(expensesEndDate).format(
          "Y/MM/DD"
        )}`
      );

      setTotalExpenses(data.amount);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitData = async () => {
    if (
      !totalCost ||
      !totalSales ||
      !totalExpenses ||
      !profit ||
      !subProfit ||
      !costStartDate ||
      !costEndDate ||
      !salesStartDate ||
      !salesEndDate ||
      !expensesStartDate ||
      !expensesEndDate
    ) {
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          "All fields are required",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert("All fields are required");
      }
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/reports`, {
        totalCost,
        totalSales,
        totalExpenses,
        profit,
        subProfit,
        costStartDate,
        costEndDate,
        salesStartDate,
        salesEndDate,
        expensesStartDate,
        expensesEndDate,
      });

      setSuccess(false);
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
    } catch (err) {
      console.log(err);
      setSuccess(false);
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/reports`);
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    try {
      setSuccess(true);
      const { data } = axios.delete(`/api/admin/reports/delete/${reportId}`);
      setReports((reports) => {
        const index = reports.findIndex((l) => l._id === reportId);
        reports.splice(index, 1);
        return [...reports];
      });
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
      setSuccess(false);
    } catch (err) {
      console.log(err);
      setSuccess(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      getAllReports();
      handleExpensesSubmit();
      handleSalesSubmit();
      handleCostSubmit();
      setRefreshing(false);
    }, 2000);
  };
  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Reports" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <DatePicker
              padding={5}
              fontSize={8}
              date={costStartDate}
              setDate={setCostStartDate}
              titleOne="Cost Start"
            />
          </View>
          <View style={styles.subContainer}>
            <DatePicker
              padding={5}
              fontSize={8}
              date={costEndDate}
              setDate={setCostEndDate}
              titleOne="Cost End"
            />
          </View>
        </View>
        <SubHeader
          // loading={loading}
          buttonTitle="Submit for total cost"
          onPress={handleCostSubmit}
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
            paddingVertical={5}
            backgroundColor="warning"
            fontSize={15}
            fcolor="white"
            dataColor="white"
            title="Total  Cost"
            data={FormatCurrency(ConvertError(Number(totalCost)))}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <DatePicker
              padding={5}
              fontSize={8}
              date={salesStartDate}
              setDate={setSalesStartDate}
              titleOne="Sales Start"
            />
          </View>
          <View style={styles.subContainer}>
            <DatePicker
              fontSize={8}
              date={salesEndDate}
              setDate={setSalesEndDate}
              titleOne="Sales End"
            />
          </View>
        </View>
        <SubHeader
          // loading={loading}
          buttonTitle="Submit for total sales"
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
            paddingVertical={5}
            backgroundColor="warning"
            fontSize={15}
            fcolor="white"
            dataColor="white"
            title="Total  Sales"
            data={FormatCurrency(Number(totalSales))}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <DatePicker
              fontSize={7}
              padding={5}
              date={expensesStartDate}
              setDate={setExpensesStartDate}
              titleOne="Expenses Start"
            />
          </View>
          <View style={styles.subContainer}>
            <DatePicker
              padding={5}
              fontSize={7}
              date={expensesEndDate}
              setDate={setExpensesEndDate}
              titleOne="Expenses End"
            />
          </View>
        </View>
        <SubHeader
          // loading={loading}
          buttonTitle="Submit for total expenses"
          onPress={handleExpensesSubmit}
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
            paddingVertical={5}
            backgroundColor="warning"
            fcolor="white"
            dataColor="white"
            fontSize={15}
            title="Total  Expenses"
            data={FormatCurrency(Number(totalExpenses))}
          />
        </View>
        <AdminCards
          backgroundColor="secondary"
          fcolor="white"
          dataColor="white"
          fontWeight="bold"
          fontSize={15}
          title="Sub-Profit= (SALES-COST)"
          data={FormatCurrency(ConvertError(Number(subProfit)))}
        />
        <AdminCards
          backgroundColor="secondary"
          fcolor="white"
          dataColor="white"
          fontSize={15}
          title="PROFIT ((SALES-COST)-EXPENSES)"
          data={FormatCurrency(ConvertError(Number(profit)))}
        />
        <SubHeader
          loading={loading}
          buttonColor="warning"
          buttonTitle="SAVE DATA"
          onPress={handleSubmitData}
          backgroundColor="airblue"
        />
      </ScrollView>
      <FlatList
        data={reports}
        keyExtractor={(report, index) => index.toString()}
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
              chevronActive={true}
              iconActive={false}
              mainTitleText="Created At:"
              titleText="Sales Start Date:"
              subTitleText="Sales End Date:"
              subSubTitleText="Expenses Start Date:"
              subSubSubTitleText="Expenses End Date:"
              subSubSubSubTitleText="Expired Date:"
              subSubSubSubSubTitleText="Total Expenses:"
              subSubSubSubSubSubTitleText="Total Profit:"
              mainTitle={`${moment(item.createdAt).format("LL")} `}
              title={`${moment(item.salesStartDate).format("LL")}`}
              subTitle={`${moment(item.salesEndDate).format("LL")}`}
              subSubTitle={`${moment(item.expensesStartDate).format("LL")}`}
              subSubSubTitle={`${moment(item.expensesEndDate).format("LL")}`}
              subSubSubSubTitle={FormatCurrency(Number(item.totalSales))}
              subSubSubSubSubTitle={FormatCurrency(Number(item.totalExpenses))}
              subSubSubSubSubSubTitle={FormatCurrency(Number(item.profit))}
              rightContent={(reset) => (
                <ListActions
                  icon={"delete-empty"}
                  onPress={() => (handleDelete(item._id), reset())}
                />
              )}
            />
          </View>
        )}
      />
    </>
  );
}

export default ManageReports;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.airblue,
    // marginBottom: -10,
  },
  subContainer: {
    width: (width * 2) / 5,
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});
