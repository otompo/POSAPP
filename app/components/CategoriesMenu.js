import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "../config/colors";

function CategoriesMenu({ title, icon, onPress }) {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            marginTop: 10,
            marginBottom: 15,
            borderRadius: 15,
            marginHorizontal: 5,
            backgroundColor: colors.primary,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 2,
          }}
        >
          <Text
            style={{
              color: colors.white,
              paddingLeft: 5,
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 5,
              paddingVertical: 6,
            }}
          >
            {title}
          </Text>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            style={{
              color: colors.light,
              marginHorizontal: 5,
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default CategoriesMenu;

const styles = StyleSheet.create({
  flatList: {
    height: 60,
    backgroundColor: colors.toolbar,
  },
  menuText: {
    color: colors.primary,
    paddingBottom: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
});
