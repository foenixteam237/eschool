"use client";

import { useState, useEffect, useRef } from "react";
import {
    Search,
    Send,
    User,
    Paperclip,
    Phone,
    Video,
    Info,
    ChevronLeft,
    Plus,
    Users,
    CheckCheck,
    Check,
    Megaphone,
    X,
    FileText,
    Smile,
    ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MessageItem {
    id: string;
    sender: "me" | "them";
    text: string;
    time: string;
    attachment?: {
        name: string;
        size: string;
    };
}

interface ChatConversation {
    id: string;
    name: string;
    role: "Enseignant" | "Parent" | "Administration" | "Diffusion";
    avatarBg: string;
    phone?: string;
    classContext?: string;
    lastMsg: string;
    time: string;
    unread: number;
    online: boolean;
    messages: MessageItem[];
}

const defaultConversations: ChatConversation[] = [
    {
        id: "chat-1",
        name: "M. DUPONT Jean",
        role: "Enseignant",
        avatarBg: "bg-blue-600",
        phone: "+237 699 00 11 22",
        classContext: "Mathématiques • 6ème A & Tle C",
        lastMsg: "Oui, tout est rentré ! Je viens de valider le cahier de texte également.",
        time: "08:32",
        unread: 0,
        online: true,
        messages: [
            {
                id: "m-1",
                sender: "them",
                text: "Bonjour M. l'Administrateur, avez-vous pu vérifier la grille horaire de Mathématiques pour la classe de 6ème A ?",
                time: "08:25"
            },
            {
                id: "m-2",
                sender: "me",
                text: "Bonjour M. Dupont. Oui, les créneaux ont été ajustés avec le Censeur pour le mardi et jeudi matin.",
                time: "08:29"
            },
            {
                id: "m-3",
                sender: "them",
                text: "Parfait, je valide les évaluations séquentielles dans l'espace Notes dès ce midi.",
                time: "08:31"
            },
            {
                id: "m-4",
                sender: "them",
                text: "Oui, tout est rentré ! Je viens de valider le cahier de texte également.",
                time: "08:32"
            }
        ]
    },
    {
        id: "chat-2",
        name: "Mme BELLA Solange",
        role: "Parent",
        avatarBg: "bg-amber-600",
        phone: "+237 677 88 99 00",
        classContext: "Parent de BELLA Marie (4ème All A)",
        lastMsg: "Merci pour le suivi des notes de Jean et Marie.",
        time: "Hier",
        unread: 1,
        online: false,
        messages: [
            {
                id: "m-201",
                sender: "them",
                text: "Bonjour, j'ai reçu l'avis de relance pour la 2ème tranche de scolarité. Est-il possible de passer régler au bureau demain matin ?",
                time: "Hier 14:10"
            },
            {
                id: "m-202",
                sender: "me",
                text: "Bonjour Madame Bella. La caisse de l'intendance est ouverte de 07h30 à 15h30 tous les jours ouvrables.",
                time: "Hier 14:22"
            },
            {
                id: "m-203",
                sender: "them",
                text: "Merci pour le suivi des notes de Jean et Marie.",
                time: "Hier 15:00"
            }
        ]
    },
    {
        id: "chat-3",
        name: "M. le Proviseur (Direction)",
        role: "Administration",
        avatarBg: "bg-slate-900",
        phone: "+237 222 22 00 01",
        classContext: "Lycée Général Leclerc de Yaoundé",
        lastMsg: "Ordre du jour du Conseil d'Enseignement validé.",
        time: "Hier",
        unread: 0,
        online: true,
        messages: [
            {
                id: "m-301",
                sender: "them",
                text: "Veuillez préparer l'état récapitulatif des effectifs et des bulletins pour le Conseil de fin de trimestre.",
                time: "Hier 10:15",
                attachment: {
                    name: "Circulaire_MINESEC_Conseil_T1.pdf",
                    size: "420 KB"
                }
            },
            {
                id: "m-302",
                sender: "me",
                text: "Bien reçu Monsieur le Proviseur, les statistiques des 28 classes sont prêtes et consolidées.",
                time: "Hier 11:30"
            },
            {
                id: "m-303",
                sender: "them",
                text: "Ordre du jour du Conseil d'Enseignement validé.",
                time: "Hier 16:45"
            }
        ]
    },
    {
        id: "chat-4",
        name: "Diffusion : Parents de 6ème",
        role: "Diffusion",
        avatarBg: "bg-emerald-600",
        classContext: "Canal Général • 120 Destinataires",
        lastMsg: "Rappel : Réunion APEE ce samedi à 09h00 dans la grande salle.",
        time: "Lundi",
        unread: 0,
        online: true,
        messages: [
            {
                id: "m-401",
                sender: "me",
                text: "Chers parents d'élèves de 6ème, les bulletins du premier trimestre seront remis en main propre ce samedi dès 08h30.",
                time: "Lundi 09:00"
            },
            {
                id: "m-402",
                sender: "me",
                text: "Rappel : Réunion APEE ce samedi à 09h00 dans la grande salle.",
                time: "Lundi 14:15"
            }
        ]
    }
];

export default function MessagingPage() {
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [selectedChatId, setSelectedChatId] = useState<string>("chat-1");
    const [activeTab, setActiveTab] = useState<"all" | "Enseignant" | "Parent" | "Diffusion">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [newMessageText, setNewMessageText] = useState("");
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    // New conversation modal
    const [newChatModalOpen, setNewChatModalOpen] = useState(false);
    const [newChatRecipientType, setNewChatRecipientType] = useState<"Enseignant" | "Parent" | "Diffusion">("Enseignant");
    const [newChatName, setNewChatName] = useState("");
    const [newChatClass, setNewChatClass] = useState("6ème A");
    const [newChatInitialMessage, setNewChatInitialMessage] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load from localStorage or defaults
    useEffect(() => {
        try {
            const saved = localStorage.getItem("eschool_conversations_v1");
            if (saved) {
                setConversations(JSON.parse(saved));
            } else {
                setConversations(defaultConversations);
            }
        } catch {
            setConversations(defaultConversations);
        }
    }, []);

    // Save to localStorage
    const saveConversations = (updated: ChatConversation[]) => {
        setConversations(updated);
        try {
            localStorage.setItem("eschool_conversations_v1", JSON.stringify(updated));
        } catch (e) {
            console.warn("Could not save conversations to localStorage:", e);
        }
    };

    // Auto scroll chat to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedChatId, conversations]);

    const activeConversation = conversations.find(c => c.id === selectedChatId) || conversations[0];

    const filteredConversations = conversations.filter(c => {
        const matchesTab = activeTab === "all" || c.role === activeTab;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.classContext && c.classContext.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    // Send Message
    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = newMessageText.trim();
        if (!trimmed || !activeConversation) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const newMsg: MessageItem = {
            id: `msg-${Date.now()}`,
            sender: "me",
            text: trimmed,
            time: timeStr
        };

        const updated = conversations.map(c => {
            if (c.id === activeConversation.id) {
                return {
                    ...c,
                    lastMsg: trimmed,
                    time: timeStr,
                    messages: [...c.messages, newMsg]
                };
            }
            return c;
        });

        saveConversations(updated);
        setNewMessageText("");

        // If it's a teacher or parent, simulate a realistic auto-response after 1.5s
        if (activeConversation.role === "Enseignant" || activeConversation.role === "Parent") {
            setTimeout(() => {
                const autoResponses: Record<string, string> = {
                    "Enseignant": "Bien reçu. Je prends note et je m'assure que les démarches soient effectuées aujourd'hui.",
                    "Parent": "Merci beaucoup pour votre réactivité et ces précisions. Bonne journée !",
                };
                const replyText = autoResponses[activeConversation.role] || "Message bien reçu par l'administration.";
                const replyTime = new Date();
                const replyTimeStr = `${replyTime.getHours().toString().padStart(2, '0')}:${replyTime.getMinutes().toString().padStart(2, '0')}`;

                const autoMsg: MessageItem = {
                    id: `msg-reply-${Date.now()}`,
                    sender: "them",
                    text: replyText,
                    time: replyTimeStr
                };

                setConversations(prev => {
                    const withReply = prev.map(conv => {
                        if (conv.id === activeConversation.id) {
                            return {
                                ...conv,
                                lastMsg: replyText,
                                time: replyTimeStr,
                                messages: [...conv.messages, autoMsg]
                            };
                        }
                        return conv;
                    });
                    try {
                        localStorage.setItem("eschool_conversations_v1", JSON.stringify(withReply));
                    } catch {}
                    return withReply;
                });
            }, 1400);
        }
    };

    // Create New Conversation or Broadcast
    const handleCreateNewChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChatName.trim()) return;

        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const newId = `chat-${Date.now()}`;

        const initialMessages: MessageItem[] = [];
        if (newChatInitialMessage.trim()) {
            initialMessages.push({
                id: `m-init-${Date.now()}`,
                sender: "me",
                text: newChatInitialMessage.trim(),
                time: timeStr
            });
        }

        const newConv: ChatConversation = {
            id: newId,
            name: newChatName.trim(),
            role: newChatRecipientType,
            avatarBg: newChatRecipientType === "Enseignant" ? "bg-blue-600" : newChatRecipientType === "Parent" ? "bg-amber-600" : "bg-emerald-600",
            classContext: newChatRecipientType === "Diffusion" ? `Canal ${newChatClass}` : `Classe : ${newChatClass}`,
            lastMsg: newChatInitialMessage.trim() || "Nouvelle conversation démarrée",
            time: timeStr,
            unread: 0,
            online: true,
            messages: initialMessages
        };

        const updated = [newConv, ...conversations];
        saveConversations(updated);
        setSelectedChatId(newId);
        setNewChatModalOpen(false);
        setNewChatName("");
        setNewChatInitialMessage("");
        setIsMobileChatOpen(true);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-4 overflow-hidden animate-in fade-in duration-300">
            {/* Sidebar Conversation List */}
            <Card className={cn(
                "w-full md:w-96 flex flex-col overflow-hidden border-slate-200 shadow-sm shrink-0 bg-white",
                isMobileChatOpen ? "hidden md:flex" : "flex"
            )}>
                {/* Header & Search */}
                <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Messagerie</h2>
                            <p className="text-[11px] text-slate-500 font-medium">Lycée Leclerc • Communication Interne</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setNewChatModalOpen(true)}
                            className="bg-primary-blue hover:bg-blue-700 text-white font-bold text-xs h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                            <Plus size={14} /> Nouveau
                        </Button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
                        <Input
                            placeholder="Rechercher conversation ou élève..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 text-xs bg-white border-slate-200 focus:ring-primary-blue"
                        />
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {(["all", "Enseignant", "Parent", "Diffusion"] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap transition-all",
                                    activeTab === tab
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                {tab === "all" ? "Tous" : tab === "Enseignant" ? "Profs" : tab === "Parent" ? "Parents" : "Diffusions"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List items */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {filteredConversations.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs italic">
                            Aucune conversation trouvée.
                        </div>
                    ) : (
                        filteredConversations.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    setSelectedChatId(chat.id);
                                    setIsMobileChatOpen(true);
                                }}
                                className={cn(
                                    "w-full p-3.5 flex gap-3 text-left transition-all hover:bg-slate-50 relative",
                                    selectedChatId === chat.id ? "bg-blue-50/70 border-r-4 border-primary-blue" : ""
                                )}
                            >
                                <div className="relative shrink-0">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm",
                                        chat.avatarBg
                                    )}>
                                        {chat.role === "Diffusion" ? <Megaphone size={18} /> : chat.name.charAt(0)}
                                    </div>
                                    {chat.online && (
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <span className="font-bold text-slate-900 text-xs truncate max-w-[170px]">{chat.name}</span>
                                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{chat.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate font-normal">{chat.lastMsg}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                            chat.role === "Enseignant" ? "bg-blue-100 text-blue-700" :
                                                chat.role === "Parent" ? "bg-amber-100 text-amber-700" :
                                                    chat.role === "Diffusion" ? "bg-emerald-100 text-emerald-700" :
                                                        "bg-purple-100 text-purple-700"
                                        )}>
                                            {chat.role}
                                        </span>
                                        {chat.classContext && (
                                            <span className="text-[10px] text-slate-400 truncate font-medium">
                                                {chat.classContext}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0 self-center">
                                        {chat.unread}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </Card>

            {/* Chat Thread Panel */}
            <Card className={cn(
                "flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm bg-white",
                !isMobileChatOpen ? "hidden md:flex" : "flex"
            )}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-8 w-8 text-slate-500"
                                    onClick={() => setIsMobileChatOpen(false)}
                                >
                                    <ArrowLeft size={18} />
                                </Button>
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0",
                                    activeConversation.avatarBg
                                )}>
                                    {activeConversation.role === "Diffusion" ? <Megaphone size={18} /> : activeConversation.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 text-sm">{activeConversation.name}</h3>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded",
                                            activeConversation.role === "Enseignant" ? "bg-blue-100 text-blue-700" :
                                                activeConversation.role === "Parent" ? "bg-amber-100 text-amber-700" :
                                                    "bg-emerald-100 text-emerald-700"
                                        )}>
                                            {activeConversation.role}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500">
                                        {activeConversation.classContext} • {activeConversation.online ? (
                                            <span className="text-emerald-600 font-bold">En ligne</span>
                                        ) : "Hors ligne"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {activeConversation.phone && (
                                    <a
                                        href={`tel:${activeConversation.phone}`}
                                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary-blue hover:bg-slate-100 transition-colors"
                                        title={`Appeler ${activeConversation.phone}`}
                                    >
                                        <Phone size={16} />
                                    </a>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-primary-blue"
                                    onClick={() => alert(`Informations : ${activeConversation.name}\n${activeConversation.classContext || ''}\nContact : ${activeConversation.phone || 'Non renseigné'}`)}
                                >
                                    <Info size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/40">
                            <div className="flex justify-center my-2">
                                <span className="text-[10px] font-bold bg-slate-200/80 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Échanges officiels eSchool • Lycée Général Leclerc
                                </span>
                            </div>

                            {activeConversation.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex flex-col max-w-[85%] sm:max-w-[70%]",
                                        msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm",
                                        msg.sender === "me"
                                            ? "bg-primary-blue text-white rounded-br-none"
                                            : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                                    )}>
                                        <p>{msg.text}</p>
                                        {msg.attachment && (
                                            <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2">
                                                <FileText size={16} />
                                                <div className="text-[10px]">
                                                    <p className="font-bold underline">{msg.attachment.name}</p>
                                                    <span className="opacity-80">{msg.attachment.size}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                        <span>{msg.time}</span>
                                        {msg.sender === "me" && (
                                            <CheckCheck size={12} className="text-primary-blue" />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 sm:p-4 border-t border-slate-100 bg-white">
                            <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setNewMessageText(prev => prev ? `${prev} [Pièce jointe : Circulaire.pdf]` : "[Pièce jointe : Circulaire.pdf]");
                                    }}
                                    className="text-slate-400 hover:text-slate-600 h-10 w-10 shrink-0"
                                    title="Joindre un fichier / document"
                                >
                                    <Paperclip size={18} />
                                </Button>
                                <Input
                                    placeholder={`Répondre à ${activeConversation.name}...`}
                                    value={newMessageText}
                                    onChange={(e) => setNewMessageText(e.target.value)}
                                    className="flex-1 h-10 border-slate-200 bg-slate-50 focus:bg-white text-xs sm:text-sm"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessageText.trim()}
                                    className="h-10 px-4 bg-primary-blue hover:bg-blue-700 text-white font-bold shrink-0 rounded-xl shadow-md shadow-blue-200 flex items-center gap-1.5"
                                >
                                    <span className="hidden sm:inline text-xs">Envoyer</span>
                                    <Send size={15} />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <Users size={48} className="text-slate-300 mb-3" />
                        <p className="font-bold text-slate-600">Sélectionnez une discussion</p>
                        <p className="text-xs text-slate-400">Communiquez avec les enseignants, les parents ou l'administration.</p>
                    </div>
                )}
            </Card>

            {/* ================= MODAL: NOUVELLE CONVERSATION / DIFFUSION ================= */}
            {newChatModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Megaphone size={20} className="text-primary-blue" />
                                <h3 className="font-bold text-base">Nouvelle Communication / Annonce</h3>
                            </div>
                            <button
                                onClick={() => setNewChatModalOpen(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateNewChat} className="p-6 space-y-4">
                            {/* Type selector */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                                    Type de communication
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(["Enseignant", "Parent", "Diffusion"] as const).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => {
                                                setNewChatRecipientType(type);
                                                if (type === "Diffusion") {
                                                    setNewChatName("Diffusion Générale Parents");
                                                }
                                            }}
                                            className={cn(
                                                "p-2.5 rounded-xl border text-xs font-bold text-center transition-all",
                                                newChatRecipientType === type
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {type === "Enseignant" ? "Enseignant" : type === "Parent" ? "Parent d'élève" : "Diffusion Classe"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recipient name */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                    {newChatRecipientType === "Diffusion" ? "Intitulé du groupe de diffusion *" : "Nom du destinataire *"}
                                </label>
                                <Input
                                    placeholder={newChatRecipientType === "Diffusion" ? "ex: Avis aux parents de 6ème B" : "ex: M. FOTSO Jean (Parent)"}
                                    value={newChatName}
                                    onChange={(e) => setNewChatName(e.target.value)}
                                    className="text-xs h-10 border-slate-200"
                                    required
                                />
                            </div>

                            {/* Class context */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                    Classe concernée
                                </label>
                                <select
                                    value={newChatClass}
                                    onChange={(e) => setNewChatClass(e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none"
                                >
                                    <option value="Toutes les classes">Toutes les classes (Établissement entier)</option>
                                    <option value="6ème A">6ème A</option>
                                    <option value="6ème B">6ème B</option>
                                    <option value="4ème All A">4ème All A</option>
                                    <option value="3ème Espagnol">3ème Espagnol</option>
                                    <option value="2nde C">2nde C</option>
                                    <option value="Terminale C">Terminale C</option>
                                    <option value="Terminale D">Terminale D</option>
                                </select>
                            </div>

                            {/* Initial message */}
                            <div>
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                                    Premier message / Contenu de la note *
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Rédigez l'information ou la consigne officielle..."
                                    value={newChatInitialMessage}
                                    onChange={(e) => setNewChatInitialMessage(e.target.value)}
                                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 font-sans"
                                    required
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setNewChatModalOpen(false)}
                                    className="text-xs border-slate-200"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary-blue hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200"
                                >
                                    Démarrer la communication
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
