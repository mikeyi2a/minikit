import type { PropDoc } from "@/docs/component-docs";

export function PropsTable({ props }: { props: PropDoc[] }) {
  if (props.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--mk-border)" }}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--mk-border)" }}>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                className="px-3 py-2 font-mono text-[9px] uppercase tracking-wider font-medium"
                style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} style={{ borderBottom: "1px solid var(--mk-border)" }}>
              <td
                className="px-3 py-2 font-mono whitespace-nowrap"
                style={{ color: "var(--mk-text)", fontFamily: "var(--mk-font-mono)" }}
              >
                {prop.name}
              </td>
              <td
                className="px-3 py-2 font-mono"
                style={{ color: "var(--mk-text-muted)", fontFamily: "var(--mk-font-mono)" }}
              >
                {prop.type}
              </td>
              <td
                className="px-3 py-2 font-mono"
                style={{ color: "var(--mk-text-faint)", fontFamily: "var(--mk-font-mono)" }}
              >
                {prop.default ?? "—"}
              </td>
              <td className="px-3 py-2" style={{ color: "var(--mk-text-muted)" }}>
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
