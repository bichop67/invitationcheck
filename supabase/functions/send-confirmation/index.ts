// Follow this setup guide to integrate the Deno runtime into your project:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reservation } = await req.json()

    // Configuration SMTP (à remplacer par vos paramètres)
    const client = new SmtpClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: Deno.env.get("SMTP_USERNAME"),
          password: Deno.env.get("SMTP_PASSWORD"),
        },
      },
    });

    const emailContent = `
      <h1>Confirmation de votre réservation</h1>
      <p>Bonjour ${reservation.first_name} ${reservation.last_name},</p>
      <p>Nous vous confirmons votre réservation pour l'événement "${reservation.event_title}".</p>
      
      <h2>Détails de la réservation :</h2>
      <ul>
        <li>Date : ${new Date(reservation.event_date).toLocaleDateString('fr-FR')}</li>
        <li>Heure : ${reservation.event_time}</li>
        <li>Nombre de billets : ${reservation.quantity}</li>
        <li>Total : ${reservation.total_price}€</li>
      </ul>

      <h2>Informations pratiques :</h2>
      <ul>
        <li>Présentez ce mail ou une version imprimée à l'entrée</li>
        <li>Arrivez 15 minutes avant le début de l'événement</li>
        <li>L'adresse exacte vous sera communiquée quelques jours avant l'événement</li>
      </ul>

      <p>À très bientôt !</p>
      <p>L'équipe SoiréesEntrepreneurs</p>
    `;

    await client.send({
      from: "SoiréesEntrepreneurs <noreply@soirees-entrepreneurs.com>",
      to: reservation.email,
      subject: `Confirmation de réservation - ${reservation.event_title}`,
      content: "text/html",
      html: emailContent,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})