export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  ProductDetail: { productId: number };
  Checkout: undefined;
  OrderDetail: { orderId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Orders: undefined;
  Chat: undefined;
  Account: undefined;
};

export type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  token: string;
  roles?: string[];
  primaryRole?: string;
  phoneNumber?: string;
  address?: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: { id?: number; name?: string } | string;
  averageRating?: number;
  reviewCount?: number;
  discountPercentage?: number;
  updatedAt?: string;
};

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stock?: number;
  imageUrl?: string;
};

export type OrderItemInput = {
  productId: number;
  quantity: number;
};

export type OrderPayload = {
  items: OrderItemInput[];
  shippingAddress: string;
  paymentMethod: string;
  phoneNumber: string;
  recipientName: string;
  total: number;
};

export type Order = {
  id: number;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalAmount?: number;
  total?: number;
  createdAt?: string;
  orderDate?: string;
  shippingAddress?: string;
  recipientName?: string;
  phoneNumber?: string;
  items?: Array<{
    id?: number;
    quantity: number;
    price?: number;
    product?: Product;
    productId?: number;
    productName?: string;
  }>;
};

export type Review = {
  id: number;
  rating: number;
  comment?: string;
  userName?: string;
  fullName?: string;
  createdAt?: string;
};
