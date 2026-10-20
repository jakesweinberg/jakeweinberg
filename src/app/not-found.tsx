import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ paddingTop: 120 }}>
      <h1 className="title">Not found</h1>
      <p><Link href="/" className="mono">← Home</Link></p>
    </div>
  );
}
