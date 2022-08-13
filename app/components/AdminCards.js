import React from "react";
import { Divider } from "react-native-elements";
import { View, StyleSheet, Text } from "react-native";
import colors from "../config/colors";

function AdminCards({ title, data }) {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.cardTextTitle}>{title}</Text>
      <Divider />
      <Text style={styles.cardText}>{data}</Text>
    </View>
  );
}

export default AdminCards;

const styles = StyleSheet.create({
  questionCard: {
    paddingVertical: 15,
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
