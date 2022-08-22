import axios from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { fakeServer } from "../components/fakeserver";
import Header from "../components/Header";

const renderItem = ({ i, item }) => {
  return (
    <Text
      style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
        padding: 15,
        borderBottomColor: "red",
        borderBottomWidth: 2,
      }}
    >
      {item.name}
    </Text>
  );
};

let stopFetchMore = true;

const ListFooterComponent = () => (
  <Text
    style={{
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
      padding: 5,
    }}
  >
    Loading...
  </Text>
);
function ManagePurchase({ navigation }) {
  const [data, setData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const response = await fakeServer(20);
    setData([...response]);
  };

  const loadProducts = async () => {
    try {
      setLoadingMore(true);
      const { data } = await axios.get(
        `/api/admin/products/mobile?page=` + page
      );
      setPage(page + 1);
      setProducts([...products, ...data]);
      setLoadingMore(false);
    } catch (err) {
      console.log(err);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOnEndReached = async () => {
    setLoadingMore(true);
    if (!stopFetchMore) {
      const response = await setPage();
      if (response === "done") return setLoadingMore(false);
      // setData([...data, ...response]);
      setProducts([...products, ...data]);
      stopFetchMore = true;
    }
    setLoadingMore(false);
  };

  return (
    <>
      <Header navigation={navigation} HeaderTitle="Manage Purchase" />
      <FlatList
        data={products}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        onEndReached={handleOnEndReached}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          stopFetchMore = false;
        }}
        ListFooterComponent={() => loadingMore && <ListFooterComponent />}
      />
    </>
  );
}

export default ManagePurchase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
