// �ɮ�: services/sheetService.ts
// �y�z: �ʸ˱N�q�����x�s�� Google Sheets ���޿�C

import { SCRIPT_URL } from '../constants';
import type { ConfirmedOrder } from '../types';

/**
 * �N�w�T�{���q�����x�s�� Google Sheet�C
 * @param {ConfirmedOrder} orderData - �n�x�s���q���ơC
 * @returns {Promise<{ success: boolean; message: string }>} �@�Ӫ�ܾާ@�O�_���\�H�ά����T��������C
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
          throw new Error(`Google Sheets API �^�����~�A���A�X: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || '�L�k�N�q���x�s�� Google Sheets');
        }

        return { success: true, message: result.message };

    } catch (error) {
        console.error('�x�s�q��� Google Sheet �ɵo�Ϳ��~:', error);
        // ��^�@�ӳq�Ϊ�������~�T��
        return { success: false, message: '�x�s�q��� Google Sheet �ɵo�ͥ������~�C�еy��A�աC' };
    }
};
