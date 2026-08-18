export default function JsonLd({ data, id = "jsonld" }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
