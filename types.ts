// 檔案: types.ts
// 描述: 定義整個應用程式共用的 TypeScript 類型和介面。

/**
 * 定義應用程式中的不同視圖。
 */
export enum View {
  API_KEY_SETUP = 'api_key_setup',       // API 金鑰設定視圖
  RESTAURANTS = 'restaurants',         // 餐廳列表視圖
  MENU = 'menu',                       // 菜單視圖
  CART = 'cart',                       // 購物車視圖
  CHECKOUT = 'checkout',               // 結帳視圖
  CONFIRMATION = 'confirmation',       // 訂單確認視圖
}

/**
 * 餐廳物件的介面。
 */
export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
}

/**
 * 菜單項目的介面。
 */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  restaurantName: string;
}

/**
 * 購物車項目的介面，繼承自 MenuItem 並加上數量。
 */
export interface CartItem extends MenuItem {
  quantity: number;
}

/**
 * 訂單詳細資料的介面（顧客資訊）。
 */
export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  orderNotes?: string;
}

/**
 * 已確認訂單的介面，包含所有訂單資訊。
 */
export interface ConfirmedOrder extends OrderDetails {
  orderNumber: string;
  estimatedDeliveryTime: string;
  items: { name: string; quantity: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

/**
 * 警告提示訊息的介面。
 */
export interface AlertInfo {
  message: string;
  type: 'success' | 'error';
}
