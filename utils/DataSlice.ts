import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ---------- Enums ----------
export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

// ---------- Core Models ----------

export interface User {
  id: string;
  username?: string | null;
  email?: string | null;
  phoneNumber: string;
  role: Role;
  addresses: Address[];
  orders: Order[];
  cart?: Cart | null;
  createAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  productImages: ProductImages[];
  price: number;
  discountPercentage: number;
  stock: number;
  categoryId: string;
  flavorId: string;
  weightId: string;
  category: ProductCategory;
  flavor: ProductFlavor;
  weight: string;
  benifits: Benefit[];
  nutrition: Nutrition[];
  productHighlights: string[];
  orderItems: OrderItems[];
  cartItems: CartItems[];
  createdAt: Date;
}

// ---------- Product-Related ----------

export interface ProductImages {
  id: string;
  url: string;
  imageKitId: string;
}

export interface ProductCategory {
  id: string;
  category: string;
}

export interface ProductFlavor {
  id: string;
  flavor: string;
}

export interface Benefit {
  id: string;
  topic: string;
  description: string;
}

export interface Nutrition {
  id: string;
  nutrition: string;
  quantity?: string;
}

// ---------- Address / Orders ----------

export interface Address {
  id: string;
  address1: string;
  address2?: string | null;
  pincode: string;
  city: string;
  state: string;
  userId: string;
  order?: Order | null;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  addressId: string;
  address: Address;
  userId: string;
  user: User;
  total: number;
  orderItems: OrderItems[];
  razorpay_id?: string | null;
  status: OrderStatus;
  promoCode?: PromoCode;
  createdAt: Date;
}

export interface OrderItems {
  id: string;
  orderId: string;
  order: Order;
  productId: string;
  product: Product;
  quantity: number;
  orderPrice: number;
}

// ---------- Cart / Cart Items ----------

export interface Cart {
  id: string;
  userId: string;
  user: User;
  cartItems: CartItems[];
}

export interface CartItems {
  id: string;
  cartId: string;
  cart: Cart;
  productId: string;
  product: Product;
  quantity: number;
}
export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  userId: string;
  orderId: string;
  order: Order;
  user: User;
}

const initialState = {
  userInfo: {} as User,
  productCategories: [] as ProductCategory[],
  productFlavors: [] as ProductFlavor[],
  products: [] as Product[],
  cart: {} as Cart,
  address: [] as Address[],
  selectedAddressId: "" as string,
  isLoading: false as boolean,
  isLoginDialoagOpen: false as boolean,
};

const dataSlice = createSlice({
  name: "dataSlice",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },
    setProductCategory: (state, action: PayloadAction<ProductCategory[]>) => {
      state.productCategories = action.payload;
    },
    setProductFlavor: (state, action: PayloadAction<ProductFlavor[]>) => {
      state.productFlavors = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setAddress: (state, action: PayloadAction<Address[]>) => {
      state.address = action.payload;
    },
    setSelectedAddressId: (state, action: PayloadAction<string>) => {
      state.selectedAddressId = action.payload;
    },
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsLoginDialoagOpen: (state, action: PayloadAction<boolean>) => {
      state.isLoginDialoagOpen = action.payload;
    },
    removeState: () => initialState,
  },
});

export const {
  setUserInfo,
  setProductCategory,
  setProductFlavor,
  setProducts,
  setCart,
  setAddress,
  setSelectedAddressId,
  setIsLoading,
  setIsLoginDialoagOpen,
  removeState,
} = dataSlice.actions;

export default dataSlice.reducer;
