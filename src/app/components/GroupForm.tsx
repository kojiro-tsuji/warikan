"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRepository } from "@/hooks/useRepository";

export function GroupForm() {
  const router = useRouter();
  const repository = useRepository();
  const [groupName, setGroupName] = useState("");
  const [memberNames, setMemberNames] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateMemberName(index: number, value: string) {
    setMemberNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  }

  function addMemberField() {
    setMemberNames((prev) => [...prev, ""]);
  }

  function removeMemberField(index: number) {
    setMemberNames((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmedGroupName = groupName.trim();
    const trimmedMemberNames = memberNames.map((name) => name.trim()).filter(Boolean);

    if (!trimmedGroupName) {
      setError("グループ名を入力してください");
      return;
    }

    if (trimmedMemberNames.length < 2) {
      setError("メンバーは2人以上入力してください");
      return;
    }

    setIsSubmitting(true);
    const group = await repository.createGroup(trimmedGroupName, trimmedMemberNames);
    router.push(`/groups/${group.id}`);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="field">
        <span>グループ名</span>
        <input
          className="input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="例: 沖縄旅行"
        />
      </label>

      <div className="field">
        <span>メンバー</span>
        {memberNames.map((name, index) => (
          <div key={index} className="rowBetween">
            <input
              className="input"
              value={name}
              onChange={(e) => updateMemberName(index, e.target.value)}
              placeholder={`メンバー${index + 1}`}
              style={{ flex: 1 }}
            />
            {memberNames.length > 2 && (
              <button
                type="button"
                className="buttonGhost"
                onClick={() => removeMemberField(index)}
              >
                削除
              </button>
            )}
          </div>
        ))}
        <button type="button" className="buttonGhost" onClick={addMemberField}>
          + メンバーを追加
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="button" disabled={isSubmitting}>
        グループを作成
      </button>
    </form>
  );
}
