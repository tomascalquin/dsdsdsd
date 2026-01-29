import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderReceiptProps {
  orderId: string;
  total: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  customerName?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL || "https://dropsc.app";

export const OrderReceipt = ({
  orderId,
  total,
  items,
  customerName = "Cliente",
}: OrderReceiptProps) => (
  <Html>
    <Head />
    <Preview>Tu pedido #{orderId} ha sido confirmado</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* ENCABEZADO CON LOGO */}
        <Section style={header}>
          <Row>
            <Column>
              <Text style={logo}>dC</Text>
            </Column>
            <Column align="right">
              <Text style={brandName}>dropsC Store</Text>
            </Column>
          </Row>
        </Section>

        {/* MENSAJE PRINCIPAL */}
        <Section style={content}>
          <Text style={heading}>¡Gracias por tu compra, {customerName}!</Text>
          <Text style={paragraph}>
            Hemos recibido tu pedido correctamente. Estamos preparando tu paquete para el envío.
          </Text>
          <Text style={orderIdText}>Orden: #{orderId}</Text>
        </Section>

        <Hr style={divider} />

        {/* LISTA DE PRODUCTOS */}
        <Section style={orderSection}>
          <Text style={subheading}>Resumen del pedido</Text>
          {items.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column style={{ width: "70%" }}>
                <Text style={itemTitle}>
                  {item.quantity}x {item.title}
                </Text>
              </Column>
              <Column align="right">
                <Text style={itemPrice}>
                  ${(item.price * item.quantity).toLocaleString("es-CL")}
                </Text>
              </Column>
            </Row>
          ))}
        </Section>

        <Hr style={divider} />

        {/* TOTALES */}
        <Section>
          <Row>
            <Column style={{ width: "70%" }}>
              <Text style={totalLabel}>Total Pagado</Text>
            </Column>
            <Column align="right">
              <Text style={totalPrice}>${total.toLocaleString("es-CL")}</Text>
            </Column>
          </Row>
        </Section>

        {/* BOTÓN DE ACCIÓN */}
        <Section align="center" style={{ marginTop: "32px" }}>
          <Link href={`${baseUrl}/perfil`} style={button}>
            Ver mi Pedido
          </Link>
        </Section>

        <Hr style={divider} />

        {/* FOOTER */}
        <Section style={footer}>
          <Text style={footerText}>
            Si tienes dudas, contáctanos en contacto@dropsc.store
          </Text>
          <Text style={footerText}>
            © 2026 DropsC Store. Santiago, Chile.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderReceipt;

// --- ESTILOS INLINE (Necesarios para emails) ---
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  maxWidth: "600px",
};

const header = {
  padding: "20px 48px",
  backgroundColor: "#000000",
  borderRadius: "12px 12px 0 0",
};

const logo = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#000000",
  backgroundColor: "#f97316", // Naranja DropsC
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  textAlign: "center" as const,
  lineHeight: "40px",
  margin: "0",
};

const brandName = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111",
  marginTop: "32px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#444",
};

const orderIdText = {
  fontSize: "14px",
  color: "#8898aa",
  marginTop: "8px",
};

const divider = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const orderSection = {
  padding: "0 48px",
};

const subheading = {
  fontSize: "14px",
  fontWeight: "bold",
  textTransform: "uppercase" as const,
  color: "#8898aa",
  marginBottom: "16px",
};

const itemRow = {
  marginBottom: "8px",
};

const itemTitle = {
  fontSize: "15px",
  color: "#333",
  margin: "0",
};

const itemPrice = {
  fontSize: "15px",
  fontWeight: "bold",
  color: "#333",
  margin: "0",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  paddingLeft: "48px",
};

const totalPrice = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#f97316", // Naranja
  paddingRight: "48px",
  margin: "0",
};

const button = {
  backgroundColor: "#000000",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "16px 0",
  borderRadius: "8px",
  maxWidth: "200px",
  margin: "0 auto",
};

const footer = {
  padding: "0 48px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#8898aa",
  margin: "4px 0",
};