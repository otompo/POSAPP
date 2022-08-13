import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ProductAction({ onPress, bcolor = "danger", icon }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.constiner, { backgroundColor: colors[bcolor] }]}>
        <MaterialCommunityIcons name={icon} size={30} color={colors.white} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ProductAction;

const styles = StyleSheet.create({
  constiner: {
    backgroundColor: colors.danger,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
