// lib/alert.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail(subject: string, message: string) {
  const to = process.env.ALERT_EMAIL_TO;
  const from = process.env.ALERT_EMAIL_FROM || "monitor@yastech.dev";

  if (!to) return;

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      text: message,
    });

    console.log("📧 Alerta enviado:", subject);
  } catch (err) {
    console.error("❌ Erro ao enviar alerta:", err);
  }
}
