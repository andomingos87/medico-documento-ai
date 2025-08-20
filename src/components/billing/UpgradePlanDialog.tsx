import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ShieldCheck, Building2 } from 'lucide-react';

export type PlanId = 'basic' | 'pro' | 'enterprise';

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelectPlan?: (plan: PlanId) => void;
}

const features = {
  basic: [
    'Até 30 termos/mês',
    'Assinatura digital',
    'Armazenamento na nuvem',
    'Até 30: Agendamentos / lembretes / pós-operatórios',
  ],
  pro: [
    'Até 100 termos/mês',
    'Inclusão de imagens / vídeos explicativos',
    'Armazenamento na nuvem',
    'Suporte prioritário',
    'Integração básica em sistema de gestão / prontuário (API)',
    'Até 100: Agendamentos / lembretes / pós-operatórios',
  ],
  enterprise: [
    'Termos/mês ilimitados',
    'Multimídia interativa',
    'Integração total via API com PMS | EHR',
    'Onboarding dedicado + treinamento de equipe',
    'Agendamentos, lembretes e pós-operatórios ilimitados',
  ],
};

const prices = {
  basic: 'R$ 97,00/mês',
  pro: 'R$ 197,00/mês',
  enterprise: 'Fale com a gente',
};

export const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({ open, onOpenChange, onSelectPlan }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Escolha seu plano</DialogTitle>
              <DialogDescription>
                Indicado para clínicas e profissionais da saúde/estética de diferentes portes. Selecione o plano que melhor atende sua necessidade.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator />

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Basic */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Basic</h3>
                </div>
                <span className="text-sm text-muted-foreground">Para clínicas pequenas ou profissionais individuais</span>
              </div>
              <div className="px-5 pb-1 text-2xl font-bold">{prices.basic}</div>
              <ul className="px-5 py-3 space-y-2 text-sm flex-1">
                {features.basic.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="p-5 pt-0">
                <Button className="w-full" variant="default" onClick={() => onSelectPlan?.('basic')}>
                  Escolher Basic
                </Button>
              </div>
            </div>

            {/* Pro */}
            <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm ring-2 ring-primary flex flex-col">
              <div className="absolute -top-2 right-3">
                <Badge className="bg-primary text-primary-foreground">Mais vendido</Badge>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Pro</h3>
                </div>
                <span className="text-sm text-muted-foreground">Para clínicas em crescimento</span>
              </div>
              <div className="px-5 pb-1 text-2xl font-bold">{prices.pro}</div>
              <ul className="px-5 py-3 space-y-2 text-sm flex-1">
                {features.pro.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="p-5 pt-0">
                <Button className="w-full" onClick={() => onSelectPlan?.('pro')}>Escolher Pro</Button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col">
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Enterprise</h3>
                </div>
                <span className="text-sm text-muted-foreground">Para redes de clínicas ou franquias</span>
              </div>
              <div className="px-5 pb-1 text-2xl font-bold">{prices.enterprise}</div>
              <ul className="px-5 py-3 space-y-2 text-sm flex-1">
                {features.enterprise.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="p-5 pt-0">
                <Button className="w-full" variant="secondary" onClick={() => onSelectPlan?.('enterprise')}>
                  Falar com vendas
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Observação: Evitamos o uso do termo “médico” para contemplar a atuação de diversos profissionais da saúde/estética.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;
