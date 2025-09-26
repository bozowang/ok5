import React, { useState, useEffect } from 'react';
import { Restaurant, MenuItem, CartItem, Order } from './types';
import * as geminiService from './services/geminiService';
import * as sheetService from './services/sheetService';

import ApiKeySetupView from './components/ApiKeySetupView';
import Header from './components/Header';
import RestaurantList from './components/RestaurantList';
import MenuView from './components/MenuView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import ConfirmationView from './components/ConfirmationView';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

type View = 'API_KEY_SETUP' | 'RESTAURANT_LIST' | 'MENU' | 'CART' | 'CHECKOUT' | 'CONFIRMATION';

const App: React.FC = () => {
  const [view, setView] = useState<View>('RESTAURANT_LIST');
  const [apiKeyIsSet, setApiKeyIsSet] = useState(false);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      setApiKeyIsSet(true);
    } else {
      setView('API_KEY_SETUP');
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await geminiService.findRestaurants(query);
      setRestaurants(results);
    } catch (e: any) {
      setError('Failed to fetch restaurants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRestaurant = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setView('MENU');
    setIsLoading(true);
    setError(null);
    try {
      const menuItems = await geminiService.getRestaurantMenu(restaurant);
      setMenu(menuItems);
    } catch (e: any) {
      setError('Failed to fetch menu. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
  };
  
  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
      if (quantity < 1) {
          handleRemoveFromCart(itemId);
          return;
      }
      setCart(cart => cart.map(item => item.id === itemId ? {...item, quantity} : item));
  };
  
  const handleRemoveFromCart = (itemId: string) => {
      setCart(cart => cart.filter(item => item.id !== itemId));
  };

  const handleSubmitOrder = async (customerDetails: { name: string; address: string; phone: string }) => {
    setIsLoading(true);
    setError(null);
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      customer: customerDetails,
      status: 'confirmed',
    };
    
    const success = await sheetService.saveOrderToSheet(newOrder);
    if (success) {
      setOrder(newOrder);
      setView('CONFIRMATION');
      setCart([]);
    } else {
      setError('Failed to save order. Please try again.');
    }
    setIsLoading(false);
  };
  
  const resetToHome = () => {
      setSelectedRestaurant(null);
      setMenu([]);
      setError(null);
      setView('RESTAURANT_LIST');
  };

  const renderView = () => {
    switch (view) {
      case 'API_KEY_SETUP':
        return <ApiKeySetupView />;
      case 'RESTAURANT_LIST':
        return <RestaurantList restaurants={restaurants} isLoading={isLoading} error={error} onSelectRestaurant={handleSelectRestaurant} onSearch={handleSearch} />;
      case 'MENU':
        return <MenuView restaurant={selectedRestaurant} menu={menu} isLoading={isLoading} error={error} onAddToCart={handleAddToCart} onBack={() => setView('RESTAURANT_LIST')} />;
      case 'CART':
        return <CartView cart={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={() => setView('CHECKOUT')} onBack={() => setView('MENU')} />;
      case 'CHECKOUT':
        return <CheckoutView cart={cart} isLoading={isLoading} onSubmitOrder={handleSubmitOrder} onBack={() => setView('CART')} />;
      case 'CONFIRMATION':
        return <ConfirmationView order={order} onNewOrder={resetToHome} />;
      default:
        return <RestaurantList restaurants={restaurants} isLoading={isLoading} error={error} onSelectRestaurant={handleSelectRestaurant} onSearch={handleSearch} />;
    }
  };
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {apiKeyIsSet && <Header cartItemCount={cartItemCount} onCartClick={() => setView('CART')} onHomeClick={resetToHome}/>}
      <main className="flex-grow">
        {renderView()}
      </main>
      {apiKeyIsSet && <Footer />}
    </div>
  );
};

export default App;
