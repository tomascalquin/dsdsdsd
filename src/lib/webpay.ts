import axios from 'axios';
import CryptoJS from 'crypto-js';

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
  private integrationType: string;
  private baseUrl: string;

  constructor() {
    // Configuración para entorno de integración (pruebas)
    this.commerceCode = process.env.WEBPAY_COMMERCE_CODE || '597055555532';
    this.apiKey = process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D68D7A6DE266377B7B4B3EF3C950EDD38ED1F5E5BB54AAEB5B40DF11EDB694907457DE74CD35';
    this.integrationType = process.env.WEBPAY_INTEGRATION_TYPE || 'TEST';
    this.baseUrl = this.integrationType === 'TEST' 
      ? 'https://webpay3gint.transbank.cl' 
      : 'https://webpay3g.transbank.cl';
  }

  /**
   * Crea una nueva transacción WebPay Plus
   */
  async createTransaction(request: WebPayCreateRequest): Promise<WebPayCreateResponse> {
    try {
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.0/transactions`;
      
      const body = {
        buy_order: request.orderId,
        session_id: `session_${Date.now()}`,
        amount: request.amount,
        return_url: request.returnUrl,
        final_url: request.finalUrl
      };

      console.log('WebPay Create Request:', body);

      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
          'TBK-API-KEY-SELF': this.apiKey,
          'TBK-API-KEY-ID': this.commerceCode
        }
      });

      console.log('WebPay Create Response:', response.data);

      return {
        token: response.data.token,
        url: response.data.url + '?token_ws=' + response.data.token
      };

    } catch (error: any) {
      console.error('Error creating WebPay transaction:', error.response?.data || error.message);
      return {
        error: error.response?.data?.error_message || 'Error al crear transacción WebPay'
      };
    }
  }

  /**
   * Confirma una transacción WebPay Plus
   */
  async confirmTransaction(request: WebPayConfirmRequest): Promise<WebPayConfirmResponse> {
    try {
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.0/transactions/${request.token}`;

      const response = await axios.put(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'TBK-API-KEY-SELF': this.apiKey,
          'TBK-API-KEY-ID': this.commerceCode
        }
      });

      console.log('WebPay Confirm Response:', response.data);

      return {
        status: response.data.status,
        amount: response.data.amount,
        orderId: response.data.buy_order,
        transactionDate: response.data.transaction_date
      };

    } catch (error: any) {
      console.error('Error confirming WebPay transaction:', error.response?.data || error.message);
      return {
        error: error.response?.data?.error_message || 'Error al confirmar transacción WebPay'
      };
    }
  }

  /**
   * Genera un ID de orden único
   */
  generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER_${timestamp}_${random}`;
  }

  /**
   * Valida el formato del token WebPay
   */
  validateToken(token: string): boolean {
    return /^[a-f0-9]{64}$/i.test(token);
  }
}

export const webPayService = new WebPayService();