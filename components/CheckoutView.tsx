import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  isLoading: boolean;
  onSubmitOrder: (customerDetails: { name: string; address: string; phone: string }) => void;
  onBack: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, isLoading, onSubmitOrder, onBack }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && address && phone && !isLoading) {
      onSubmitOrder({ name, address, phone });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">
        &larr; Back to Cart
      </button>
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="font-bold text-lg mb-2">Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} required disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required disabled={isLoading} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    <span>Processing...</span>
                </>
            ) : (
                'Place Order'
            )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutView;
