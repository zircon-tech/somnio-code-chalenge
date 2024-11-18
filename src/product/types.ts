
export type Product = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};

export type ProductScore = {
  productId: string;
  score: number;
};
