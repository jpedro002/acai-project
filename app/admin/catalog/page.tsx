'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CatalogItem {
    id: string; // The inner ID (e.g. "especial")
    docId?: string; // The Firestore document ID (e.g. "base-especial")
    type: string;
    title?: string;
    label?: string;
    description?: string;
    price?: number;
    prices?: Record<string, number>;
    imageUrl?: string;
    imageAlt?: string;
    badge?: string;
    imageBgClass?: string;
    limits?: Record<string, number>;
    [key: string]: any;
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export default function CatalogPage() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<CatalogItem>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchCatalog = async () => {
        setLoading(true);
        try {
            if (!db) {
                console.error("Firebase db not initialized");
                return;
            }
            const snapshot = await getDocs(collection(db, 'catalog'));
            const data: CatalogItem[] = [];
            snapshot.forEach((docSnap) => {
                data.push({ ...docSnap.data(), docId: docSnap.id } as CatalogItem);
            });

            // Sort by type then id
            data.sort((a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id));
            setItems(data);
        } catch (error) {
            console.error("Erro ao buscar catálogo:", error);
            toast.error("Erro ao buscar catálogo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCatalog();
    }, []);

    const handleOpenModal = (item?: CatalogItem) => {
        if (item) {
            setCurrentItem({ ...item });
        } else {
            setCurrentItem({ type: 'base' }); // Do NOT set id, will auto-generate
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (size: string, value: string) => {
        setCurrentItem(prev => {
            const currentPrices = prev.prices || {};
            const newPrices = { ...currentPrices };
            if (value === "") {
                delete newPrices[size];
            } else {
                newPrices[size] = Number(value);
            }
            return { ...prev, prices: Object.keys(newPrices).length > 0 ? newPrices : undefined };
        });
    };

    const handleLimitChange = (category: string, value: string) => {
        setCurrentItem(prev => {
            const currentLimits = prev.limits || {};
            const newLimits = { ...currentLimits };
            if (value === "") {
                delete newLimits[category];
            } else {
                newLimits[category] = Number(value);
            }
            return { ...prev, limits: Object.keys(newLimits).length > 0 ? newLimits : undefined };
        });
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentItem((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        setUploadingImage(true);

        try {
            // 1. Obter a URL pré-assinada do backend
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: file.name, contentType: file.type })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Falha ao gerar URL de upload");

            const { presignedUrl, publicUrl } = data;

            // 2. Fazer o upload para o R2 (Cloudflare) via PUT
            const uploadRes = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            if (!uploadRes.ok) throw new Error("Falha ao subir o arquivo para o Cloudflare");

            // 3. Sucesso!
            setCurrentItem((prev) => ({ ...prev, imageUrl: publicUrl }));
            toast.success("Imagem enviada com sucesso!");
        } catch (error) {
            console.error("Upload error", error);
            const message = error instanceof Error ? error.message : "Erro ao fazer upload da imagem";
            toast.error(message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (!db) throw new Error("DB not init");

            const { docId, ...dataToSave } = currentItem;

            // Auto generate ID if not exists
            if (!dataToSave.id) {
                const sourceName = dataToSave.title || dataToSave.label;
                dataToSave.id = sourceName ? slugify(sourceName) : Math.random().toString(36).substring(7);
            }

            if (!dataToSave.type) {
                toast.error("Tipo é obrigatório.");
                setIsSaving(false);
                return;
            }

            const targetDocId = `${dataToSave.type}-${dataToSave.id}`;
            const docRef = doc(db, 'catalog', targetDocId);

            // Clean up undefined fields
            const cleanData = Object.fromEntries(Object.entries(dataToSave).filter(([_, v]) => v !== undefined));

            await setDoc(docRef, cleanData);

            // If the category (type) or id changed, we should delete the old document
            if (docId && docId !== targetDocId) {
                await deleteDoc(doc(db, 'catalog', docId));
            }

            toast.success("Salvo com sucesso!");
            handleCloseModal();
            fetchCatalog();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            toast.error("Erro ao salvar item.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (!db) return;
            await deleteDoc(doc(db, 'catalog', itemToDelete));
            toast.success("Item excluído com sucesso!");
            fetchCatalog();
        } catch (error) {
            console.error("Erro ao excluir:", error);
            toast.error("Erro ao excluir item.");
        } finally {
            setItemToDelete(null);
        }
    };

    const sizesFromCatalog = items.filter(i => i.type === 'size');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center bg-surface p-6 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary">Catálogo</h1>
                    <p className="text-on-surface-variant mt-1">Gerencie bases, tamanhos, cremes e todos os adicionais.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold shadow hover:scale-105 transition-all"
                >
                    + Nova Opção
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium border-b border-outline-variant">Image</th>
                                <th className="p-4 font-medium border-b border-outline-variant">Tipo</th>
                                <th className="p-4 font-medium border-b border-outline-variant">ID / Nome</th>
                                <th className="p-4 font-medium border-b border-outline-variant">Preço</th>
                                <th className="p-4 font-medium border-b border-outline-variant text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">Carregando catálogo...</td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">Nenhum item encontrado.</td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.docId} className="border-b border-outline-variant hover:bg-surface-variant/50 transition-colors">
                                        <td className="p-4 align-middle">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.imageAlt || item.title} className="w-12 h-12 rounded object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 bg-surface-container-high rounded flex items-center justify-center text-xs text-on-surface-variant">sem img</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-on-surface align-middle">
                                            <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-md text-xs font-bold uppercase">
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-on-surface align-middle">
                                            <div className="font-bold">{item.title || item.label || 'Sem Nome'}</div>
                                            <div className="text-xs text-on-surface-variant font-mono">{item.id}</div>
                                        </td>
                                        <td className="p-4 text-on-surface align-middle">
                                            {item.price !== undefined && (
                                                <div>R$ {item.price.toFixed(2)}</div>
                                            )}
                                            {item.prices && (
                                                <div className="text-xs text-on-surface-variant">
                                                    {Object.entries(item.prices).map(([k, v]) => `${k}: R$${v.toFixed(2)}`).join(' | ')}
                                                </div>
                                            )}
                                            {item.price === undefined && !item.prices && '-'}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="text-primary hover:bg-primary/10 px-3 py-1 rounded transition-colors mr-2 text-sm font-medium"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setItemToDelete(item.docId ?? null)}
                                                className="text-error hover:bg-error/10 px-3 py-1 rounded transition-colors text-sm font-medium"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edição/Criação */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                            <h2 className="text-2xl font-bold font-headline text-on-surface">
                                {currentItem.docId ? 'Editar Item' : 'Nova Opção'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-error text-2xl font-bold">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 text-on-surface">
                            <form id="catalog-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Tipo de Produto</label>
                                    <select
                                        required
                                        name="type"
                                        value={currentItem.type || 'base'}
                                        onChange={handleChange}
                                        disabled={currentItem.type === 'size'} // O tamanho não pode ser alterado ou criado por aqui
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all disabled:opacity-50"
                                    >
                                        <option value="base">Base (Açaí)</option>
                                        <option value="gelato-base">Base (Gelato)</option>
                                        {currentItem.type === 'size' && <option value="size">Tamanho (Size)</option>}
                                        <option value="cream">Creme (Cream)</option>
                                        <option value="fruit">Fruta (Fruit)</option>
                                        <option value="topping">Toping (Topping)</option>
                                        <option value="mix">Mix/Guloseima</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Título (Title) ou Rótulo</label>
                                    <input
                                        required={currentItem.type !== 'size'}
                                        type="text"
                                        name={currentItem.type === 'size' ? 'label' : 'title'}
                                        value={(currentItem.type === 'size' ? currentItem.label : currentItem.title) || ''}
                                        onChange={handleChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Ex: Açaí Tradicional"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2 space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Descrição</label>
                                    <textarea
                                        name="description"
                                        value={currentItem.description || ''}
                                        onChange={handleChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Breve descrição do produto..."
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Preço Único (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={currentItem.price !== undefined ? currentItem.price : ''}
                                        onChange={handleNumberChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Ex: 2.50"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Badge Promocional</label>
                                    <input
                                        type="text"
                                        name="badge"
                                        value={currentItem.badge || ''}
                                        onChange={handleChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Ex: CLÁSSICO, NOVO"
                                    />
                                </div>

                                {currentItem.type === 'base' || currentItem.type === 'gelato-base' ? (
                                    <div className="col-span-1 md:col-span-2 bg-surface-container-high p-4 rounded-lg space-y-3 border border-outline-variant">
                                        <label className="text-sm font-bold text-on-surface-variant block">Tabela de Preços por Tamanho</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {sizesFromCatalog.length === 0 ? (
                                                <span className="text-xs text-on-surface-variant col-span-2">Nenhum tamanho cadastrado no sistema. Crie um tamanho primeiro.</span>
                                            ) : (
                                                sizesFromCatalog.map(size => (
                                                    <div key={size.id} className="space-y-1">
                                                        <label className="text-xs font-bold text-on-surface-variant">{size.label || size.id} (R$)</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={currentItem.prices?.[size.id] ?? ''}
                                                            onChange={(e) => handlePriceChange(size.id, e.target.value)}
                                                            className="w-full bg-surface-container p-2 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                            placeholder="Ex: 15.90"
                                                        />
                                                    </div>
                                                )))}
                                        </div>
                                    </div>
                                ) : null}

                                {currentItem.type === 'size' ? (
                                    <div className="col-span-1 md:col-span-2 bg-surface-container-high p-4 rounded-lg space-y-3 border border-outline-variant">
                                        <label className="text-sm font-bold text-on-surface-variant block">Limites de Itens</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: 'creams', label: 'Cremes' },
                                                { id: 'fruits', label: 'Frutas' },
                                                { id: 'toppings', label: 'Coberturas' },
                                                { id: 'mix', label: 'Mix/Guloseimas' }
                                            ].map(limit => (
                                                <div key={limit.id} className="space-y-1">
                                                    <label className="text-xs font-bold text-on-surface-variant">{limit.label}</label>
                                                    <input
                                                        type="number"
                                                        value={currentItem.limits?.[limit.id] ?? ''}
                                                        onChange={(e) => handleLimitChange(limit.id, e.target.value)}
                                                        className="w-full bg-surface-container p-2 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                        placeholder="Ex: 3"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

                                <div className="col-span-1 md:col-span-2 space-y-2 border p-4 rounded-lg bg-surface-container-low border-outline-variant">
                                    <label className="text-sm font-bold text-on-surface-variant block">Upload de Imagem</label>
                                    <div className="flex gap-4 items-center">
                                        {currentItem.imageUrl && (
                                            <img src={currentItem.imageUrl} alt="preview" className="w-16 h-16 rounded object-cover border" />
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploadingImage}
                                                className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all font-mono"
                                            />
                                            <div className="mt-2 flex">
                                                <input
                                                    type="url"
                                                    name="imageUrl"
                                                    value={currentItem.imageUrl || ''}
                                                    onChange={handleChange}
                                                    className="w-full bg-surface-container p-2 text-xs rounded-lg border border-outline focus:border-primary focus:ring-1 outline-none font-mono"
                                                    placeholder="Url da imagem (auto ao upar)"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Alt da Imagem</label>
                                    <input
                                        type="text"
                                        name="imageAlt"
                                        value={currentItem.imageAlt || ''}
                                        onChange={handleChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-on-surface-variant block">Cor de Fundo (Tailwind)</label>
                                    <input
                                        type="text"
                                        name="imageBgClass"
                                        value={currentItem.imageBgClass || ''}
                                        onChange={handleChange}
                                        className="w-full bg-surface-container p-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Ex: bg-tertiary-container"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-6 py-2 text-on-surface rounded-full font-bold hover:bg-surface-variant transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="catalog-form"
                                disabled={isSaving || uploadingImage}
                                className="bg-primary text-on-primary px-8 py-2 rounded-full font-bold shadow hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog open={!!itemToDelete} onOpenChange={(isOpen) => !isOpen && setItemToDelete(null)}>
                <AlertDialogContent className="bg-surface text-on-surface border-outline">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription className="text-on-surface-variant">
                            Isto excluirá o produto permanentemente do seu catálogo no banco de dados. Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-outline-variant hover:bg-surface-variant">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-error text-onError hover:bg-error/90 font-bold">
                            Sim, excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}