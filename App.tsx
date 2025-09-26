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
 * ���ε{�����D�ե�A�t�d�޲z�Ҧ����A�M���Ϥ����������C
 */
const App: React.FC = () => {
  // ���A�޲z
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
      console.error("�q localStorage �ѪR�ʪ�������", error);
      return [];
    }
  });
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ��l�ɤ����J�A���� API Key
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<AlertInfo | null>(null);

  // �ĪG�_�l (Hooks)

  // ���ε{���Ұʮ��ˬd localStorage ���O�_�w�x�s API ���_
  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      handleApiKeySubmit(savedApiKey);
    }
  }, []);

  // �� API ���_�]�w�B���Ϭ��\�U�C��ɡA���J�\�U���
  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await generateRestaurantData();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : '�L�k���J�\�U��ơC';
        showAlert(errorMessage, 'error');
        // �p�G���_�L�ġA�M�����ê�^�]�w�e��
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

  // ���ʪ������e�ܧ�ɡA�N���x�s�� localStorage
  useEffect(() => {
    localStorage.setItem('foodDeliveryCart', JSON.stringify(cart));
  }, [cart]);

  // ���U��ƩM�ƥ�B�z��

  /**
   * ��ܴ��ܰT���C
   * @param {string} message - �n��ܪ��T���C
   * @param {'success' | 'error'} type - �T�������C
   */
  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlert({ message, type });
  };
  
  /**
   * �B�z API ���_������C
   * @param {string} key - �ϥΪ̿�J�� API ���_�C
   */
  const handleApiKeySubmit = (key: string) => {
    initializeAi(key);
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setView(View.RESTAURANTS);
  };

  /**
   * �B�z����\�U���ƥ�C
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
      showAlert('�L�k���J���A�еy��A�աC', 'error');
      setView(View.RESTAURANTS); // ��^�\�U�C��
    } finally {
      setIsMenuLoading(false);
    }
  }, []);

  /**
   * �N�ӫ~�[�J�ʪ����C
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
    showAlert(`${item.name} �w�[�J�ʪ����I`);
  };

  /**
   * ��s�ʪ������ӫ~���ƶq�C
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
   * �q�ʪ��������ӫ~�C
   */
  const handleRemoveFromCart = (itemId: string) => {
    const itemToRemove = cart.find(item => item.id === itemId);
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    if (itemToRemove) {
        showAlert(`${itemToRemove.name} �w�q�ʪ��������C`, 'error');
    }
  };

  /**
   * ����q��C
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
            throw new Error(saveResult.message || '�L�k�N�q���x�s�ܫ�ݨt�ΡC');
        }

        setConfirmedOrder(newConfirmedOrder);
        setCart([]);
        setView(View.CONFIRMATION);

    } catch (error) {
        console.error("����q�楢��:", error);
        const errorMessage = error instanceof Error ? error.message : '����q��ɵo�ͥ������~�C';
        showAlert(errorMessage, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };
  
  /**
   * �}�l�@�ӷs�q��C
   */
  const handleNewOrder = () => {
    setConfirmedOrder(null);
    setSelectedRestaurant(null);
    setMenuItems([]);
    setView(View.RESTAURANTS);
  };

  // ��V�޿�
  const renderContent = () => {
    if (view === View.API_KEY_SETUP) {
        return <ApiKeySetupView onSubmit={handleApiKeySubmit} />;
    }
      
    if (isLoading && view === View.RESTAURANTS) return <Spinner message="���b���J�\�U..." />;

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
