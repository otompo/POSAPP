import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import colors from "../config/colors";

function CartListItems({
  mainTitle,
  title,
  subTitle,
  subSubTitle,
  subSubSubTitle,
  rightContent,
  leftContent,
  subSubTitleText,
  subSubSubTitleText,
  color,
  icon,
  titleText,
  subTitleText,
  mainTitleText,
  chevronActive = true,
  iconActive = true,
}) {
  return (
    <>
      <ListItem.Swipeable leftContent={leftContent} rightContent={rightContent}>
        {iconActive && (
          <MaterialCommunityIcons name={icon} size={25} color={color} />
        )}

        <ListItem.Content style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            {mainTitle && (
              <ListItem.Title>
                <ListItem.Title style={styles.title}>
                  {mainTitleText}
                </ListItem.Title>{" "}
                {mainTitle}
              </ListItem.Title>
            )}
            <View style={styles.cartDataStyle}>
              {title && (
                <ListItem.Subtitle style={styles.titleStyle}>
                  {title}
                </ListItem.Subtitle>
              )}
            </View>
          </View>

          {subTitle && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                {subTitleText}
              </ListItem.Subtitle>{" "}
              {subTitle}
            </ListItem.Subtitle>
          )}
          {subSubTitle && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                {subSubTitleText}
              </ListItem.Subtitle>{" "}
              {subSubTitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        {chevronActive && <ListItem.Chevron size={35} />}
      </ListItem.Swipeable>
      <Divider width={1} />
    </>
  );
}

export default CartListItems;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
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
  cartDataStyle: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    bottom: 6,
    right: -24,
  },
  titleStyle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});
