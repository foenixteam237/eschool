"use client";

import React from "react";
import { Crown } from "lucide-react";

export function SuperAdminBadge() {
  return (
    <div className="flex items-center gap-2 bg-[var(--color-superadmin-accent)] text-white px-3 py-1 rounded-md shadow-md">
      <Crown size={14} />
      <span className="text-xs font-semibold">SUPERADMIN</span>
    </div>
  );
}

export default SuperAdminBadge;
