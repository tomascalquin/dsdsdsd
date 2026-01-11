import axios from 'axios';

export interface WebPayCreateRequest {
  amount: number;
  orderId: string;
  returnUrl: string;
  finalUrl: string;
}

export interface WebPayCreateResponse {
  token?: string;
  url?: string;
  error?: string;
}

export interface WebPayConfirmRequest {
  token: string;
}

export interface WebPayConfirmResponse {
  status?: string;
  amount?: number;
  orderId?: string;
  transactionDate?: string;
  error?: string;
}

class WebPayService {
  private commerceCode: string;
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.commerceCode = process.env.WEBPAY_COMMERCE_CODE || '597055555532';
    this.apiKey = process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    this.baseUrl = (process.env.WEBPAY_ENV === 'PROD') 
      ? 'https://webpay3g.transbank.cl' 
      : 'https://webpay3gint.transbank.cl';
  }

  /**
   * Crea una nueva transacción WebPay Plus
   */
  async createTransaction(request: WebPayCreateRequest): Promise<WebPayCreateResponse> {
    try {
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`;
      
      // TRUCO PARA EVITAR ERROR DE LONGITUD:
      // 1. Cortamos el ID a 26 caracteres para 'buy_order' (Límite de Transbank)
      const shortBuyOrder = request.orderId.replace(/-/g, '').substring(0, 26);

      const body = {
        buy_order: shortBuyOrder, 
        // 2. Guardamos el ID REAL (UUID completo) en 'session_id' para recuperarlo después
        session_id: request.orderId, 
        amount: request.amount,
        return_url: request.returnUrl,
      };

      console.log('🔵 Iniciando Transacción WebPay:', body);

      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': this.commerceCode,
          'Tbk-Api-Key-Secret': this.apiKey
        }
      });

      return {
        token: response.data.token,
        url: response.data.url + '?token_ws=' + response.data.token
      };

    } catch (error: any) {
      console.error('🔴 Error WebPay Create:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        return { error: 'Error de autorización. Verifica API Key y Código de Comercio.' };
      }

      return {
        error: error.response?.data?.error_message || 'Error al iniciar pago con WebPay'
      };
    }
  }

  /**
   * Confirma una transacción WebPay Plus
   */
  async confirmTransaction(request: WebPayConfirmRequest): Promise<WebPayConfirmResponse> {
    try {
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${request.token}`;

      console.log('🔵 Confirmando Transacción Token:', request.token);

      const response = await axios.put(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': this.commerceCode,
          'Tbk-Api-Key-Secret': this.apiKey
        }
      });

      console.log('🟢 Transacción Confirmada:', response.data);

      return {
        status: response.data.status,
        amount: response.data.amount,
        // RECUPERACIÓN INTELIGENTE:
        // Devolvemos el session_id (que es nuestro ID real de Supabase) 
        // Si no existe, usamos el buy_order por defecto.
        orderId: response.data.session_id || response.data.buy_order, 
        transactionDate: response.data.transaction_date
      };

    } catch (error: any) {
      console.error('🔴 Error WebPay Confirm:', error.response?.data || error.message);
      return {
        error: error.response?.data?.error_message || 'Error al confirmar pago'
      };
    }
  }

  validateToken(token: string): boolean {
    return Boolean(token && token.length > 10); 
  }
}

export const webPayService = new WebPayService();