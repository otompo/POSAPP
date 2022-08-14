import React from "react";
import { StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import colors from "../config/colors";

function ListItems({
  mainTitle,
  title,
  subTitle,
  subSubTitle,
  subSubSubTitle,
  rightContent,
  leftContent,
  dateTitle,
  color,
  icon,
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
          {title && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Email:
              </ListItem.Subtitle>{" "}
              {title}
            </ListItem.Subtitle>
          )}
          {subTitle && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Contact:
              </ListItem.Subtitle>{" "}
              {subTitle}
            </ListItem.Subtitle>
          )}
          <ListItem.Subtitle>
            <ListItem.Subtitle style={styles.subTitle}>
              {dateTitle}:
            </ListItem.Subtitle>{" "}
            {subSubTitle}
          </ListItem.Subtitle>
          {!!subSubSubTitle && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Generated Password:
              </ListItem.Subtitle>{" "}
              {subSubSubTitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Chevron size={35} />
      </ListItem.Swipeable>
      <Divider width={1} />
    </>
  );
}

export default ListItems;

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
