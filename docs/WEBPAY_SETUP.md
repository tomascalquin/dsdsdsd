# Sistema de Pagos WebPay Plus

## Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

**Para ambiente de pruebas (integración):**
```env
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D68D7A6DE266377B7B4B3EF3C950EDD38ED1F5E5BB54AAEB5B40DF11EDB694907457DE74CD35
WEBPAY_INTEGRATION_TYPE=TEST
```

**Para producción:**
```env
WEBPAY_COMMERCE_CODE=123456789012
WEBPAY_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
WEBPAY_INTEGRATION_TYPE=PRODUCTION
```

### 2. Actualización de Base de Datos

Ejecuta el script `database/update_orders_webpay.sql` en tu base de datos de Supabase para agregar los campos necesarios de WebPay.

## Flujo de Pago

### 1. Inicio de Transacción
- Cliente completa datos de envío en `/checkout`
- Al hacer clic en "Pagar con WebPay", se crea una orden con estado `pendiente`
- Se genera una transacción WebPay y se redirige al portal seguro de Transbank

### 2. Proceso de Pago
- Cliente ingresa datos de tarjeta en el portal WebPay
- WebPay procesa el pago y retorna a tu sitio

### 3. Confirmación
- El sistema recibe el token de WebPay en `/webpay/return`
- Se confirma la transacción con la API de WebPay
- Se actualiza el estado de la orden:
  - `pagado` si el pago fue exitoso
  - `rechazado` si el pago fue rechazado

### 4. Redirección Final
- Si el pago es exitoso: redirige a `/gracias?webpay=success`
- Si el pago es rechazado: redirige a `/carrito?webpay=failed`

## Endpoints API

### POST `/api/webpay/create`
Crea una nueva transacción WebPay.

**Body:**
```json
{
  "amount": 10000,
  "orderId": "ORDER_1640995200000_123",
  "returnUrl": "https://tu-sitio.com/webpay/return",
  "finalUrl": "https://tu-sitio.com/webpay/final"
}
```

**Response:**
```json
{
  "token": "01ab23cd45ef67gh89ij01kl23mn45op",
  "url": "https://webpay3gint.transbank.cl/webpayserver/initTransaction?token_ws=01ab23cd45ef67gh89ij01kl23mn45op"
}
```

### POST `/api/webpay/confirm`
Confirma una transacción WebPay.

**Body:**
```json
{
  "token": "01ab23cd45ef67gh89ij01kl23mn45op"
}
```

**Response:**
```json
{
  "status": "AUTHORIZED",
  "amount": 10000,
  "orderId": "ORDER_1640995200000_123",
  "transactionDate": "2023-12-25T10:30:00.000Z"
}
```

## Seguridad

- **Encriptación SSL**: Todo el tráfico está encriptado
- **Tokens únicos**: Cada transacción tiene un token único
- **Validación de tokens**: Se valida el formato de los tokens WebPay
- **Confirmación de servidor**: Siempre se confirma el estado del pago con los servidores de WebPay

## Tarjetas Aceptadas

- Visa
- Mastercard
- American Express
- Diners Club
- Magna
- Redcompra (tarjetas de débito)

## Pruebas

Para probar el sistema en ambiente de integración:

1. Usa las credenciales de prueba proporcionadas
2. En el portal de WebPay, usa estos números de tarjeta:
   - **Tarjeta de crédito (aprobada)**: 4051885600440002
   - **Tarjeta de crédito (rechazada)**: 4152313412341234
   - **CVV**: 123
   - **Fecha de vencimiento**: Cualquier fecha futura

## Soporte

Para obtener ayuda técnica de WebPay:
- Email: soporte@transbank.cl
- Teléfono: +56 2 2397 2400
- Documentación: https://www.transbankdevelopers.cl/

## Notas Importantes

- El sistema está configurado inicialmente para ambiente de pruebas
- Para producción, solicita tus credenciales a Transbank
- Nunca expongas tus API keys en el código cliente
- Siempre valida las respuestas de WebPay en el servidor