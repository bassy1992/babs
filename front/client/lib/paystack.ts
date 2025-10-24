/**
 * Paystack payment integration for Ghana
 */

export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number; // in GHS
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: string[];
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

/**
 * Load Paystack inline script
 */
export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Paystack script'));
    document.body.appendChild(script);
  });
}

/**
 * Initialize Paystack payment popup
 */
export async function initializePaystack(config: PaystackConfig): Promise<void> {
  // Load Paystack script if not already loaded
  await loadPaystackScript();

  // Convert amount to pesewas (kobo)
  const amountInPesewas = Math.round(config.amount * 100);

  const handler = window.PaystackPop.setup({
    key: config.publicKey,
    email: config.email,
    amount: amountInPesewas,
    currency: config.currency || 'GHS',
    ref: config.reference,
    channels: config.channels || ['card', 'bank', 'mobile_money'],
    metadata: config.metadata,
    onClose: () => {
      config.onClose();
    },
    callback: (response: any) => {
      config.onSuccess(response.reference);
    },
  });

  handler.openIframe();
}

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(orderId: string): string {
  const timestamp = Date.now();
  return `PAY-${orderId}-${timestamp}`;
}
