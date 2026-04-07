"use client";

import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updatePassword 
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

// Essa senha secreta é usada para logar usuários que escolheram não ter senha
const DEFAULT_PASS = "no-password-acai-123!";
const getFakeEmail = (phone: string) => `${phone.replace(/\\D/g, "")}@acai.local`;

export function PhoneLogin({ onLogin }: { onLogin?: () => void }) {
  const [step, setStep] = useState<"PHONE" | "ASK_PASSWORD" | "SET_PASSWORD" | "ENTER_PASSWORD">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\\D/g, "");
    
    if (cleanPhone.length < 10) {
      setError("Digite um número válido com DDD");
      return;
    }

    setLoading(true);
    setError("");
    const email = getFakeEmail(cleanPhone);

    try {
      if (!auth) throw new Error("Firebase não está configurado");
      
      try {
        // Tenta logar usando a senha padrão (caso o usuário nunca tenha setado uma senha)
        await signInWithEmailAndPassword(auth, email, DEFAULT_PASS);
        // Sucesso: usuário retornou e não tem senha personalizada!
        if (onLogin) onLogin();
      } catch (loginErr: any) {
        if (loginErr.code === "auth/user-not-found" || loginErr.code === "auth/invalid-credential") {
          try {
            // Se falhou por não existir, vamos criar com a senha padrão!
            await createUserWithEmailAndPassword(auth, email, DEFAULT_PASS);
            // Sucesso: usuário novo criado
            setStep("ASK_PASSWORD");
          } catch (createErr: any) {
            if (createErr.code === "auth/email-already-in-use") {
              // Significa que a conta existe e o signInWithEmailAndPassword retornou invalid-credential, então ele tem senha própria
              setStep("ENTER_PASSWORD");
            } else {
              throw createErr;
            }
          }
        } else if (loginErr.code === "auth/wrong-password") {
          // Significa que o usuário tem uma senha personalizada
          setStep("ENTER_PASSWORD");
        } else {
          throw loginErr;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de autenticação");
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!auth || !auth.currentUser) throw new Error("Usuário não logado");
      if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres");
      
      // Atualiza a senha padrão 'no-password-acai-123!' para a senha que o cliente digitou
      await updatePassword(auth.currentUser, password);
      // E segue pro login final
      if (onLogin) onLogin();
    } catch (err: any) {
      setError(err.message || "Erro ao definir senha");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!auth) throw new Error("Firebase não está configurado");
      const email = getFakeEmail(phoneNumber);
      await signInWithEmailAndPassword(auth, email, password);
      if (onLogin) onLogin();
    } catch (err: any) {
      setError("Senha incorreta");
    } finally {
      setLoading(false);
    }
  };

  const skipPassword = () => {
    if (onLogin) onLogin();
  };

  if (step === "PHONE") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <h2 className="text-xl font-bold">Acessar ou Criar Conta</h2>
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Telefone (com DDD)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="11999999999"
              className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 font-bold transition-colors"
          >
            {loading ? "Verificando..." : "Continuar"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  if (step === "ASK_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <h2 className="text-xl font-bold">Quase lá! 🎉</h2>
        <p className="text-sm text-gray-600 mb-2">
          Deseja cadastrar uma senha para aumentar a segurança da sua conta? 
          Se pular essa etapa, você só precisará informar seu número na próxima vez!
        </p>
        
        <div className="flex flex-col gap-3">
          <button
             onClick={() => setStep("SET_PASSWORD")}
             className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 font-bold transition-colors"
          >
            Sim, criar uma senha
          </button>
          <button
            onClick={skipPassword}
            className="bg-gray-100 text-gray-800 p-3 rounded-xl hover:bg-gray-200 font-bold transition-colors"
          >
             Pular (continuar sem senha)
          </button>
        </div>
      </div>
    );
  }

  if (step === "SET_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <h2 className="text-xl font-bold">Criar Senha</h2>
        <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Digite uma senha forte</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
              minLength={6}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 font-bold transition-colors"
          >
            {loading ? "Salvando..." : "Salvar Senha e Entrar"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  if (step === "ENTER_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-6 border border-gray-200 rounded-2xl shadow-sm bg-white">
        <h2 className="text-xl font-bold">Bem vindo de volta! 👋</h2>
        <p className="text-sm text-gray-600 mb-2">Para proteger sua conta, digite sua senha cadastrada.</p>
        <form onSubmit={handleLoginWithPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Sua senha secreta</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:bg-gray-400 font-bold transition-colors"
          >
            {loading ? "Acessando..." : "Entrar"}
          </button>
          <button
            type="button"
            onClick={() => {
               setStep("PHONE");
               setPassword("");
            }}
            className="text-sm text-center text-gray-500 mt-2 hover:underline"
          >
            Vou tentar com outro número
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  return null;
}
