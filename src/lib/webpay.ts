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
    // 1. Priorizamos las variables de entorno, si no, usamos las OFICIALES DE PRUEBA
    // Nota: Transbank tiene credenciales de integración fijas que son públicas.
    this.commerceCode = process.env.WEBPAY_COMMERCE_CODE || '597055555532';
    
    // Esta es la API Key oficial de integración (revisada)
    this.apiKey = process.env.WEBPAY_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C';
    
    // URL Base (Test vs Producción)
    this.baseUrl = (process.env.WEBPAY_ENV === 'PROD') 
      ? 'https://webpay3g.transbank.cl' 
      : 'https://webpay3gint.transbank.cl';
  }

  /**
   * Crea una nueva transacción WebPay Plus
   */
  async createTransaction(request: WebPayCreateRequest): Promise<WebPayCreateResponse> {
    try {
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`; // Actualizado a v1.2
      
      const body = {
        buy_order: request.orderId,
        session_id: `session_${Date.now()}`,
        amount: request.amount,
        return_url: request.returnUrl,
      };

      console.log('🔵 Iniciando Transacción WebPay:', body);

      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': this.commerceCode,    // <--- NOMBRE CORREGIDO
          'Tbk-Api-Key-Secret': this.apiKey       // <--- NOMBRE CORREGIDO
        }
      });

      console.log('🟢 Respuesta WebPay:', response.data);

      return {
        token: response.data.token,
        url: response.data.url + '?token_ws=' + response.data.token
      };

    } catch (error: any) {
      console.error('🔴 Error WebPay Create:', error.response?.data || error.message);
      
      // Si el error es 401, damos un mensaje más claro
      if (error.response?.status === 401) {
        return { error: 'Error de autorización con Transbank. Verifica las credenciales (API Key).' };
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
      // Actualizado a v1.2
      const endpoint = `${this.baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${request.token}`;

      console.log('🔵 Confirmando Transacción:', request.token);

      const response = await axios.put(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Tbk-Api-Key-Id': this.commerceCode,    // <--- NOMBRE CORREGIDO
          'Tbk-Api-Key-Secret': this.apiKey       // <--- NOMBRE CORREGIDO
        }
      });

      console.log('🟢 Transacción Confirmada:', response.data);

      return {
        status: response.data.status,
        amount: response.data.amount,
        orderId: response.data.buy_order,
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
    // Usamos Boolean() para asegurar que SIEMPRE devuelva true o false
    return Boolean(token && token.length > 10); 
  }
}

export const webPayService = new WebPayService();