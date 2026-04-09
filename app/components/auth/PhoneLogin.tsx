"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type Step = "PHONE" | "ASK_PASSWORD" | "SET_PASSWORD" | "ENTER_PASSWORD";
type AuthMode = "password" | "passwordless";

export interface PhoneLoginResult {
  phone: string;
  authMode: AuthMode;
}

const DEFAULT_PASS = "no-password-acai-123!";
const getFakeEmail = (phone: string) => `${phone}@acai.local`;
const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

const formatPhone = (value: string) => {
  const v = value.replace(/\D/g, "");
  if (!v) return "";
  if (v.length <= 2) return `(${v}`;
  if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
  return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: string }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
};

const getFirebaseErrorCode = (error: unknown) => {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    if (typeof code === "string") {
      return code;
    }
  }

  return "";
};

export function PhoneLogin({ onLogin }: { onLogin?: (result: PhoneLoginResult) => void }) {
  const [step, setStep] = useState<Step>("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const finalizeLogin = async (cleanPhone: string, authMode: AuthMode) => {
    if (!auth || !auth.currentUser) {
      throw new Error("Sessão de usuário não encontrada.");
    }

    const idToken = await auth.currentUser.getIdToken(true);

    const response = await fetch("/api/auth/app/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idToken,
        phone: cleanPhone,
        authMode,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      throw new Error(data.error ?? "Não foi possível abrir sessão no app.");
    }

    if (onLogin) {
      onLogin({ phone: cleanPhone, authMode });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizePhone(phoneNumber);

    if (cleanPhone.length < 10) {
      setError("Digite um número válido com DDD");
      return;
    }

    setPhoneNumber(formatPhone(cleanPhone));

    setLoading(true);
    setError("");
    const email = getFakeEmail(cleanPhone);

    try {
      if (!auth) throw new Error("Firebase não está configurado");

      try {
        await signInWithEmailAndPassword(auth, email, DEFAULT_PASS);
        await finalizeLogin(cleanPhone, "passwordless");
      } catch (loginErr: unknown) {
        const loginCode = getFirebaseErrorCode(loginErr);
        if (
          loginCode === "auth/user-not-found" ||
          loginCode === "auth/invalid-credential" ||
          loginCode === "auth/wrong-password"
        ) {
          try {
            await createUserWithEmailAndPassword(auth, email, DEFAULT_PASS);
            setStep("ASK_PASSWORD");
          } catch (createErr: unknown) {
            const createCode = getFirebaseErrorCode(createErr);
            if (createCode === "auth/email-already-in-use") {
              setStep("ENTER_PASSWORD");
            } else {
              throw createErr;
            }
          }
        } else {
          throw loginErr;
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err, "Erro de autenticação"));
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

      await updatePassword(auth.currentUser, password);
      await finalizeLogin(normalizePhone(phoneNumber), "password");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao definir senha"));
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
      const cleanPhone = normalizePhone(phoneNumber);
      const email = getFakeEmail(cleanPhone);
      await signInWithEmailAndPassword(auth, email, password);
      await finalizeLogin(cleanPhone, "password");
    } catch (err: unknown) {
      console.error(err);
      setError("Senha incorreta ou conta inválida.");
    } finally {
      setLoading(false);
    }
  };

  const skipPassword = async () => {
    try {
      setLoading(true);
      setError("");
      await finalizeLogin(normalizePhone(phoneNumber), "passwordless");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Erro ao concluir login sem senha"));
    } finally {
      setLoading(false);
    }
  };

  if (step === "PHONE") {
    return (
      <div className="flex flex-col gap-4 w-full p-6 border border-outline-variant/20 rounded-3xl shadow-sm bg-surface">
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">Telefone para contato e login (com DDD)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50 outline-none text-on-surface"
              required
              disabled={loading}
              autoFocus
              maxLength={15}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-inverse-primary text-on-primary-fixed py-4 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {loading ? "Verificando..." : "Continuar"}
          </button>
        </form>
        {error && <p className="text-error font-bold text-sm">{error}</p>}
      </div>
    );
  }

  if (step === "ASK_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full p-6 border border-outline-variant/20 rounded-3xl shadow-sm bg-surface">
        <h2 className="text-xl font-bold font-headline">Quase lá! 🎉</h2>
        <p className="text-sm text-on-surface-variant mb-2">
          Deseja cadastrar uma senha para aumentar a segurança da sua conta?
          Se pular essa etapa, você só precisará informar seu número na próxima vez!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStep("SET_PASSWORD")}
            disabled={loading}
            className="bg-inverse-primary text-on-primary-fixed p-4 rounded-xl font-bold transition-colors hover:opacity-90"
          >
            Sim, criar uma senha
          </button>
          <button
            onClick={skipPassword}
            disabled={loading}
            className="bg-surface-container-high text-on-surface p-4 rounded-xl font-bold transition-colors hover:bg-surface-variant disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Pular (continuar sem senha)"}
          </button>
        </div>

        {error && <p className="text-error font-bold text-sm">{error}</p>}
      </div>
    );
  }

  if (step === "SET_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full p-6 border border-outline-variant/20 rounded-3xl shadow-sm bg-surface">
        <h2 className="text-xl font-bold font-headline">Criar Senha</h2>
        <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">Digite uma senha forte</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50 outline-none text-on-surface"
              required
              disabled={loading}
              minLength={6}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-inverse-primary text-on-primary-fixed py-4 rounded-xl font-bold transition-colors disabled:opacity-50 hover:opacity-90"
          >
            {loading ? "Salvando..." : "Salvar Senha e Entrar"}
          </button>
        </form>
        {error && <p className="text-error font-bold text-sm">{error}</p>}
      </div>
    );
  }

  if (step === "ENTER_PASSWORD") {
    return (
      <div className="flex flex-col gap-4 w-full p-6 border border-outline-variant/20 rounded-3xl shadow-sm bg-surface">
        <h2 className="text-xl font-bold font-headline">Bem vindo de volta! 👋</h2>
        <p className="text-sm text-on-surface-variant mb-2">Para proteger sua conta, digite sua senha cadastrada.</p>
        <form onSubmit={handleLoginWithPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant ml-1">Sua senha secreta</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-container-high border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-inverse-primary transition-all placeholder:text-on-surface-variant/50 outline-none text-on-surface"
              required
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-inverse-primary text-on-primary-fixed py-4 rounded-xl font-bold transition-colors disabled:opacity-50 hover:opacity-90"
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
