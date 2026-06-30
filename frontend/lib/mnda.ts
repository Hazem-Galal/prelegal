export type MndaFormValues = {
  party1Name: string;
  party1Company: string;
  party1Title: string;
  party1NoticeAddress: string;
  party2Name: string;
  party2Company: string;
  party2Title: string;
  party2NoticeAddress: string;
  purpose: string;
  effectiveDate: string;
  mndaTermType: "expires" | "continues";
  mndaTermYears: number;
  confidentialityTermType: "duration" | "perpetuity";
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
};

const defaultPurpose =
  "Evaluating whether to enter into a business relationship with the other party.";

export const defaultMndaFormValues: MndaFormValues = {
  party1Name: "",
  party1Company: "",
  party1Title: "",
  party1NoticeAddress: "",
  party2Name: "",
  party2Company: "",
  party2Title: "",
  party2NoticeAddress: "",
  purpose: defaultPurpose,
  effectiveDate: "",
  mndaTermType: "expires",
  mndaTermYears: 1,
  confidentialityTermType: "duration",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
};

function formatDate(value: string): string {
  if (!value) return "[Today’s date]";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function describeMndaTerm(values: MndaFormValues): string {
  return values.mndaTermType === "expires"
    ? `${values.mndaTermYears} year(s) from Effective Date`
    : "until terminated in accordance with the terms of the MNDA";
}

function describeConfidentialityTerm(values: MndaFormValues): string {
  return values.confidentialityTermType === "duration"
    ? `${values.confidentialityTermYears} year(s) from Effective Date`
    : "in perpetuity";
}

function highlight(value: string): string {
  const safe = value && value.trim() ? value : "[Not provided]";
  return `<span class="filled-field">${safe}</span>`;
}

/** Fills the Mutual NDA cover page template with the form values, replacing each bracketed placeholder in place. */
export function fillCoverPage(template: string, values: MndaFormValues): string {
  let result = template;

  result = result.replace(
    /\[Evaluating whether to enter into a business relationship with the other party\.\]/,
    values.purpose || defaultPurpose
  );

  result = result.replace(/\[Today.s date\]/, formatDate(values.effectiveDate));

  result = result.replace(
    /- \[(?:x| )\]\s+Expires \[1 year\(s\)\] from Effective Date\.\r?\n- \[(?:x| )\]\s+Continues until terminated in accordance with the terms of the MNDA\./,
    values.mndaTermType === "expires"
      ? `- [x]     Expires [${values.mndaTermYears} year(s)] from Effective Date.\n- [ ]     Continues until terminated in accordance with the terms of the MNDA.`
      : `- [ ]     Expires [${values.mndaTermYears} year(s)] from Effective Date.\n- [x]     Continues until terminated in accordance with the terms of the MNDA.`
  );

  result = result.replace(
    /- \[(?:x| )\]\s+\[1 year\(s\)\] from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws\.\r?\n- \[(?:x| )\]\s+In perpetuity\./,
    values.confidentialityTermType === "duration"
      ? `- [x]     [${values.confidentialityTermYears} year(s)] from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.\n- [ ]     In perpetuity.`
      : `- [ ]     [${values.confidentialityTermYears} year(s)] from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.\n- [x]     In perpetuity.`
  );

  result = result.replace(/\[Fill in state\]/, values.governingLaw || "[Fill in state]");

  result = result.replace(
    /\[Fill in city or county and state[^\]]*\]/,
    values.jurisdiction || "[Fill in city or county and state]"
  );

  result = result.replace(
    /\|\| PARTY 1 \| PARTY 2 \|\r?\n\|:--- \| :----: \| :----: \|\r?\n\| Signature \| \| \|\r?\n\| Print Name \|[^\n]*\r?\n\| Title \| \| \|\r?\n\| Company \| \| \|\r?\n\| Notice Address <label>Use either email or postal address<\/label> \| \| \|\r?\n\| Date \| \| \|/,
    [
      "|| PARTY 1 | PARTY 2 |",
      "|:--- | :----: | :----: |",
      "| Signature | | |",
      `| Print Name | ${values.party1Name} | ${values.party2Name} |`,
      `| Title | ${values.party1Title} | ${values.party2Title} |`,
      `| Company | ${values.party1Company} | ${values.party2Company} |`,
      `| Notice Address <label>Use either email or postal address</label> | ${values.party1NoticeAddress} | ${values.party2NoticeAddress} |`,
      "| Date | | |",
    ].join("\n")
  );

  return result;
}

/** Fills the Mutual NDA standard terms, replacing each `coverpage_link` span with the resolved field value. */
export function fillStandardTerms(template: string, values: MndaFormValues): string {
  let result = template;

  const replacements: Record<string, string> = {
    Purpose: values.purpose || defaultPurpose,
    "Effective Date": formatDate(values.effectiveDate),
    "MNDA Term": describeMndaTerm(values),
    "Term of Confidentiality": describeConfidentialityTerm(values),
    "Governing Law": values.governingLaw || "[Fill in state]",
    Jurisdiction: values.jurisdiction || "[Fill in jurisdiction]",
  };

  for (const [key, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`<span class="coverpage_link">${key}</span>`, "g");
    result = result.replace(pattern, highlight(value));
  }

  return result;
}

export function fillMndaDocument(
  coverPageTemplate: string,
  standardTermsTemplate: string,
  values: MndaFormValues
): { coverPage: string; standardTerms: string } {
  return {
    coverPage: fillCoverPage(coverPageTemplate, values),
    standardTerms: fillStandardTerms(standardTermsTemplate, values),
  };
}
