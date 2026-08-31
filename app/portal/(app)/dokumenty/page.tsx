import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/portal/PageHeader";
import { getCurrentUser } from "@/lib/auth";
import { getDocuments } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Dokumenty",
  robots: { index: false, follow: false },
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  return `${(bytes / 1024).toFixed(0)} kB`;
}

export default async function PortalDokumentyPage() {
  const user = (await getCurrentUser())!;
  const docs = await getDocuments(user.id);

  return (
    <>
      <PageHeader
        title="Dokumenty"
        lead="Vaša zmluva, prílohy a platné obchodné podmienky."
      />

      <ul className="divide-y divide-ink-200 rounded-card border border-ink-200 bg-white">
        {docs.map((doc) => (
          <li key={doc.id} className="flex items-center gap-5 px-6 py-5">
            <FileText size={22} className="shrink-0 text-ink-400" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium text-ink-950">{doc.title}</p>
              <p className="text-sm text-ink-500">
                {new Intl.DateTimeFormat("sk-SK").format(doc.createdAt)}
                {doc.sizeBytes ? ` · ${formatSize(doc.sizeBytes)}` : ""}
              </p>
            </div>
            <span className="text-sm text-ink-400">Pripravuje sa</span>
          </li>
        ))}
        {docs.length === 0 && (
          <li className="px-6 py-10 text-center text-ink-600">
            Zatiaľ tu nemáte žiadne dokumenty.
          </li>
        )}
      </ul>
    </>
  );
}
