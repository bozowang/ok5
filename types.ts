// �ɮ�: types.ts
// �y�z: �w�q������ε{���@�Ϊ� TypeScript �����M�����C

/**
 * �w�q���ε{���������P���ϡC
 */
export enum View {
  API_KEY_SETUP = 'api_key_setup',       // API ���_�]�w����
  RESTAURANTS = 'restaurants',         // �\�U�C�����
  MENU = 'menu',                       // ������
  CART = 'cart',                       // �ʪ�������
  CHECKOUT = 'checkout',               // ���b����
  CONFIRMATION = 'confirmation',       // �q��T�{����
}

/**
 * �\�U���󪺤����C
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
 * ��涵�ت������C
 */
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  restaurantName: string;
}

/**
 * �ʪ������ت������A�~�Ӧ� MenuItem �å[�W�ƶq�C
 */
export interface CartItem extends MenuItem {
  quantity: number;
}

/**
 * �q��ԲӸ�ƪ������]�U�ȸ�T�^�C
 */
export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  paymentMethod: string;
  orderNotes?: string;
}

/**
 * �w�T�{�q�檺�����A�]�t�Ҧ��q���T�C
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
 * ĵ�i���ܰT���������C
 */
export interface AlertInfo {
  message: string;
  type: 'success' | 'error';
}
