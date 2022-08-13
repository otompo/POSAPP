import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function UserAdminAction({ onPress, bcolor = "primary", icon = "coffee" }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.constiner, { backgroundColor: colors[bcolor] }]}>
        <MaterialCommunityIcons name={icon} size={30} color={colors.white} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UserAdminAction;

const styles = StyleSheet.create({
  constiner: {
    backgroundColor: colors.primary,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
