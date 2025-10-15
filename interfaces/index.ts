export interface IProduct {
  description: string;
  id: string;
  imageCover: string;
  images?: string[];
  price: number;
  quantity?: number;
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
export interface IAxiosError {
  message?: string;
}

export interface IUser {
  name: string;
  email: string;
  role: string;
}

export interface ICart {
  cartId?: string;
  data?: {
    cartOwner?: string;
    createdAt?: string;
    products?: {
      count: number;
      price: number;
      product: IProduct;
      _id: string;
    }[];
    totalCartPrice?: number;
    updatedAt1?: string;
    __v?: number;
    _id?: string;
  };
  message?: string;
  numOfCartItems?: number;
  status?: string;
}
