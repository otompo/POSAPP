import React from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function ListAction({ onPress, minHeight = "100%", bcolor = "danger", icon }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.constiner,
          { minHeight: minHeight },
          { backgroundColor: colors[bcolor] },
        ]}
      >
        <MaterialCommunityIcons name={icon} size={40} color={colors.white} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ListAction;

const styles = StyleSheet.create({
  constiner: {
    flexDirection: "row",
    backgroundColor: colors.danger,
    minHeight: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});
