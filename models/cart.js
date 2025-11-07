import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  addCartItem,
  removeCartItem,
  clearCartFromServer,
} from "../features/cart/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

}
