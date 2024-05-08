'use server';
import { Resend } from 'resend';

export async function notify(to: string | undefined, html: string) {
  if (to) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    return await resend.emails
      .send({
        from: 'rafael@shield-ai.app',
        to: to,
        subject: 'Stay Up To Date With Shield AI',
        html: html,
      })
      .catch((error) => {
        console.error(error);
        throw new Error('could not process your request.');
      });
  } else {
    throw new Error('no email was provided.');
  }
}
