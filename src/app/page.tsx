import { GroupForm } from "@/components/GroupForm";

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1 className="logo">WARIKAN</h1>
        <p className="muted">グループを作って、立て替えの精算を自動計算しよう</p>
      </div>
      <GroupForm />
    </div>
  );
}
