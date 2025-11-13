export interface IProduct {
  description: string;
  id: string;
  imageCover: string;
  images?: string[];
  price: number;
  quantity: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug?: string;
  title: string;
  brand?: {
    image?: string;
    name?: string;
    slug?: string;
    _id?: string;
  };
  category?: {
    image?: string;
    name?: string;
    slug?: string;
    _id?: string;
  };
}
export interface ICategory {
  createdAt?: string;
  image?: string;
  name: string;
  slug?: string;
  updatedAt?: string;
  _id?: string;
}
export interface IBrand {
  createdAt?: string;
  image?: string;
  name: string;
  slug?: string;
  updatedAt?: string;
  _id?: string;
}

export interface IAxiosError {
  message?: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
}
export interface IProductCart {
      count: number;
      price: number;
      product: IProduct;
      _id: string;
    }
export interface ICart {
  cartId?: string;
  data: {
    cartOwner?: string;
    createdAt?: string;
    products: IProductCart[];
    totalCartPrice: number;
    updatedAt1?: string;
    __v?: number;
    _id?: string;
  };
  message?: string;
  numOfCartItems?: number;
  status?: string;
}
export type InputConfig = {
  name: string;
  type: string;
  placeholder: string;
  icon?: React.ReactNode;
  tooltip: string;
  dir?: "ltr" | "rtl";
};
export interface IProductResponse {
  results: number;       
  data: IProduct[];     
  page?: number;
  totalPages?: number;
}
export interface IWishlist {
  status: string;
  count: number;
  data: IProduct[];
}

export interface ShippingAddress {
    
      _id: string,
      name: string,
      details: string,
      phone:string,
      city:string
   
}

export interface OrderData {
  shippingAddress: ShippingAddress;
  paymentMethod: "cash" | "card";
}

export interface Order {
  _id: string;
  user: string;
  totalOrderPrice: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  products: Array<{
    product: string;
    count: number;
    price: number;
  }>;
}