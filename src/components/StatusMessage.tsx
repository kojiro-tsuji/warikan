import Link from "next/link";

export function StatusMessage({
  message,
  showHomeLink = false,
}: {
  message: string;
  showHomeLink?: boolean;
}) {
  return (
    <div className="container">
      <div className="card emptyState">
        <p className={showHomeLink ? undefined : "muted"}>{message}</p>
        {showHomeLink && (
          <Link href="/" className="backLink" style={{ alignSelf: "center" }}>
            トップに戻って新しいグループを作る
          </Link>
        )}
      </div>
    </div>
  );
}
