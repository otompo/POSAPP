import React from "react";
import { StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-elements";
import { ListItem } from "@rneui/themed";
import colors from "../config/colors";

function UserListItems({
  userId,
  userName,
  userEmail,
  userContact,
  userCreatedAt,
  userGeneratedPass,
  rightContent,
  leftContent,
  color,
  icon,
  keys,
}) {
  return (
    <>
      <ListItem.Swipeable
        leftContent={leftContent}
        rightContent={rightContent}
        key={keys}
      >
        <MaterialCommunityIcons name={icon} size={25} color={color} />
        <ListItem.Content>
          {userName && (
            <ListItem.Title>
              <ListItem.Title style={styles.title}>Name:</ListItem.Title>{" "}
              {userName}
            </ListItem.Title>
          )}
          {userEmail && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Email:
              </ListItem.Subtitle>{" "}
              {userEmail}
            </ListItem.Subtitle>
          )}
          {userContact && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Contact:
              </ListItem.Subtitle>{" "}
              {userContact}
            </ListItem.Subtitle>
          )}
          <ListItem.Subtitle>
            <ListItem.Subtitle style={styles.subTitle}>
              JoinDate:
            </ListItem.Subtitle>{" "}
            {userCreatedAt}
          </ListItem.Subtitle>
          {!!userGeneratedPass && (
            <ListItem.Subtitle>
              <ListItem.Subtitle style={styles.subTitle}>
                Generated Password:
              </ListItem.Subtitle>{" "}
              {userGeneratedPass}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Chevron size={35} />
      </ListItem.Swipeable>
      <Divider width={1} />
    </>
  );
}

export default UserListItems;

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
