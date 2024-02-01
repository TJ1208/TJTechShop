import getCartByUserId, { GetCartItems } from "@/app/api/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { getTokenClaims } from "@/app/api/jwt-token";
import { getUser } from "@/app/api/user";
import CartItem from "./cart-item";
import Link from "next/link";

const CartItems = async () => {
    const userData = await getTokenClaims();
    const user = await getUser(userData ? userData.sub : "");
    const userCart = await getCartByUserId(user.user_id?.toString() || "0");
    const cartItems = await GetCartItems(userCart.cart_id || 0);
    var initialValue: number = 0;
    return (
        cartItems.length > 0
            ?
            <div className="container">
                <p className=" px-3 text-lg italic text-slate-400 font-semibold underline underline-offset-8 my-5">Shopping Cart</p>
                {
                    cartItems.map(cart => (
                        <div className="flex w-full items-center justify-between shadow-xl" key={cart.product?.product_id}>
                            <CartItem {...cart} />
                        </div>

                    ))
                }
                <p className="text-right px-3 py-1 mt-5 italic font-medium text-slate-200 w-fit float-right border rounded-full bg-white bg-opacity-10 mx-5">Subtotal: <span className="font-semibold text-green-200">${cartItems.reduce((total, cartProduct) => total += cartProduct.product!.sale_price > 0 ? cartProduct.product!.sale_price * cartProduct.quantity : cartProduct.product!.price * cartProduct.quantity, initialValue).toFixed(2)}</span></p>
            </div>
            :
            <div className="flex flex-col items-center justify-center my-24 gap-10 p-56">

                <FontAwesomeIcon icon={faCartShopping} size="2xl" className="text-gray-300 border rounded-full p-5 border-gray-500" />
                <p className="italic text-gray-400 text-lg whitespace-nowrap">Cart is Empty</p>
                <Link href={`/products`} className="home-button border rounded-full p-3 text-lg text-blue-200 font-medium whitespace-nowrap">Shop Tech</Link>
            </div>
    )
}

export default CartItems;