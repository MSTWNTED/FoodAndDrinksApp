// types.ts або в AppNavigator.tsx
export interface Recipe {
  _id: string;
  name: string;
  cuisine: string;
  ingredients?: string[];  // Необов'язкове поле
  instructions?: string;   // Необов'язкове поле
  description: string;     // Опис тепер обов'язковий
  imageUrl: string;
  type: 'food' | 'drink';
  continent: string;       // Поле континенту залишається обов'язковим
}
