"use client";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function CheckoutForm({ amount, paymentIntentId, onSuccess, onError }: { 
  amount: number;
  paymentIntentId: string;
  onSuccess: () => void; 
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/colaborar?success=true`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Error al procesar el pago");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirmar el pago en el backend para guardar en BD y crear suscripción
      try {
        const response = await fetch(`${API_URL}/api/payment/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          onSuccess();
        } else {
          console.error('Error del servidor:', data);
          onError(data.message || "Error al procesar el pago en el servidor");
        }
      } catch (err) {
        console.error('Error confirmando pago:', err);
        onError("Error de conexión al procesar el pago");
      }
      setIsProcessing(false);
    } else {
      onError("Estado de pago desconocido");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 rounded-full text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#8A4D76' }}
      >
        {isProcessing ? "Procesando..." : `Pagar ${amount}€`}
      </button>
    </form>
  );
}
