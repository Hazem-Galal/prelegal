"use client";

import type { Ref } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Props = {
  coverPageMarkdown: string;
  standardTermsMarkdown: string;
  ref?: Ref<HTMLDivElement>;
};

export default function NdaPreview({
  coverPageMarkdown,
  standardTermsMarkdown,
  ref,
}: Props) {
  return (
    <div
      ref={ref}
      className="prose prose-sm sm:prose-base mx-auto max-w-3xl bg-white px-8 py-10 text-zinc-900 shadow-sm"
    >
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {coverPageMarkdown}
      </Markdown>
      <hr className="my-8" />
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {standardTermsMarkdown}
      </Markdown>
    </div>
  );
}
