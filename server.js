// server.js
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const TRANSK_API_KEY = "YOUR_PRODUCTION_API_KEY"; // Inserisci la tua API Key Transak
const TRANSK_BASE_URL = "https://api.transak.com"; // endpoint produzione

// ✅ Endpoint per ricevere notifiche da Transak
app.post("/webhook/transak", async (req, res) => {
  try {
    const event = req.body;
    console.log("🔔 Webhook ricevuto:", event);

    // Verifica evento completato
    if (event.eventName === "ORDER_COMPLETED") {
      const orderId = event.data.orderId;

      // Ottieni dettagli completi dell’ordine da Transak
      const response = await axios.get(`${TRANSK_BASE_URL}/orders/${orderId}`, {
        headers: { "apiKey": TRANSK_API_KEY },
      });

      const order = response.data;
      console.log("💶 Dettagli ordine:", order);

      // Simula accredito (in ambiente reale qui chiameresti il provider bancario)
      console.log(
        `✅ Vendita completata per ${order.cryptoAmount} ${order.cryptoCurrency}. 
        EUR accreditati al conto ${order.fiatAmount} ${order.fiatCurrency}.`
      );

      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ ignored: true });
    }
  } catch (err) {
    console.error("❌ Errore webhook:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Endpoint di test manuale per verificare connessione API Transak
app.get("/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await axios.get(`${TRANSK_BASE_URL}/orders/${orderId}`, {
      headers: { "apiKey": TRANSK_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Backend Transak in ascolto su http://localhost:3000");
});
