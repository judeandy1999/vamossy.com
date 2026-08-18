import ArtifactLinks from "./ArtifactLinks";

export default function PublicationHeader({
  kicker,
  title,
  subtitle,
  author,
  affiliation,
  dateLabel,
  version,
  type,
  artifacts = [],
}) {
  return (
    <header className="pub-header">
      {kicker && <p className="kicker">{kicker}</p>}
      <h1>{title}</h1>
      {subtitle && <p className="lede">{subtitle}</p>}
      <dl className="pub-meta">
        {author && (
          <>
            <dt>Author</dt>
            <dd>{author}{affiliation ? ` — ${affiliation}` : ""}</dd>
          </>
        )}
        {dateLabel && (
          <>
            <dt>Date</dt>
            <dd>
              <time>{dateLabel}</time>
            </dd>
          </>
        )}
        {version && (
          <>
            <dt>Version</dt>
            <dd>{version}</dd>
          </>
        )}
        {type && (
          <>
            <dt>Type</dt>
            <dd>{type}</dd>
          </>
        )}
      </dl>
      {artifacts.length > 0 && <ArtifactLinks items={artifacts} />}
    </header>
  );
}
