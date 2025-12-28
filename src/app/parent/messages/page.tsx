"use client";

import { useState } from "react";
import {
    Search,
    Send,
    User,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Info,
    ChevronLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function MessagingPage() {
    const [selectedChat, setSelectedChat] = useState("1");

    const chats = [
        { id: "1", name: "M. DUPONT", lastMsg: "SVP validez les notes de 6ème A", time: "08:30", unread: 2, role: "Enseignant" },
        { id: "2", name: "Mme. BELLA", lastMsg: "Merci pour le rapport de Jean", time: "Hier", unread: 0, role: "Parent" },
        { id: "3", name: "Proviseur", lastMsg: "Réunion générale demain 10h", time: "Hier", unread: 0, role: "Admin" },
    ];

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 overflow-hidden">
            {/* Sidebar List */}
            <Card className="w-full md:w-80 flex flex-col overflow-hidden border-slate-200">
                <div className="p-4 border-b border-slate-100 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input placeholder="Rechercher..." className="pl-9 h-9 text-sm" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                    {chats.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={cn(
                                "w-full p-4 flex gap-3 text-left transition-colors hover:bg-slate-50",
                                selectedChat === chat.id ? "bg-blue-50/50 border-r-4 border-primary-blue" : ""
                            )}
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="font-bold text-slate-900 text-sm truncate">{chat.name}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
                                <span className="text-[9px] font-bold text-primary-blue/60 uppercase">{chat.role}</span>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                                    {chat.unread}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Chat Window */}
            <Card className="flex-1 hidden md:flex flex-col overflow-hidden border-slate-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center font-bold">
                            {chats.find(c => c.id === selectedChat)?.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{chats.find(c => c.id === selectedChat)?.name}</h3>
                            <p className="text-[10px] text-success-green font-bold uppercase tracking-widest">En Ligne</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-slate-400"><Phone size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400"><Video size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-slate-400"><Info size={18} /></Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                    <div className="flex justify-center my-4">
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">Aujourd'hui</span>
                    </div>
                    <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 self-end" />
                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 text-sm text-slate-700">
                            Bonjour, avez-vous pu vérifier les notes de la classe 6ème A pour le premier trimestre ?
                        </div>
                    </div>
                    <div className="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
                        <div className="bg-primary-blue p-3 rounded-2xl rounded-br-none shadow-md text-sm text-white font-medium">
                            Oui, tout est rentré ! Je viens de valider le cahier de texte également.
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 text-right mr-11">Vu à 08:32</p>
                </div>

                <div className="p-4 border-t border-slate-100 bg-white">
                    <form className="flex gap-3 items-center">
                        <Button variant="ghost" size="icon" className="text-slate-400"><Paperclip size={20} /></Button>
                        <Input placeholder="Votre message..." className="flex-1 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all shadow-none" />
                        <Button size="icon" className="h-11 w-11 bg-primary-blue shadow-lg shadow-blue-200">
                            <Send size={20} />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}

