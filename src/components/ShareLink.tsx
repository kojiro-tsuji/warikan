"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function ShareLink() {
  // サーバー側では URL がわからないので、ブラウザで表示されてから読み取る
  const url = useSyncExternalStore(
    subscribe,
    () => window.location.href,
    () => ""
  );
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <div className="field">
      <span className="fieldLabel">このURLを共有すると、みんなで見られます</span>
      <input
        className="input shareUrl"
        value={url}
        readOnly
        aria-label="グループのURL"
        onFocus={(e) => e.currentTarget.select()}
      />
      <button type="button" className="button buttonSecondary" onClick={handleCopy} disabled={!url}>
        リンクをコピー
      </button>
      {status !== "idle" && (
        <p className={status === "failed" ? "error" : "toast"} role="status">
          {status === "copied"
            ? "コピーしました"
            : "コピーできませんでした。URLを長押ししてコピーしてください"}
        </p>
      )}
    </div>
  );
}
