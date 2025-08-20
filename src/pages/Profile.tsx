import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Star } from "lucide-react";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const name = (user?.user_metadata as any)?.full_name || "";
  const email = user?.email || "";

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Meu Perfil</h2>
        <p className="text-sm text-muted-foreground mt-1">Gerencie suas informações pessoais e ações básicas da conta.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Informações</CardTitle>
            <CardDescription>Dados visíveis apenas para você.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={email} readOnly />
            </div>
            <div className="flex gap-2">
              <Button variant="default" disabled title="Em breve">Editar perfil</Button>
              <Button variant="outline" disabled title="Em breve">Atualizar foto</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Segurança</CardTitle>
            <CardDescription>Ações relacionadas à proteção da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Senha</Label>
              <Input type="password" value="********" readOnly />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" disabled title="Em breve">Alterar senha</Button>
              <Button variant="ghost" disabled title="Em breve">Configurar 2FA</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" /> Plano</CardTitle>
          <CardDescription>Veja ou atualize seu plano de assinatura.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Você está utilizando o plano atual.
            </div>
            <div className="flex gap-2">
              <Button variant="highlight">Fazer upgrade</Button>
              <Button variant="outline">Ver limites</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-xs text-muted-foreground flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Precisa de ajuda? Fale com o suporte: suporte@smart-termos.app
      </div>
    </div>
  );
};

export default Profile;
