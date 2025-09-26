// �ɮ�: services/geminiService.ts
// �y�z: �ʸ˻P Gemini API ���Ҧ����ʡA�Ω�ͦ����ε{����ơC

import { GoogleGenAI, Type } from "@google/genai";
import type { OrderDetails, CartItem, Restaurant } from '../types';

let ai: GoogleGenAI;

/**
 * �ϥδ��Ѫ� API ���_��l�� Gemini AI �A�ȡC
 * @param {string} apiKey - �Τᴣ�Ѫ� Gemini API ���_�C
 */
export const initializeAi = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

/**
 * �ϥ� Gemini API �ͦ��\�U�C��C
 * @returns {Promise<Restaurant[]>} �@�ӥ]�t�\�U��ƪ��}�C�C
 * @throws {Error} �p�G AI ����l�Ʃ� API �I�s���ѡC
 */
export const generateRestaurantData = async (): Promise<Restaurant[]> => {
  if (!ai) throw new Error("AI �|����l�ơC�г]�w API ���_�C");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "�Ь��@�Ӭ����~�e App �ͦ��@�ӥ]�t8�a�h�ˤƥB�l�ޤH����c�\�U�C��C�ХH�c�餤�崣�ѸԲӸ�T�A�Ҧp�G�ߤ@�� id�B�W�١B���O�B����(����3.5��5.0����)�B���׼ơB�~�e�ɶ��w���B�̧C�q����B�A�H�Τ@�ӨӦ� picsum.photos ������Ϥ� URL�C",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "�\�U���ߤ@�ѧO�X�C" },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviews: { type: Type.INTEGER },
                  deliveryTime: { type: Type.STRING },
                  minOrder: { type: Type.INTEGER },
                  image: { type: Type.STRING, description: "�@�ӨӦ� picsum.photos �� URL�A�Ҧp�Ghttps://picsum.photos/500/300" },
                },
                required: ["id", "name", "category", "rating", "reviews", "deliveryTime", "minOrder", "image"],
              },
            },
          },
        },
      },
    });
    
    const json = JSON.parse(response.text);
    return json.restaurants;
  } catch (error) {
    console.error("�ͦ��\�U��Ʈɵo�Ϳ��~:", error);
    // �ߥX�@�ӹ�Τ��ͦn��������~�T��
    throw new Error("�L�k�ͦ��\�U��ơC���ˬd�z�� API ���_�κ����s�u�C");
  }
};

/**
 * �����w���\�U�ͦ����C
 * @param {string} restaurantName - �\�U���W�١C
 * @param {string} category - �\�U�����O�A�Ω�ƥε��C
 * @returns {Promise<any[]>} �@�ӥ]�t��涵�ت��}�C�C
 */
export const generateMenuForRestaurant = async (restaurantName: string, category: string) => {
    if (!ai) throw new Error("AI �|����l�ơC�г]�w API ���_�C");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `�Ь��W�� "${restaurantName}" ���\�U�ͦ��@���]�t6�ӫ~�����u����C���C�ӫ~���A�д��Ѱߤ@�� ID�B�W�٩M����C�C�ӫ~�������]�t�\�U�W�٥H�ѰѦҡC�Шϥ��c�餤��^���C`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        menu: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    price: { type: Type.NUMBER },
                                    restaurantName: { type: Type.STRING, description: "���~�����ݪ��\�U�W�١C" }
                                },
                                required: ["id", "name", "price", "restaurantName"],
                            },
                        },
                    },
                },
            },
        });
        const json = JSON.parse(response.text);
        return json.menu;
    } catch (error) {
        console.error(`�� ${restaurantName} �ͦ����ɵo�Ϳ��~:`, error);
        // �p�G API ���ѡA���ѳƥε����
        const fallbackMenus: { [key: string]: any[] } = {
          "�{�N�����Ʋz": [{ id: 'm1', name: "�g��~��", price: 180, restaurantName }, { id: 'm2', name: "�_�q�~��", price: 200, restaurantName }, { id: 'm3', name: "����", price: 80, restaurantName }, { id: 'm4', name: "����", price: 120, restaurantName }, { id: 'm5', name: "�v����", price: 90, restaurantName }, { id: 'm6', name: "�۵P�F��", price: 150, restaurantName }],
          "�馡�Ʋz": [{ id: 'j1', name: "��X�إq���L", price: 320, restaurantName }, { id: 'j2', name: "�D���ͳ���", price: 280, restaurantName }, { id: 'j3', name: "�Ѱ�ù�Q�s��", price: 220, restaurantName }, { id: 'j4', name: "�ӿN���׶�", price: 180, restaurantName }, { id: 'j5', name: "������", price: 60, restaurantName }, { id: 'j6', name: "�馡�λ�", price: 120, restaurantName }],
          "�q���Ʋz": [{ id: 'i1', name: "�����R�S����", price: 280, restaurantName }, { id: 'i2', name: "���ڳJ���q�j�Q��", price: 240, restaurantName }, { id: 'i3', name: "���ĨF��", price: 160, restaurantName }, { id: 'i4', name: "�[���ѥ]", price: 80, restaurantName }, { id: 'i5', name: "���Ԧ�Ĭ", price: 120, restaurantName }, { id: 'i6', name: "�q���@�Y�@��", price: 60, restaurantName }],
          "������Ʋz": [{ id: 'x1', name: "���׶�i", price: 120, restaurantName }, { id: 'x2', name: "���ױ���", price: 160, restaurantName }, { id: 'x3', name: "�T����", price: 80, restaurantName }, { id: 'x4', name: "������ɦ̤�", price: 100, restaurantName }, { id: 'x5', name: "�����", price: 60, restaurantName }, { id: 'x6', name: "������T��", price: 50, restaurantName }],
          "�����Ʋz": [{ id: 'c1', name: "�±C���G", price: 180, restaurantName }, { id: 'c2', name: "�c�O���B", price: 220, restaurantName }, { id: 'c3', name: "�Ļ���", price: 80, restaurantName }, { id: 'c4', name: "����", price: 120, restaurantName }, { id: 'c5', name: "�pŢ�]", price: 150, restaurantName }, { id: 'c6', name: "�K��", price: 90, restaurantName }],
          "���I": [{ id: 'd1', name: "�k���d�h��", price: 150, restaurantName }, { id: 'd2', name: "�������J�O�J�|", price: 180, restaurantName }, { id: 'd3', name: "�_�q�J�|", price: 120, restaurantName }, { id: 'd4', name: "���d�s", price: 60, restaurantName }, { id: 'd5', name: "���G��", price: 140, restaurantName }, { id: 'd6', name: "�B�N�O", price: 90, restaurantName }],
          "�����Ʋz": [{ id: 't1', name: "��@����", price: 250, restaurantName }, { id: 't2', name: "�������e��", price: 220, restaurantName }, { id: 't3', name: "�V���\��", price: 180, restaurantName }, { id: 't4', name: "��G����", price: 280, restaurantName }, { id: 't5', name: "��������", price: 80, restaurantName }, { id: 't6', name: "�������", price: 100, restaurantName }],
          "����": [{ id: 'v1', name: "���Ӧ׺~��", price: 250, restaurantName }, { id: 'v2', name: "�Գ��F�ԸJ", price: 220, restaurantName }, { id: 'v3', name: "��������", price: 150, restaurantName }, { id: 'v4', name: "����Ѱ�ù", price: 180, restaurantName }, { id: 'v5', name: "�n�ʿ@��", price: 100, restaurantName }, { id: 'v6', name: "�T���R�q", price: 160, restaurantName }],
        };
        const key = Object.keys(fallbackMenus).find(k => category.includes(k.substring(0,2)));
        return key ? fallbackMenus[key] : fallbackMenus["�{�N�����Ʋz"];
    }
};

/**
 * �B�z�q��A�ͦ��q��s���M�w�p�e�F�ɶ��C
 * @param {OrderDetails} orderDetails - �U�Ȫ��q��ԲӸ�ơC
 * @param {CartItem[]} cart - �ʪ��������ӫ~�C
 * @returns {Promise<{orderNumber: string, estimatedDeliveryTime: string}>} �@�ӥ]�t�q��s���M�w�p�e�F�ɶ�������C
 */
export const processOrder = async (orderDetails: OrderDetails, cart: CartItem[]) => {
    if (!ai) throw new Error("AI �|����l�ơC�г]�w API ���_�C");
    try {
        const prompt = `�@���U�ȤU�F�@�i�����~�e�q��C
        �U�ȸ��: ${JSON.stringify(orderDetails)}�C
        �q��~��: ${cart.map(item => `${item.name} x${item.quantity}`).join(', ')}�C
        �Юھڳo�Ǹ�T�A�ͦ��@�Ӱߤ@���q��s���]�榡�GORD-XXXXXX�^�M�@�ӯu�ꪺ�w�p�e�F�ɶ��]�Ҧp�G25-35 �����^�C`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        orderNumber: { type: Type.STRING },
                        estimatedDeliveryTime: { type: Type.STRING },
                    },
                    required: ["orderNumber", "estimatedDeliveryTime"],
                },
            },
        });
        const json = JSON.parse(response.text);
        return json;
    } catch (error) {
        console.error("�B�z�q��ɵo�Ϳ��~:", error);
        // �p�G API ���ѡA���ѳƥθ��
        return {
            orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
            estimatedDeliveryTime: "20-30 ����",
        };
    }
};
