import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { listProfessionals, type ProfessionalRow } from '@/integrations/supabase/professionals';

interface Props {
  value?: string;
  onValueChange: (professionalId: string, professionalName: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ProfessionalCombobox: React.FC<Props> = ({ value, onValueChange, placeholder = 'Buscar profissional...', disabled, className }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProfessionalRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const selected = useMemo(() => items.find(i => i.id === value) || null, [items, value]);

  const ensureLoaded = async () => {
    if (!loaded) {
      try {
        const data = await listProfessionals();
        setItems(data);
      } finally {
        setLoaded(true);
      }
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) ensureLoaded(); }}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 text-left font-normal',
              className
            )}
          >
            {selected ? (
              <span className="truncate">{selected.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-md border border-input bg-popover text-popover-foreground shadow-md" align="start">
          <Command>
            <div className="flex items-center border-b border-border px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput placeholder="Buscar por nome, email ou telefone..." className="border-0 bg-transparent py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus:ring-0" />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">Nenhum profissional encontrado.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name} ${item.email} ${item.phone ?? ''}`}
                    onSelect={() => { onValueChange(item.id, item.name); setOpen(false); }}
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <Check className={cn('mr-2 h-4 w-4', selected?.id === item.id ? 'opacity-100 text-primary' : 'opacity-0')} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{item.email}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
