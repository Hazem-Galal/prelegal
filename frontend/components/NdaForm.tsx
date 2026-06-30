"use client";

import type { MndaFormValues } from "@/lib/mnda";

type Props = {
  values: MndaFormValues;
  onUpdate: <K extends keyof MndaFormValues>(
    field: K,
    value: MndaFormValues[K]
  ) => void;
};

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
      />
    </label>
  );
}

function PartyFields({
  title,
  name,
  company,
  partyTitle,
  noticeAddress,
  onChange,
}: {
  title: string;
  name: string;
  company: string;
  partyTitle: string;
  noticeAddress: string;
  onChange: (field: "Name" | "Company" | "Title" | "NoticeAddress", value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4">
      <legend className="px-1 text-sm font-semibold text-zinc-900">{title}</legend>
      <TextField label="Name" value={name} onChange={(v) => onChange("Name", v)} />
      <TextField label="Company" value={company} onChange={(v) => onChange("Company", v)} />
      <TextField label="Title" value={partyTitle} onChange={(v) => onChange("Title", v)} />
      <TextField
        label="Notice address"
        value={noticeAddress}
        onChange={(v) => onChange("NoticeAddress", v)}
        placeholder="Email or postal address"
      />
    </fieldset>
  );
}

export default function NdaForm({ values, onUpdate }: Props) {
  return (
    <form className="flex flex-col gap-6" onSubmit={(event) => event.preventDefault()}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PartyFields
          title="Party 1"
          name={values.party1Name}
          company={values.party1Company}
          partyTitle={values.party1Title}
          noticeAddress={values.party1NoticeAddress}
          onChange={(field, value) => onUpdate(`party1${field}` as keyof MndaFormValues, value)}
        />
        <PartyFields
          title="Party 2"
          name={values.party2Name}
          company={values.party2Company}
          partyTitle={values.party2Title}
          noticeAddress={values.party2NoticeAddress}
          onChange={(field, value) => onUpdate(`party2${field}` as keyof MndaFormValues, value)}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Purpose</span>
        <textarea
          value={values.purpose}
          onChange={(event) => onUpdate("purpose", event.target.value)}
          rows={3}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </label>

      <TextField
        label="Effective date"
        type="date"
        value={values.effectiveDate}
        onChange={(v) => onUpdate("effectiveDate", v)}
      />

      <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4">
        <legend className="px-1 text-sm font-semibold text-zinc-900">MNDA term</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTermType"
            checked={values.mndaTermType === "expires"}
            onChange={() => onUpdate("mndaTermType", "expires")}
          />
          Expires
          <input
            type="number"
            min={1}
            value={values.mndaTermYears}
            disabled={values.mndaTermType !== "expires"}
            onChange={(event) => onUpdate("mndaTermYears", Number(event.target.value))}
            className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-sm disabled:bg-zinc-100"
          />
          year(s) from Effective Date
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mndaTermType"
            checked={values.mndaTermType === "continues"}
            onChange={() => onUpdate("mndaTermType", "continues")}
          />
          Continues until terminated in accordance with the terms of the MNDA
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4">
        <legend className="px-1 text-sm font-semibold text-zinc-900">Term of confidentiality</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confidentialityTermType"
            checked={values.confidentialityTermType === "duration"}
            onChange={() => onUpdate("confidentialityTermType", "duration")}
          />
          <input
            type="number"
            min={1}
            value={values.confidentialityTermYears}
            disabled={values.confidentialityTermType !== "duration"}
            onChange={(event) =>
              onUpdate("confidentialityTermYears", Number(event.target.value))
            }
            className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-sm disabled:bg-zinc-100"
          />
          year(s) from Effective Date (trade secrets survive until no longer a trade secret)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="confidentialityTermType"
            checked={values.confidentialityTermType === "perpetuity"}
            onChange={() => onUpdate("confidentialityTermType", "perpetuity")}
          />
          In perpetuity
        </label>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          label="Governing law (state)"
          value={values.governingLaw}
          onChange={(v) => onUpdate("governingLaw", v)}
          placeholder="e.g. Delaware"
        />
        <TextField
          label="Jurisdiction (city/county & state)"
          value={values.jurisdiction}
          onChange={(v) => onUpdate("jurisdiction", v)}
          placeholder="e.g. New Castle, DE"
        />
      </div>
    </form>
  );
}
