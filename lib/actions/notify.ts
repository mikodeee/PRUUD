import "server-only";

/*
 * Odoslanie notifikácie na interný e-mail.
 *
 * Kým nie je nastavený RESEND_API_KEY, správa sa len zaloguje —
 * vývoj a náhľad tak fungujú bez externých kľúčov. Po doplnení kľúča
 * do .env.local sa začne reálne odosielať bez zmeny volajúceho kódu.
 */

type Notification = {
  subject: string;
  lines: Array<[string, string]>;
};

export async function notifyTeam({ subject, lines }: Notification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM ?? "PRUUD <noreply@pruud.sk>";

  const body = lines.map(([k, v]) => `${k}: ${v}`).join("\n");

  if (!apiKey || !to) {
    console.info(`[notifikácia — neodoslaná, chýba RESEND_API_KEY/NOTIFY_EMAIL]
${subject}
${body}`);
    return { delivered: false as const };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text: body }),
  });

  if (!response.ok) {
    console.error("Resend zlyhal:", response.status, await response.text());
    return { delivered: false as const };
  }

  return { delivered: true as const };
}
