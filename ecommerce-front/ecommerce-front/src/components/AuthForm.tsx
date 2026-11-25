"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/types";

type Field = { name: string; label: string; type: string; autoComplete?: string };

export default function AuthForm({
  title,
  action,
  fields,
  submitLabel,
  pendingLabel,
  from,
  footer,
}: {
  title: string;
  action: (s: FormState, f: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  pendingLabel: string;
  from?: string;
  footer: { text: string; href: string; link: string };
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mx-auto mt-12 flex max-w-sm flex-col gap-4 px-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {from && <input type="hidden" name="from" value={from} />}

      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1 block text-sm font-medium">{f.label}</label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            required
            className="w-full rounded border border-line p-2"
          />
          {state.fieldErrors?.[f.name]?.map((m) => (
            <p key={m} className="mt-1 text-sm text-danger">{m}</p>
          ))}
        </div>
      ))}

      {state.error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-danger">{state.error}</p>}

      <button
        disabled={pending}
        className="rounded bg-brand p-3 font-medium text-white hover:bg-brand-dark disabled:opacity-50"
      >
        {pending ? pendingLabel : submitLabel}
      </button>

      <p className="text-sm text-muted">
        {footer.text}{" "}
        <Link href={footer.href} className="text-brand underline">{footer.link}</Link>
      </p>
    </form>
  );
}
