"use client";

import { FormEvent, useState } from "react";

const leadStorageKey = "ai-name-analysis:lead-whatsapp";

export function LeadCapture() {
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;

    window.localStorage.setItem(leadStorageKey, trimmed);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-[22px] border border-white/12 bg-white/10 p-4">
      <label className="block">
        <span className="block text-sm font-semibold text-white">如果你希望老师稍后联系你，可以留下 WhatsApp。</span>
        <input
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setSaved(false);
          }}
          placeholder="例如：60123456789"
          inputMode="tel"
          className="mt-3 h-12 w-full rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none placeholder:text-warmGray/55 focus:border-moss focus:ring-4 focus:ring-moss/10"
        />
      </label>
      <button
        type="submit"
        className="mt-3 h-12 w-full rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        保存我的 WhatsApp
      </button>
      {saved ? <p className="mt-3 text-xs leading-5 text-warmGray">已先保存在本机浏览器，之后接数据库时可改为自动同步给老师。</p> : null}
    </form>
  );
}
