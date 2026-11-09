import { NextRequest, NextResponse } from "next/server";
import { getBackendApiUrl } from "@/lib/api-config";

async function getBackendToken(): Promise<string> {
  const backendBase = getBackendApiUrl();
  const res = await fetch(`${backendBase}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@eschool.com",
      password: "admin123",
    }),
  });
  if (!res.ok) throw new Error("Authentication failed");
  const data = await res.json();
  return data?.data?.token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name && !body.nom) {
      return NextResponse.json({ success: false, message: "Nom de l'établissement requis" }, { status: 400 });
    }

    const schoolName = body.name || body.nom;
    const ville = body.ville || "Yaoundé";
    const region = body.region || "Centre";
    const code = body.code || `${schoolName.split(" ").map((w: string) => w[0]?.toUpperCase() || "").join("").slice(0, 4)}-${ville.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const token = await getBackendToken();

    const backendPayload = {
      name: schoolName,
      code: code,
      address: body.address || `${ville}, Cameroun`,
      phone: body.phone || body.adminTelephone || "+237 222 00 00 00",
      email: body.email || body.adminEmail || `contact.${code.toLowerCase()}@eschool.cm`,
      ville: ville,
      region: region,
      slogan: body.slogan || "Discipline - Travail - Succès",
    };

    const backendBase = getBackendApiUrl();
    const response = await fetch(`${backendBase}/schools`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.message || "Erreur de création sur le backend" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: `Établissement ${schoolName} déployé avec succès sur la base PostgreSQL`,
    });
  } catch (error: any) {
    console.error("[SuperAdmin Create School API] Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
