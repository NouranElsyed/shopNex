export interface IProduct {
  description: string;
  id?: string;
  imageCover: string;
  images?: string[];
  price: number;
  quantity?: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  slug?: string;
  title: string;
}
export interface IAxiosError {

     message?:string


}

export interface IUser {
  name: string,
  email: string,
  role: string
}