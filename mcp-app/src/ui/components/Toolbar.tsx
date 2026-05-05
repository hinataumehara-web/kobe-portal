interface Props {
  subtitle: string;
  busy: boolean;
  onHome: () => void;
}

export function Toolbar({ subtitle, busy, onHome }: Props): JSX.Element {
  return (
    <header className="kp-toolbar">
      <button className="kp-toolbar__home" onClick={onHome} disabled={busy}>
        神戸大学ポータル
      </button>
      <span className="kp-toolbar__subtitle">{subtitle}</span>
      {busy && <span className="kp-toolbar__busy">読み込み中…</span>}
    </header>
  );
}
