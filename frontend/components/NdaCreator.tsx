"use client";

import { useMemo, useRef, useState } from "react";
import NdaForm from "@/components/NdaForm";
import NdaPreview from "@/components/NdaPreview";
import { defaultMndaFormValues, fillMndaDocument, type MndaFormValues } from "@/lib/mnda";
import { exportElementToPdf } from "@/lib/pdf";

type Props = {
  coverPageTemplate: string;
  standardTermsTemplate: string;
};

export default function NdaCreator({ coverPageTemplate, standardTermsTemplate }: Props) {
  const [values, setValues] = useState<MndaFormValues>(defaultMndaFormValues);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleUpdate = <K extends keyof MndaFormValues>(field: K, value: MndaFormValues[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const { coverPage, standardTerms } = useMemo(
    () => fillMndaDocument(coverPageTemplate, standardTermsTemplate, values),
    [coverPageTemplate, standardTermsTemplate, values]
  );

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    try {
      await exportElementToPdf(previewRef.current, "mutual-nda.pdf");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Mutual NDA Creator</h1>
        <p className="max-w-2xl text-sm text-zinc-600">
          Fill in the form to generate a Common Paper Mutual Non-Disclosure Agreement.
          The preview on the right updates as you type, and you can download the
          completed document as a PDF.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <NdaForm values={values} onUpdate={handleUpdate} />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900">Preview</h2>
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isDownloading ? "Generating PDF…" : "Download PDF"}
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <NdaPreview
              ref={previewRef}
              coverPageMarkdown={coverPage}
              standardTermsMarkdown={standardTerms}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
