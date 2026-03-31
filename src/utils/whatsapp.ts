export function generateWhatsAppLink(phoneNumber, cart, address, total) {
  let message = `Hello! I'd like to place an order:\n\n`;
  cart.forEach(item => {
    message += `${item.quantity}x ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });
  message += `\n*Total: R$ ${total.toFixed(2)}*\n`;
  message += `\nDelivery Address: ${address || 'Not provided'}`;

  const encodedMessage = encodeURIComponent(message);
  
  // Format phone number to numbers only
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
