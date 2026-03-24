declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
  theme?: { color?: string };
}

interface RazorpayInstance {
  open: () => void;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

let scriptLoaded = false;

export function loadRazorpayScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.head.appendChild(script);
  });
}

export function openRazorpayCheckout(options: {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}) {
  const rzp = new window.Razorpay({
    key: options.key,
    amount: options.amount * 100,
    currency: options.currency,
    order_id: options.orderId,
    name: "OkSplit",
    description: "Settle Up Payment",
    handler: options.onSuccess,
    modal: { ondismiss: options.onDismiss },
    theme: { color: "#2DBAA0" },
  });
  rzp.open();
}
