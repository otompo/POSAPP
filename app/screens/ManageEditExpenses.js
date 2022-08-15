import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  Platform,
  AlertIOS,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppTextInput from "../components/Auth/AppTextInput";
import SubmitButton from "../components/Button/SubmitButton";
import { Divider } from "react-native-elements";
import colors from "../config/colors";
import moment from "moment";
import { useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

function ManageEditExpenses({ route, navigation }) {
  const responseData = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  var previousDate = moment(expenseDate).format("MMM Do, Y");
  const [date, setDate] = useState(Date(previousDate).toDateString);
  const [expenseDate, setExpenseDate] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    if (!responseData) {
      return;
    } else {
      setName(responseData.name);
      setAmount(responseData.amount);
      setSlug(responseData.slug);
      setExpenseDate(responseData.date);
    }
  }, []);

  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/admin/expenses/${slug}`, {
        name,
        amount,
        expenseDate: date ? date : expenseDate,
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
      setLoading(false);
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
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    setExpenseDate(date);
    hideDatePicker();
  };

  return (
    <>
      <Header HeaderTitle={responseData.name} justifyContent="center" />
      <View style={styles.MainContainer}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="pencil" size={40} color={colors.dark} />
          <Text style={styles.title}>{responseData.name}</Text>
        </View>
        <Divider />

        <AppTextInput
          autoCapitalize="words"
          autoCorrect={false}
          icon="pencil"
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
          value={`${amount}`}
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
            dateFormat="MMMM d, yyyy"
            value={
              moment(date).format("ddd LL")
                ? moment(expenseDate).format("ddd LL")
                : moment(expenseDate).format("ddd LL")
            }
            onChangeText={(date) => setDate(date)}
          />
          <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
            <Text style={styles.text}>Date</Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <SubmitButton
          title="Update"
          onPress={handleUpdateSubmit}
          loading={loading}
        />
      </View>
    </>
  );
}

export default ManageEditExpenses;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15,
    justifyContent: "center",
    alignItems: "center",
  },
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
  title: {
    textTransform: "uppercase",
    fontSize: 35,
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
  },
});
