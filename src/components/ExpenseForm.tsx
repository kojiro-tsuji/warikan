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

  const amountValue = Number(amount);
  const perPerson =
    Number.isInteger(amountValue) && amountValue > 0 && participantIds.length > 0
      ? amountValue / participantIds.length
      : null;

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

    if (!Number.isInteger(amountNumber) || amountNumber <= 0) {
      setError("金額は1円以上の整数で入力してください");
      return;
    }

    if (participantIds.length === 0) {
      setError("割る対象者を1人以上選んでください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: amountNumber,
        payerId,
        participantIds,
      });
    } catch {
      setError("支出の追加に失敗しました。もう一度お試しください");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="fieldLabel">内容</span>
        <input
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="例: ホテル代"
          maxLength={100}
        />
      </label>

      <label className="field">
        <span className="fieldLabel">金額</span>
        <div className="inputPrefix">
          <span aria-hidden="true">¥</span>
          <input
            className="input amount"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="12000"
          />
        </div>
      </label>

      <label className="field">
        <span className="fieldLabel">立て替えた人</span>
        <select
          className="input select"
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

      <fieldset className="field" style={{ border: "none" }}>
        <legend className="fieldLabel" style={{ marginBottom: 6 }}>割る対象者</legend>
        <div className="checkList">
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
        {perPerson !== null && (
          <p className="muted">
            1人あたり {Number.isInteger(perPerson) ? "" : "約"}¥
            {Math.ceil(perPerson).toLocaleString()}
          </p>
        )}
      </fieldset>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="button" disabled={isSubmitting}>
        追加する
      </button>
    </form>
  );
}
