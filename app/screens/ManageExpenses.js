import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ToastAndroid,
  Platform,
  AlertIOS,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import SubmitButton from "../components/Button/SubmitButton";
import AppTextInput from "../components/Auth/AppTextInput";
import ModalTopInfor from "../components/ModalTopInfor";
import Modal from "react-native-modal";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";
import ListItems from "../components/ListItems";
import FormatCurrency from "../helpers/FormatCurrency";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListActions from "../components/ListActions";
import colors from "../config/colors";
import moment from "moment";
import axios from "axios";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

const { width } = Dimensions.get("window");

function ManageExpenses({ navigation }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [actionTriggered, setActionTriggered] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [current, setCurrent] = useState({});
  const [slug, setSlug] = useState("");
  const [expensesDate, setExpensesDate] = useState("");
  var previousDate = moment(expensesDate).format("MMM Do, Y");
  const [dates, setDates] = useState(Date(previousDate).toDateString);
  const [names, setNames] = useState("");
  const [amounts, setAmounts] = useState("");

  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1 !== r2;
    })
  );

  const [layoutProvider] = useState(
    new LayoutProvider(
      (index) => {
        return index;
      },
      (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = (width * 1) / 3.5;
      }
    )
  );

  useEffect(() => {
    setDataProvider((prevState) => prevState.cloneWithRows(expenses));
  }, [expenses]);

  useEffect(() => {
    if (!current) {
      return;
    } else {
      setNames(current.name);
      setAmounts(current.amount);
      setSlug(current.slug);
      setExpensesDate(current.date);
    }
  }, [current]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    setDates(date);
    setExpensesDate(date);
    hideDatePicker();
  };

  const getDate = (dd = date) => {
    let tempDate = dd.toString().split(" ");
    return dd !== ""
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : "";
  };

  useEffect(() => {
    showExpenses();
  }, [success]);

  const showExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/admin/expenses`);
      setExpenses(data);

      setLoading(false);
    } catch (err) {
      console.log(err);

      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (!name || !amount || !expenseDate) {
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
      setSuccess(true);
      const { data } = await axios.post(`/api/admin/expenses`, {
        name,
        amount,
        expenseDate: date && date,
      });

      setName("");
      setAmount("");
      // setModalVisible(false);
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
    } catch (err) {
      console.log(err);

      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          err.response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert(err.response.data.message);
      }
      setSuccess(false);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      setSuccess(true);
      const { data } = await axios.put(`/api/admin/expenses/${slug}`, {
        name: names,
        amount: amounts,
        expenseDate: dates ? dates : expensesDate,
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
      setModalVisible(false);
      setSuccess(false);
    } catch (err) {
      console.log(err);
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravityAndOffset(
          err,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      } else {
        AlertIOS.alert(err);
      }
      setSuccess(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      showExpenses();
      setRefreshing(false);
    }, 2000);
  };

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         alignItems: "center",
  //         backgroundColor: "#fff",
  //         height: "100%",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  const rowRenderer = (type, item, index) => {
    // console.log(item);
    return (
      <ListItems
        mainTitleText="Name:"
        titleText="Amount:"
        dateTitle="Date:"
        mainTitle={item.name}
        title={FormatCurrency(Number(item.amount))}
        subSubTitle={`${moment(item && item.date).format("ddd LL")} `}
        rightContent={(reset) => (
          <ListActions
            bcolor="airblue"
            icon={"pencil"}
            onPress={() => {
              // navigation.navigate("ManageEditExpenses", item);
              setCurrent(item);
              setModalVisible(true);
              setActionTriggered("ACTION_2");
              reset();
            }}
          />
        )}
      />
    );
  };

  if (!expenses?.length) return null;

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Expenses" />
      <SubHeader
        buttonTitle="+ ADD EXPENSE"
        onPress={() => {
          setModalVisible(true);
          setActionTriggered("ACTION_1");
        }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <RecyclerListView
          style={{ flex: 1 }}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
          // onEndReached={onEndReached}
          // onEndReachedThreshold={0.5}
          // renderFooter={renderFooter}
          renderAheadOffset={0}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
        />
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
          <ModalTopInfor
            title={
              actionTriggered === "ACTION_1" ? (
                <Text
                  style={{ textTransform: "uppercase", color: colors.primary }}
                >
                  + ADD EXPENSE
                </Text>
              ) : (
                <Text
                  style={{ textTransform: "uppercase", color: colors.primary }}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color={colors.dark}
                  />
                  {current.name}
                </Text>
              )
            }
            handlePress={toggleModal}
          />
          {actionTriggered == "ACTION_1" ? (
            <>
              <AppTextInput
                autoCapitalize="words"
                autoCorrect={false}
                icon="pencil-plus"
                placeholder="Enter name"
                value={name}
                setValue={setName}
              />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                setValue={setAmount}
              />
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  autoCorrect={false}
                  style={{
                    borderBottomWidth: 0.5,
                    height: 50,
                    width: "80%",
                    borderBottomColor: colors.primary,
                    borderRadius: 2,
                  }}
                  value={getDate()}
                  onChangeText={setDate}
                />
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateButton}
                >
                  <Text style={styles.text}>Date</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <SubmitButton
                title="Save"
                onPress={handleSubmit}
                loading={loading}
              />
            </>
          ) : (
            <>
              {/* <Text>{JSON.stringify(current, null, 2)}</Text> */}

              <AppTextInput
                autoCapitalize="words"
                autoCorrect={false}
                icon="pencil"
                placeholder="Enter name"
                value={names}
                setValue={setNames}
              />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                icon="cash"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={`${amounts}`}
                setValue={setAmounts}
              />
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  autoCorrect={false}
                  style={{
                    borderBottomWidth: 0.5,
                    height: 50,
                    width: "80%",
                    borderBottomColor: colors.primary,
                    borderRadius: 2,
                  }}
                  value={
                    moment(dates).format("ddd LL")
                      ? moment(expensesDate).format("ddd LL")
                      : moment(expensesDate).format("ddd LL")
                  }
                  onChangeText={(date) => setDates(date)}
                />
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateButton}
                >
                  <Text style={styles.text}>Date</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                maximumDate={new Date()}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <SubmitButton
                title="Upate"
                onPress={handleUpdateSubmit}
                loading={loading}
              />
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

export default ManageExpenses;

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: 60,
    height: 60,
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold",
  },
});
