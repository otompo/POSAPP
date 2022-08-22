import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import colors from "../../config/colors";

function DatePicker({ date, setDate, titleOne, fontSize = 10, padding }) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleDateConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <TextInput
          autoCorrect={false}
          style={{
            borderBottomWidth: 0.5,
            height: 50,
            width: "80%",
            marginLeft: -15,
            borderBottomColor: colors.white,
            borderRadius: 2,
            color: colors.white,
          }}
          value={moment(date).format("LL")}
          onChangeText={(date) => setDate(date)}
        />
        <TouchableOpacity
          onPress={showDatePicker}
          style={[styles.dateButton, { padding: padding }]}
        >
          <Text style={[styles.text, { fontSize: fontSize }]}>{titleOne}</Text>
          <Text style={styles.text}>Date</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
}

export default DatePicker;

const styles = StyleSheet.create({
  dateButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    marginVertical: 10,
    marginHorizontal: -10,
    marginLeft: -5,
    borderWidth: 1,
    borderColor: colors.white,
  },
  text: {
    color: colors.white,
    textTransform: "uppercase",
    fontSize: 10,
    fontWeight: "bold",
  },
});
