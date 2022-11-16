export const ACTIONS = {
  ADD_CART: "ADD_CART",
  ADD_CART_EXIST: "ADD_CART_EXIST",
};

import { ToastAndroid, Platform, AlertIOS } from "react-native";
// import generator from "generate-password";

export const addToCart = (product, cart) => {
  // console.log("cart", cart);
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

export const addToPurchase = (product, cart) => {
  function getRandomUppercaseChar() {
    var r = Math.floor(Math.random() * 26);
    return String.fromCharCode(65 + r);
  }

  var prefix = new Array(5)
    .fill()
    .map(() => getRandomUppercaseChar())
    .join("");
  var integer = Math.floor(Math.random() * 9999 * 7);

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
    payload: [
      ...cart,
      {
        ...product,
        count: 0,
        purchaseId: prefix.toLowerCase() + integer,
      },
    ],
  };
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

export const conform = (data, count, quantity, id) => {
  const newData = [...data];

  if (count <= 0) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        "Quantity can't be 0",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      AlertIOS.alert("Quantity can't be 0");
    }
    return {
      type: "ADD_CART_EXIST",
      payload: newData,
    };
  } else if (count > quantity) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        "Quantity not available",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      AlertIOS.alert("Quantity not available");
    }
    return {
      type: "ADD_CART_EXIST",
      payload: newData,
    };
  } else {
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
    newData.forEach((item) => {
      if (item._id === id) item.count = Number(count);
    });
    return { type: "ADD_CART", payload: newData };
  }
};

export const conformPurchase = (data, count, quantity, id) => {
  const newData = [...data];

  if (count <= 0) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        "Quantity can't be 0",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else {
      AlertIOS.alert("Quantity can't be 0");
    }
    return {
      type: "ADD_CART_EXIST",
      payload: newData,
    };
  } else {
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
    newData.forEach((item) => {
      if (item._id === id) item.count = Number(count);
    });
    return { type: "ADD_CART", payload: newData };
  }
};
