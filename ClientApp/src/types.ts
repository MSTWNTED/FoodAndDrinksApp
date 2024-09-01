// types.ts або в AppNavigator.tsx
export interface Recipe {
  _id: string;
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions: string;
  imageUrl: string;
  type: 'food' | 'drink';
}
