import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function UserTrashAction({ onPress, bcolor = "danger", icon }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.constiner, { backgroundColor: colors[bcolor] }]}>
        <MaterialCommunityIcons name={icon} size={40} color={colors.white} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UserTrashAction;

const styles = StyleSheet.create({
  constiner: {
    flexDirection: "row",
    backgroundColor: colors.danger,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
