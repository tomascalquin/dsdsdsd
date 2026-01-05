-- Script para actualizar la tabla orders con campos de WebPay Plus
-- Ejecutar este script en tu base de datos de Supabase

-- Agregar nuevos campos a la tabla orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_id TEXT,
ADD COLUMN IF NOT EXISTS webpay_token TEXT,
ADD COLUMN IF NOT EXISTS webpay_status TEXT,
ADD COLUMN IF NOT EXISTS webpay_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS webpay_transaction_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'manual';

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_webpay_token ON orders(webpay_token);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Comentario sobre los nuevos campos
COMMENT ON COLUMN orders.order_id IS 'ID único de orden para WebPay (formato: ORDER_timestamp_random)';
COMMENT ON COLUMN orders.webpay_token IS 'Token de transacción WebPay Plus';
COMMENT ON COLUMN orders.webpay_status IS 'Estado de la transacción WebPay (AUTHORIZED, REJECTED, etc.)';
COMMENT ON COLUMN orders.webpay_amount IS 'Monto confirmado por WebPay';
COMMENT ON COLUMN orders.webpay_transaction_date IS 'Fecha y hora de la transacción WebPay';
COMMENT ON COLUMN orders.payment_method IS 'Método de pago utilizado (webpay, manual, transfer)';