import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import colors from "../config/colors";

function PurchaseListItem({
  mainTitle,
  title,
  subTitle,
  subSubTitle,
  subSubSubTitle,
  rightContent,
  leftContent,
  subSubTitleText,
  subSubSubTitleText,
  subSubSubSubTitleText,
  subSubSubSubTitle,
  subSubSubSubSubTitle,
  subSubSubSubSubTitleText,
  subSubSubSubSubSubTitle,
  subSubSubSubSubSubTitleText,
  color,
  icon,
  titleText,
  subTitleText,
  mainTitleText,
  chevronActive = true,
  divider = false,
  iconActive = true,
}) {
  return (
    <>
      <ListItem.Swipeable leftContent={leftContent} rightContent={rightContent}>
        {iconActive && (
          <MaterialCommunityIcons name={icon} size={25} color={color} />
        )}

        <ListItem.Content>
          {mainTitle && (
            <ListItem.Title style={styles.title}>
              <ListItem.Title>{mainTitleText}</ListItem.Title> {mainTitle}
            </ListItem.Title>
          )}
          <View style={{ flexDirection: "row" }}>
            {title && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {titleText}
                </ListItem.Subtitle>{" "}
                {title}{" "}
              </ListItem.Subtitle>
            )}
            {subTitle && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {subTitleText}
                </ListItem.Subtitle>{" "}
                {subTitle}{" "}
              </ListItem.Subtitle>
            )}
            {subSubTitle && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {subSubTitleText}
                </ListItem.Subtitle>{" "}
                {subSubTitle}{" "}
              </ListItem.Subtitle>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            {!!subSubSubTitle && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {subSubSubTitleText}
                </ListItem.Subtitle>{" "}
                {subSubSubTitle}
              </ListItem.Subtitle>
            )}
            {!!subSubSubSubTitle && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {subSubSubSubTitleText}
                </ListItem.Subtitle>{" "}
                {subSubSubSubTitle}
              </ListItem.Subtitle>
            )}
            {!!subSubSubSubSubTitle && (
              <ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subTitle}>
                  {subSubSubSubSubTitleText}
                </ListItem.Subtitle>{" "}
                {subSubSubSubSubTitle}
              </ListItem.Subtitle>
            )}
          </View>
          {!!subSubSubSubSubSubTitle && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                {subSubSubSubSubSubTitleText}
              </ListItem.Subtitle>{" "}
              {subSubSubSubSubSubTitle}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        {chevronActive && <ListItem.Chevron size={35} />}
      </ListItem.Swipeable>
      {divider && <Divider width={1} />}
    </>
  );
}

export default PurchaseListItem;

const styles = StyleSheet.create({
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
});
