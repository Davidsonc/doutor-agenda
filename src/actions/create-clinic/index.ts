"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, message: "Usuário não autenticado." };
  }

  const [clinic] = await db
    .insert(clinicsTable)
    .values({
      name: name.trim(),
    })
    .returning();

  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });

  return { success: true, message: "Clínica criada com sucesso!" };
};
