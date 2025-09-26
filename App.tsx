import React, { useState, useEffect, useCallback } from 'react';
import { View } from './types';
import type { Restaurant, MenuItem, CartItem, ConfirmedOrder, OrderDetails, AlertInfo } from './types';
import { SHIPPING_FEE } from './constants';
import { initializeAi, generateRestaurantData, generateMenuForRestaurant, processOrder } from './services/geminiService';
import { saveOrder } from './services/sheetService';

import Header from './components/Header';
import Spinner from './components/Spinner';
import Alert from './components/Alert';
import ApiKeySetupView from './components/ApiKeySetupView';
import RestaurantList from './components/RestaurantList';
import MenuView from './components/MenuView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ConfirmationView from './components/ConfirmationView';
import Footer from './components/Footer';

/**
 * 應用程式的主組件，負責管理所有狀態和視圖之間的切換。
 */
const App: React.FC = () => {
  // 狀態管理
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [view, setView] = useState<View>(View.API_KEY_SETUP);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('foodDeliveryCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("從 localStorage 解析購物車失敗", error);
      return [];
    }
  });
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 初始時不載入，等待 API Key
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertInfo | null>(null);

  // 效果鉤子 (Hooks)

  // 應用程式啟動時檢查 localStorage 中是否已儲存 API 金鑰
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      handleApiKeySubmit(savedApiKey);
    }
  }, []);

  // 當 API 金鑰設定且視圖為餐廳列表時，載入餐廳資料
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await generateRestaurantData();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : '無法載入餐廳資料。';
        showAlert(errorMessage, 'error');
        // 如果金鑰無效，清除它並返回設定畫面
        localStorage.removeItem('geminiApiKey');
        setApiKey(null);
        setView(View.API_KEY_SETUP);
      } finally {
        setIsLoading(false);
      }
    };
    if (apiKey && view === View.RESTAURANTS) {
      fetchRestaurants();
    }
  }, [apiKey, view]);

  // 當購物車內容變更時，將其儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('foodDeliveryCart', JSON.stringify(cart));
  }, [cart]);

  // 輔助函數和事件處理器

  /**
   * 顯示提示訊息。
   * @param {string} message - 要顯示的訊息。
   * @param {'success' | 'error'} type - 訊息類型。
   */
  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ message, type });
  };
  
  /**
   * 處理 API 金鑰的提交。
   * @param {string} key - 使用者輸入的 API 金鑰。
   */
  const handleApiKeySubmit = (key: string) => {
    initializeAi(key);
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setView(View.RESTAURANTS);
  };

  /**
   * 處理選擇餐廳的事件。
   */
  const handleSelectRestaurant = useCallback(async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setView(View.MENU);
    setIsMenuLoading(true);
    try {
      const menuData = await generateMenuForRestaurant(restaurant.name, restaurant.category);
      setMenuItems(menuData);
    } catch (error) {
      console.error(error);
      showAlert('無法載入菜單，請稍後再試。', 'error');
      setView(View.RESTAURANTS); // 返回餐廳列表
    } finally {
      setIsMenuLoading(false);
    }
  }, []);

  /**
   * 將商品加入購物車。
   */
  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    showAlert(`${item.name} 已加入購物車！`);
  };

  /**
   * 更新購物車中商品的數量。
   */
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  /**
   * 從購物車移除商品。
   */
  const handleRemoveFromCart = (itemId: string) => {
    const itemToRemove = cart.find(item => item.id === itemId);
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    if (itemToRemove) {
        showAlert(`${itemToRemove.name} 已從購物車移除。`, 'error');
    }
  };

  /**
   * 提交訂單。
   */
  const handleSubmitOrder = async (details: OrderDetails) => {
    setIsSubmitting(true);
    try {
        const { orderNumber, estimatedDeliveryTime } = await processOrder(details, cart);

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal + SHIPPING_FEE;

        const newConfirmedOrder: ConfirmedOrder = {
          ...details,
          orderNumber,
          estimatedDeliveryTime,
          items: cart.map(({ name, quantity }) => ({ name, quantity })),
          subtotal,
          shippingFee: SHIPPING_FEE,
          total,
        };
        
        const saveResult = await saveOrder(newConfirmedOrder);

        if (!saveResult.success) {
            throw new Error(saveResult.message || '無法將訂單儲存至後端系統。');
        }

        setConfirmedOrder(newConfirmedOrder);
        setCart([]);
        setView(View.CONFIRMATION);

    } catch (error) {
        console.error("提交訂單失敗:", error);
        const errorMessage = error instanceof Error ? error.message : '提交訂單時發生未知錯誤。';
        showAlert(errorMessage, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  /**
   * 開始一個新訂單。
   */
  const handleNewOrder = () => {
    setConfirmedOrder(null);
    setSelectedRestaurant(null);
    setMenuItems([]);
    setView(View.RESTAURANTS);
  };

  // 渲染邏輯
  const renderContent = () => {
    if (view === View.API_KEY_SETUP) {
        return <ApiKeySetupView onSubmit={handleApiKeySubmit} />;
    }
      
    if (isLoading && view === View.RESTAURANTS) return <Spinner message="正在載入餐廳..." />;

    switch (view) {
      case View.MENU:
        return selectedRestaurant && <MenuView 
            restaurant={selectedRestaurant} 
            menuItems={menuItems} 
            onAddToCart={handleAddToCart}
            onBack={() => setView(View.RESTAURANTS)}
            isLoading={isMenuLoading}
        />;
      case View.CART:
        return <CartView 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={() => setView(View.CHECKOUT)}
            onBack={() => selectedRestaurant ? setView(View.MENU) : setView(View.RESTAURANTS)}
        />;
      case View.CHECKOUT:
        return <CheckoutView onSubmit={handleSubmitOrder} onBack={() => setView(View.CART)} isLoading={isSubmitting} />;
      case View.CONFIRMATION:
        return confirmedOrder && <ConfirmationView order={confirmedOrder} onNewOrder={handleNewOrder} />;
      case View.RESTAURANTS:
      default:
        return <RestaurantList restaurants={restaurants} onSelectRestaurant={handleSelectRestaurant} />;
    }
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const showHeader = view !== View.API_KEY_SETUP;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      {showHeader && <Header cartItemCount={cartItemCount} onCartClick={() => setView(View.CART)} onLogoClick={() => setView(View.RESTAURANTS)} />}
      <main className="container mx-auto px-4 flex-grow">
        {renderContent()}
      </main>
      {showHeader && <Footer />}
    </div>
  );
};

export default App;
