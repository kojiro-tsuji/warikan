"use client";

import { useState, type FormEvent } from "react";
import { Member } from "@/domain/types";

export function ExpenseForm({
  members,
  onSubmit,
}: {
  members: Member[];
  onSubmit: (input: {
    payerId: string;
    amount: number;
    description: string;
    participantIds: string[];
  }) => Promise<void>;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState(members[0]?.id ?? "");
  const [participantIds, setParticipantIds] = useState<string[]>(members.map((m) => m.id));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleParticipant(memberId: string) {
    setParticipantIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const amountNumber = Number(amount);

    if (!description.trim()) {
      setError("内容を入力してください");
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      setError("金額は1円以上の数値で入力してください");
      return;
    }

    if (participantIds.length === 0) {
      setError("割る対象者を1人以上選んでください");
      return;
    }

    setIsSubmitting(true);
    await onSubmit({
      description: description.trim(),
      amount: amountNumber,
      payerId,
      participantIds,
    });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="field">
        <span>内容</span>
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: ホテル代"
        />
      </label>

      <label className="field">
        <span>金額</span>
        <input
          className="input"
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="例: 12000"
        />
      </label>

      <label className="field">
        <span>立て替えた人</span>
        <select
          className="input"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
        >
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>割る対象者</span>
        {members.map((member) => (
          <label key={member.id} className="checkboxRow">
            <input
              type="checkbox"
              checked={participantIds.includes(member.id)}
              onChange={() => toggleParticipant(member.id)}
            />
            {member.name}
          </label>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="button" disabled={isSubmitting}>
        追加する
      </button>
    </form>
  );
}
