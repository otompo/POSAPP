import React from "react";
import { Divider } from "react-native-elements";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function AdminCards({
  title,
  data,
  fontSize = 20,
  backgroundColor = "white",
  fcolor = "dark",
  dataColor = "primary",
  fontWeight,
  paddingVertical = 15,
}) {
  return (
    <View
      style={[
        styles.questionCard,
        { backgroundColor: colors[backgroundColor] },
      ]}
    >
      <Text
        style={[
          styles.cardTextTitle,
          {
            color: colors[fcolor],
            fontSize: fontSize,
            fontWeight: fontWeight,
            paddingVertical: paddingVertical,
          },
        ]}
      >
        {title}
      </Text>
      <Divider />
      <Text style={[styles.cardText, { color: colors[dataColor] }]}>
        {data}
      </Text>
    </View>
  );
}

export default AdminCards;

const styles = StyleSheet.create({
  questionCard: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTextTitle: {
    fontSize: 30,
    fontWeight: "400",
    marginHorizontal: 20,
    textTransform: "uppercase",
  },
  cardText: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: 20,
    color: colors.primary,
  },
});
