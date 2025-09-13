import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Star } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UpgradePlanButton } from "@/components/UpgradePlanButton";

export const Profile: React.FC = () => {
  const { user } = useAuth();

  const name = (user?.user_metadata as any)?.full_name || "";
  const email = user?.email || "";
  const [nameInput, setNameInput] = useState<string>(name);
  const [saving, setSaving] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  const handleSaveName = async () => {
    if (!user) return;
    if (nameInput.trim() === name.trim()) {
      toast({ title: "Nada para salvar", description: "O nome não foi alterado." });
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        data: { full_name: nameInput.trim() },
      });
      if (error) {
        toast({ title: "Erro ao atualizar nome", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Nome atualizado", description: "Suas informações foram salvas com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível atualizar o nome.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const validateNewPassword = (pwd: string) => {
    return pwd.length >= 8; // política mínima; podemos evoluir com regras de complexidade
  };

  const handleChangePassword = async () => {
    if (!user || !email) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Senhas não conferem", description: "A confirmação deve ser igual à nova senha.", variant: "destructive" });
      return;
    }
    if (!validateNewPassword(newPassword)) {
      toast({ title: "Senha fraca", description: "A nova senha deve ter ao menos 8 caracteres.", variant: "destructive" });
      return;
    }
    try {
      setChangingPwd(true);
      // Reautentica para confirmar identidade
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) {
        toast({ title: "Senha atual incorreta", description: "Não foi possível confirmar sua identidade.", variant: "destructive" });
        return;
      }
      // Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        toast({ title: "Erro ao alterar senha", description: updateError.message, variant: "destructive" });
        return;
      }
      toast({ title: "Senha alterada", description: "Sua senha foi atualizada com sucesso." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast({ title: "Erro inesperado", description: "Tente novamente mais tarde.", variant: "destructive" });
    } finally {
      setChangingPwd(false);
    }
  };

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
              <Input
                id="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={email} readOnly />
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={handleSaveName}
                disabled={saving || nameInput.trim().length === 0 || nameInput.trim() === name.trim()}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setNameInput(name)}
                disabled={saving || nameInput === name}
              >
                Cancelar
              </Button>
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
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleChangePassword}
                disabled={
                  changingPwd ||
                  currentPassword.trim().length === 0 ||
                  newPassword.trim().length === 0 ||
                  confirmPassword.trim().length === 0
                }
              >
                {changingPwd ? "Alterando..." : "Alterar senha"}
              </Button>
              <Button
                variant="ghost"
                disabled
                title="Em breve"
              >
                Configurar 2FA
              </Button>
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
              <UpgradePlanButton />
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

