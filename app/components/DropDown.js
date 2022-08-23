import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import colors from "../config/colors";

function DropDown({
  data,
  placeholder,
  labelField,
  valueField,
  setValue,
  value,
}) {
  return (
    <View
      style={
        {
          // backgroundColor: colors.medium,
          //  marginTop: -10,
          // height: 70,
          // borderRadius: 15,
          // paddingBottom: 15,
        }
      }
    >
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        searchPlaceholder="Search..."
        placeholder={placeholder}
        value={value}
        //   onChange={(item) => {
        //     setSaler(item._id);
        //   }}
        onChangeText={(item) => setValue(item)}
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
  );
}

export default DropDown;

const styles = StyleSheet.create({
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
