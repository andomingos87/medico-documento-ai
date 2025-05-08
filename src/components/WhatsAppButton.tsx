
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export const WhatsAppButton = ({
  phoneNumber = "5511999999999", // Default phone number (replace with actual support number)
  message = "Olá, preciso de suporte no sistema Smart Termos.",
  className
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    // Create WhatsApp URL with phone number and pre-filled message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    // Open in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-green-500 hover:bg-green-600 z-50 flex items-center justify-center p-0",
        className
      )}
      size="icon"
      aria-label="Suporte via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </Button>
  );
};
