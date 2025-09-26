// 檔案: services/sheetService.ts
// 描述: 封裝將訂單資料儲存到 Google Sheets 的邏輯。

import { SCRIPT_URL } from '../constants';
import type { ConfirmedOrder } from '../types';

/**
 * 將已確認的訂單資料儲存到 Google Sheet。
 * @param {ConfirmedOrder} orderData - 要儲存的訂單資料。
 * @returns {Promise<{ success: boolean; message: string }>} 一個表示操作是否成功以及相關訊息的物件。
 */
export const saveOrder = async (orderData: ConfirmedOrder): Promise<{ success: boolean; message: string }> => {
    try {
        const sheetData = {
            orderNumber: orderData.orderNumber,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            deliveryAddress: orderData.deliveryAddress,
            paymentMethod: orderData.paymentMethod,
            orderNotes: orderData.orderNotes || '',
            items: orderData.items.map(item => `${item.name} x${item.quantity}`).join(', '),
            subtotal: orderData.subtotal,
            shippingFee: orderData.shippingFee,
            total: orderData.total,
            orderTime: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
        };
        
        const response = await fetch(`${SCRIPT_URL}?action=saveOrder`, {
            method: 'POST',
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({ orderData: sheetData }),
        });

        if (!response.ok) {
          throw new Error(`Google Sheets API 回應錯誤，狀態碼: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || '無法將訂單儲存至 Google Sheets');
        }

        return { success: true, message: result.message };

    } catch (error) {
        console.error('儲存訂單至 Google Sheet 時發生錯誤:', error);
        // 返回一個通用的中文錯誤訊息
        return { success: false, message: '儲存訂單至 Google Sheet 時發生未知錯誤。請稍後再試。' };
    }
};
