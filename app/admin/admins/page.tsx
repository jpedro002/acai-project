'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  UserPlus,
  Search,
  Mail,
  CalendarDays,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/admin/manage');
      if (!res.ok) throw new Error('Erro ao buscar administradores');
      const data = await res.json();
      setAdmins(data.admins || []);
    } catch {
      toast.error('Não foi possível carregar os administradores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const openCreateDialog = () => {
    setEditingAdmin(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setDialogOpen(true);
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormName(admin.name);
    setFormEmail(admin.email);
    setFormPassword('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (!editingAdmin && !formPassword.trim()) {
      toast.error('Senha é obrigatória para novos administradores');
      return;
    }

    setSaving(true);
    try {
      if (editingAdmin) {
        // Update
        const res = await fetch('/api/auth/admin/manage', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAdmin.id,
            name: formName,
            email: formEmail,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao atualizar');
        }
        toast.success('Administrador atualizado com sucesso');
      } else {
        // Create
        const res = await fetch('/api/auth/admin/manage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            password: formPassword,
          }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erro ao criar');
        }
        toast.success('Administrador criado com sucesso');
      }

      setDialogOpen(false);
      fetchAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    setDeleting(adminId);
    try {
      const res = await fetch(`/api/auth/admin/manage?id=${adminId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao remover');
      }
      toast.success('Administrador removido');
      fetchAdmins();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado';
      toast.error(message);
    } finally {
      setDeleting(null);
    }
  };

  const filteredAdmins = admins.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (a.name || '').toLowerCase().includes(s) ||
      (a.email || '').toLowerCase().includes(s)
    );
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-surface p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold text-on-surface">
              Administradores
            </h1>
            <p className="text-sm text-on-surface-variant">
              Gerencie os acessos de administrador do sistema
            </p>
          </div>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-primary text-on-primary rounded-xl px-5 h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-headline font-black text-on-surface">
              {loading ? '—' : admins.length}
            </p>
            <p className="text-xs text-on-surface-variant font-medium">Total de admins</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-headline font-black text-on-surface">
              {loading
                ? '—'
                : admins.filter((a) => {
                    const d = new Date(a.createdAt);
                    const now = new Date();
                    return (
                      d.getMonth() === now.getMonth() &&
                      d.getFullYear() === now.getFullYear()
                    );
                  }).length}
            </p>
            <p className="text-xs text-on-surface-variant font-medium">Adicionados este mês</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface truncate">
              {loading || admins.length === 0
                ? '—'
                : admins
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )[0]?.name || admins[0]?.email || '—'}
            </p>
            <p className="text-xs text-on-surface-variant font-medium">Último adicionado</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          placeholder="Buscar administradores..."
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-3 text-on-surface-variant font-medium">Carregando...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-outline-variant/10 hover:bg-transparent">
                <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider pl-6">
                  Admin
                </TableHead>
                <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                  Função
                </TableHead>
                <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                  Criado em
                </TableHead>
                <TableHead className="text-on-surface-variant font-bold text-xs uppercase tracking-wider text-right pr-6">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-16 text-on-surface-variant"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <ShieldCheck className="w-10 h-10 text-outline" />
                      <p className="text-base font-medium">
                        {search
                          ? 'Nenhum resultado encontrado'
                          : 'Nenhum administrador cadastrado'}
                      </p>
                      {!search && (
                        <Button
                          variant="outline"
                          onClick={openCreateDialog}
                          className="mt-2 rounded-xl gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar primeiro admin
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    className="border-outline-variant/10 hover:bg-surface-container-low/60 transition-colors"
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {(admin.name || admin.email || 'A').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-on-surface text-sm">
                          {admin.name || admin.email || 'Admin'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-on-surface-variant flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-outline" />
                        {admin.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[11px] font-bold px-2.5 rounded-lg">
                        Administrador
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-on-surface-variant">
                        {formatDate(admin.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEditDialog(admin)}
                          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <AlertDialog>
                          <AlertDialogTrigger
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remover administrador
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover{' '}
                                <strong>{admin.name}</strong>? O acesso ao
                                painel será revogado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(admin.id)}
                                disabled={deleting === admin.id}
                                className="bg-error text-on-error hover:bg-error/90"
                              >
                                {deleting === admin.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <Trash2 className="w-4 h-4 mr-2" />
                                )}
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              {editingAdmin ? (
                <>
                  <Pencil className="w-5 h-5 text-primary" />
                  Editar Administrador
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 text-primary" />
                  Novo Administrador
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingAdmin
                ? 'Atualize as informações do administrador.'
                : 'Preencha os dados para criar um novo acesso.'}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Nome
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="admin@exemplo.com"
              />
            </div>
            {!editingAdmin && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Senha Temporária
                </label>
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            )}
          </div>

          <DialogFooter className="px-6 pb-6">
            <DialogClose
              render={
                <Button variant="outline" className="rounded-xl" />
              }
            >
              Cancelar
            </DialogClose>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-on-primary rounded-xl gap-2 shadow-lg shadow-primary/20"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingAdmin ? 'Salvar Alterações' : 'Criar Acesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}