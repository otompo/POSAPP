<ScrollView>
  {cart.map((item) => (
    <View style={styles.CardData} key={item._id}>
      <View>
        <Text>{item.name}</Text>
      </View>
      {inEditMode.status && inEditMode.rowKey === item._id ? (
        <TextInput
          style={styles.TextInput}
          keyboardType="numeric"
          placeholder="Enter QTY..."
          value={count}
          onChangeText={(text) => setCount(text)}
        />
      ) : (
        <View style={styles.cartDataStyle}>
          <Text style={{ color: colors.white }}>{item.count}</Text>
        </View>
      )}
      {inEditMode.status && inEditMode.rowKey === item._id ? (
        <React.Fragment>
          <Button
            title="Confirm"
            // onPress={() =>
            //   onSave({ id: item._id, newUnitPrice: unitPrice })
            // }
            onPress={() => dispatch(conform(cart, count, item._id))}
            buttonStyle={{
              backgroundColor: colors.online,
              borderRadius: 7,
            }}
            titleStyle={{
              textTransform: "uppercase",
            }}
          />

          <Button
            title="Close"
            // onPress={() => dispatch(decrease(cart, item._id))}
            onPress={() => onCancel()}
            buttonStyle={{
              backgroundColor: colors.danger,
              borderRadius: 7,
            }}
            titleStyle={{
              textTransform: "uppercase",
            }}
          />
        </React.Fragment>
      ) : (
        <Button
          title="Edit"
          onPress={() => onEdit({ id: item._id, currentUnitPrice: item.count })}
          buttonStyle={{
            backgroundColor: colors.secondary,
            borderRadius: 7,
          }}
          titleStyle={{
            textTransform: "uppercase",
          }}
        />
      )}
      {/* <Button
        title="Confirm"
        // onPress={onPress}
        buttonStyle={{
          backgroundColor: colors.primary,
          borderRadius: 7,
        }}
        titleStyle={{
          textTransform: "uppercase",
        }}
      /> */}
    </View>
  ))}
</ScrollView>;

const [data, setData] = useState([]);
const [loadingMore, setLoadingMore] = useState(false);

const [page, setPage] = useState(1);

const loadProducts = async () => {
  try {
    setLoadingMore(true);
    const { data } = await axios.get(`/api/admin/products/mobile?page=` + page);
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
/>;

// container: {
//   flex: 1,
//   backgroundColor: "#fff",
//   alignItems: "center",
//   justifyContent: "center",
// },
