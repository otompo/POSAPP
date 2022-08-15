import React from "react";
import { StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import colors from "../config/colors";

function ProductsListItems({
  mainTitle,
  category,
  quantity,
  costPrice,
  sellingPrice,
  expiredDate,
  createdAt,
  color,
  icon,
  rightContent,
  leftContent,
}) {
  return (
    <>
      <ListItem.Swipeable leftContent={leftContent} rightContent={rightContent}>
        <MaterialCommunityIcons name={icon} size={25} color={color} />
        <ListItem.Content>
          {mainTitle && (
            <ListItem.Title>
              <ListItem.Title style={styles.title}>Name:</ListItem.Title>{" "}
              {mainTitle}
            </ListItem.Title>
          )}
          {category && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Category:
              </ListItem.Subtitle>{" "}
              {category}
            </ListItem.Subtitle>
          )}
          {quantity && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Quantity:
              </ListItem.Subtitle>{" "}
              {quantity}
            </ListItem.Subtitle>
          )}

          {costPrice && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Cost Price:
              </ListItem.Subtitle>{" "}
              {costPrice}
            </ListItem.Subtitle>
          )}

          {!!sellingPrice && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Selling Price:
              </ListItem.Subtitle>{" "}
              {sellingPrice}
            </ListItem.Subtitle>
          )}
          {expiredDate && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Expired Date:
              </ListItem.Subtitle>{" "}
              {expiredDate}
            </ListItem.Subtitle>
          )}
          {createdAt && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Created At:
              </ListItem.Subtitle>{" "}
              {createdAt}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Chevron size={35} />
      </ListItem.Swipeable>
      <Divider width={1} />
    </>
  );
}

export default ProductsListItems;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    // marginBottom: 5,
    marginTop: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.primary,
  },
  subTitle: {
    color: colors.dark,
    fontSize: 12,
    fontWeight: "bold",
  },
  subSubTitle: {
    color: colors.dark,
    fontSize: 12,
  },
  detailsContainer: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 1,
  },
});
