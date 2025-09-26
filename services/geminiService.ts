// 檔案: services/geminiService.ts
// 描述: 封裝與 Gemini API 的所有互動，用於生成應用程式資料。

import { GoogleGenAI, Type } from "@google/genai";
import type { OrderDetails, CartItem, Restaurant } from '../types';

let ai: GoogleGenAI;

/**
 * 使用提供的 API 金鑰初始化 Gemini AI 服務。
 * @param {string} apiKey - 用戶提供的 Gemini API 金鑰。
 */
export const initializeAi = (apiKey: string) => {
  ai = new GoogleGenAI({ apiKey });
};

/**
 * 使用 Gemini API 生成餐廳列表。
 * @returns {Promise<Restaurant[]>} 一個包含餐廳資料的陣列。
 * @throws {Error} 如果 AI 未初始化或 API 呼叫失敗。
 */
export const generateRestaurantData = async (): Promise<Restaurant[]> => {
  if (!ai) throw new Error("AI 尚未初始化。請設定 API 金鑰。");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "請為一個美食外送 App 生成一個包含8家多樣化且吸引人的虛構餐廳列表。請以繁體中文提供詳細資訊，例如：唯一的 id、名稱、類別、評分(介於3.5到5.0之間)、評論數、外送時間預估、最低訂單金額，以及一個來自 picsum.photos 的佔位圖片 URL。",
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
                  id: { type: Type.STRING, description: "餐廳的唯一識別碼。" },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                  reviews: { type: Type.INTEGER },
                  deliveryTime: { type: Type.STRING },
                  minOrder: { type: Type.INTEGER },
                  image: { type: Type.STRING, description: "一個來自 picsum.photos 的 URL，例如：https://picsum.photos/500/300" },
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
    console.error("生成餐廳資料時發生錯誤:", error);
    // 拋出一個對用戶更友好的中文錯誤訊息
    throw new Error("無法生成餐廳資料。請檢查您的 API 金鑰或網路連線。");
  }
};

/**
 * 為指定的餐廳生成菜單。
 * @param {string} restaurantName - 餐廳的名稱。
 * @param {string} category - 餐廳的類別，用於備用菜單。
 * @returns {Promise<any[]>} 一個包含菜單項目的陣列。
 */
export const generateMenuForRestaurant = async (restaurantName: string, category: string) => {
    if (!ai) throw new Error("AI 尚未初始化。請設定 API 金鑰。");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `請為名為 "${restaurantName}" 的餐廳生成一份包含6個品項的真實菜單。對於每個品項，請提供唯一的 ID、名稱和價格。每個品項都應包含餐廳名稱以供參考。請使用繁體中文回答。`,
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
                                    restaurantName: { type: Type.STRING, description: "此品項所屬的餐廳名稱。" }
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
        console.error(`為 ${restaurantName} 生成菜單時發生錯誤:`, error);
        // 如果 API 失敗，提供備用菜單資料
        const fallbackMenus: { [key: string]: any[] } = {
          "現代美式料理": [{ id: 'm1', name: "經典漢堡", price: 180, restaurantName }, { id: 'm2', name: "起司漢堡", price: 200, restaurantName }, { id: 'm3', name: "薯條", price: 80, restaurantName }, { id: 'm4', name: "奶昔", price: 120, restaurantName }, { id: 'm5', name: "洋蔥圈", price: 90, restaurantName }, { id: 'm6', name: "招牌沙拉", price: 150, restaurantName }],
          "日式料理": [{ id: 'j1', name: "綜合壽司拼盤", price: 320, restaurantName }, { id: 'j2', name: "鮭魚生魚片", price: 280, restaurantName }, { id: 'j3', name: "天婦羅烏龍麵", price: 220, restaurantName }, { id: 'j4', name: "照燒雞肉飯", price: 180, restaurantName }, { id: 'j5', name: "味噌湯", price: 60, restaurantName }, { id: 'j6', name: "日式煎餃", price: 120, restaurantName }],
          "義式料理": [{ id: 'i1', name: "瑪格麗特披薩", price: 280, restaurantName }, { id: 'i2', name: "培根蛋奶義大利麵", price: 240, restaurantName }, { id: 'i3', name: "凱薩沙拉", price: 160, restaurantName }, { id: 'i4', name: "蒜香麵包", price: 80, restaurantName }, { id: 'i5', name: "提拉米蘇", price: 120, restaurantName }, { id: 'i6', name: "義式濃縮咖啡", price: 60, restaurantName }],
          "墨西哥料理": [{ id: 'x1', name: "牛肉塔可", price: 120, restaurantName }, { id: 'x2', name: "雞肉捲餅", price: 160, restaurantName }, { id: 'x3', name: "酪梨醬", price: 80, restaurantName }, { id: 'x4', name: "墨西哥玉米片", price: 100, restaurantName }, { id: 'x5', name: "莎莎醬", price: 60, restaurantName }, { id: 'x6', name: "墨西哥汽水", price: 50, restaurantName }],
          "中式料理": [{ id: 'c1', name: "麻婆豆腐", price: 180, restaurantName }, { id: 'c2', name: "宮保雞丁", price: 220, restaurantName }, { id: 'c3', name: "酸辣湯", price: 80, restaurantName }, { id: 'c4', name: "炒飯", price: 120, restaurantName }, { id: 'c5', name: "小籠包", price: 150, restaurantName }, { id: 'c6', name: "春捲", price: 90, restaurantName }],
          "甜點": [{ id: 'd1', name: "法式千層派", price: 150, restaurantName }, { id: 'd2', name: "熔岩巧克力蛋糕", price: 180, restaurantName }, { id: 'd3', name: "起司蛋糕", price: 120, restaurantName }, { id: 'd4', name: "馬卡龍", price: 60, restaurantName }, { id: 'd5', name: "水果塔", price: 140, restaurantName }, { id: 'd6', name: "冰淇淋", price: 90, restaurantName }],
          "泰式料理": [{ id: 't1', name: "綠咖哩雞", price: 250, restaurantName }, { id: 't2', name: "泰式炒河粉", price: 220, restaurantName }, { id: 't3', name: "冬蔭功湯", price: 180, restaurantName }, { id: 't4', name: "月亮蝦餅", price: 280, restaurantName }, { id: 't5', name: "泰式奶茶", price: 80, restaurantName }, { id: 't6', name: "摩摩喳喳", price: 100, restaurantName }],
          "素食": [{ id: 'v1', name: "未來肉漢堡", price: 250, restaurantName }, { id: 'v2', name: "藜麥沙拉碗", price: 220, restaurantName }, { id: 'v3', name: "素食炒飯", price: 150, restaurantName }, { id: 'v4', name: "蔬菜天婦羅", price: 180, restaurantName }, { id: 'v5', name: "南瓜濃湯", price: 100, restaurantName }, { id: 'v6', name: "酪梨吐司", price: 160, restaurantName }],
        };
        const key = Object.keys(fallbackMenus).find(k => category.includes(k.substring(0,2)));
        return key ? fallbackMenus[key] : fallbackMenus["現代美式料理"];
    }
};

/**
 * 處理訂單，生成訂單編號和預計送達時間。
 * @param {OrderDetails} orderDetails - 顧客的訂單詳細資料。
 * @param {CartItem[]} cart - 購物車中的商品。
 * @returns {Promise<{orderNumber: string, estimatedDeliveryTime: string}>} 一個包含訂單編號和預計送達時間的物件。
 */
export const processOrder = async (orderDetails: OrderDetails, cart: CartItem[]) => {
    if (!ai) throw new Error("AI 尚未初始化。請設定 API 金鑰。");
    try {
        const prompt = `一位顧客下了一張美食外送訂單。
        顧客資料: ${JSON.stringify(orderDetails)}。
        訂單品項: ${cart.map(item => `${item.name} x${item.quantity}`).join(', ')}。
        請根據這些資訊，生成一個唯一的訂單編號（格式：ORD-XXXXXX）和一個真實的預計送達時間（例如：25-35 分鐘）。`;

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
        console.error("處理訂單時發生錯誤:", error);
        // 如果 API 失敗，提供備用資料
        return {
            orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
            estimatedDeliveryTime: "20-30 分鐘",
        };
    }
};
