import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session.user.id),
    with: {
      clinic: true,
    },
  });

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {session ? (
        <div>
          <h2>Informações do Usuário</h2>

          <p>Bem-vindo, {session?.user?.name}!</p>
          <p>Email: {session?.user?.email}</p>
          <h2>Suas Clínicas:</h2>
          <ul>
            {clinics.map((userClinic) => (
              <li key={userClinic.clinic.id}>
                {userClinic.clinic.name} (ID: {userClinic.clinic.id})
              </li>
            ))}
          </ul>
          <SignOutButton />
        </div>
      ) : (
        <p>Você não está autenticado.</p>
      )}
    </div>
  );
};

export default DashboardPage;
