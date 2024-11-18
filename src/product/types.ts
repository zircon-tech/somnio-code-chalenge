
export type IProduct = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type IProductScore = {
  productId: string;
  score: number;
};
