import { GroupForm } from "@/components/GroupForm";

export default function Home() {
  return (
    <div className="container">
      <div>
        <h1>WARIKAN</h1>
        <p>グループを作って、立て替えの精算を自動計算しよう</p>
      </div>
      <GroupForm />
    </div>
  );
}
