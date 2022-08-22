export const ACTIONS = {
  ADD_CART: "ADD_CART",
  ADD_CART_EXIST: "ADD_CART_EXIST",
};

import { ToastAndroid, Platform, AlertIOS } from "react-native";

export const addToCart = (product, cart) => {
  // console.log("Product", product);
  // console.log("Cart", cart);

  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  if (!check) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        `${product.name} Already in Cart `,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      AlertIOS.alert(`${product.name} Already in Cart `);
    }
    return {
      type: "ADD_CART_EXIST",
      payload: [...cart, { ...product, count: 1 }],
    };
  }

  if (Platform.OS === "android") {
    ToastAndroid.showWithGravityAndOffset(
      "Success",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  } else {
    AlertIOS.alert("Success");
  }
  return {
    type: "ADD_CART",
    payload: [...cart, { ...product, count: 1 }],
  };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.count += 1;
  });
  return { type: "ADD_CART", payload: newData };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.count -= 1;
  });

  return { type: "ADD_CART", payload: newData };
};

export const removeFromCart = (data, id) => {
  const newData = [...data];

  newData.forEach((item, index) => {
    if (item._id === id) {
      newData.splice(index, 1);
    }
  });
  if (Platform.OS === "android") {
    ToastAndroid.showWithGravityAndOffset(
      "Success",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  } else {
    AlertIOS.alert("Success");
  }

  return { type: "ADD_CART", payload: newData };
};

export const conform = (data, count, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.count = Number(count);
  });
  return { type: "ADD_CART", payload: newData };
};
