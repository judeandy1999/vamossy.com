import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <div className="site-wrap">
        <p className="kicker">404</p>
        <h1>Page not found</h1>
        <p className="lede">
          That URL is not part of the published research site.
        </p>
        <p>
          <Link href="/">Home</Link>
          {" · "}
          <Link href="/research">Research</Link>
          {" · "}
          <Link href="/search">Search</Link>
        </p>
      </div>
    </div>
  );
}
