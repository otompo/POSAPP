import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import { FontAwesome } from "@expo/vector-icons";

function ModalTopInfor({ title, handlePress }) {
  return (
    <View
      style={{
        // flex: 1,
        color: colors.white,
        backgroundColor: colors.white,
        borderRadius: 5,
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
          <Text style={{ color: colors.primary }}>{title}</Text>
        </Text>

        <TouchableOpacity onPress={handlePress} style={{ marginRight: 10 }}>
          <FontAwesome name="close" size={30} color={colors.medium} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ModalTopInfor;

const styles = StyleSheet.create({});
