
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-mobile';

export const UpgradePlanButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');

  const handleUpgrade = () => {
    // Placeholder for upgrade functionality
    console.log('Upgrade plan clicked');
    setIsDialogOpen(false);
  };

  const plans = [
    {
      name: 'Básico',
      price: 'R$0',
      period: '/mês',
      description: 'Para médicos iniciando sua prática',
      features: [
        'Até 10 termos por mês',
        '1 modelo de termo',
        'Suporte por e-mail'
      ],
      buttonText: 'Plano Atual',
      disabled: true,
      current: true
    },
    {
      name: 'Profissional',
      price: 'R$99',
      period: '/mês',
      description: 'Para clínicas médicas em crescimento',
      features: [
        'Até 100 termos por mês',
        '5 modelos de termos',
        'Suporte WhatsApp',
        'Assinaturas digitais'
      ],
      buttonText: 'Fazer Upgrade',
      disabled: false,
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'R$249',
      period: '/mês',
      description: 'Para hospitais e grandes clínicas',
      features: [
        'Termos ilimitados',
        'Modelos ilimitados',
        'Suporte prioritário',
        'Assinaturas digitais',
        'Integração com sistemas hospitalares'
      ],
      buttonText: 'Fazer Upgrade',
      disabled: false
    }
  ];

  if (isMobile) {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 mr-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Star className="mr-1 h-4 w-4 text-yellow-400" />
          Upgrade
        </Button>
        
        <Drawer open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center">Escolha seu plano</DrawerTitle>
              <DrawerDescription className="text-center">
                Desbloqueie todos os recursos para melhorar sua prática médica
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={cn(
                    "border rounded-lg p-4", 
                    plan.highlight ? "border-medico-400 bg-medico-50" : "border-neutral-200",
                    plan.current ? "border-yellow-400 bg-yellow-50" : ""
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-bold">{plan.price}</span>
                        <span className="text-neutral-500 text-sm">{plan.period}</span>
                      </div>
                    </div>
                    {plan.current && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">{plan.description}</p>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-medico-600 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    disabled={plan.disabled}
                    variant={plan.highlight ? "default" : "outline"}
                    onClick={plan.disabled ? undefined : handleUpgrade}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 mr-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Star className="mr-1 h-4 w-4 text-yellow-400" />
        Upgrade
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">Escolha seu plano</DialogTitle>
            <DialogDescription className="text-center">
              Desbloqueie todos os recursos para melhorar sua prática médica
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={cn(
                  "border rounded-lg p-4 flex flex-col", 
                  plan.highlight ? "border-medico-400 bg-medico-50" : "border-neutral-200",
                  plan.current ? "border-yellow-400 bg-yellow-50" : ""
                )}
              >
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    {plan.current && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Atual
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-end gap-1 mt-1">
                    <span className="text-2xl font-bold">{plan.price}</span>
                    <span className="text-neutral-500 text-sm">{plan.period}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mb-3">{plan.description}</p>
                <ul className="space-y-2 mb-4 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-medico-600 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full mt-2" 
                  disabled={plan.disabled}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={plan.disabled ? undefined : handleUpgrade}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
