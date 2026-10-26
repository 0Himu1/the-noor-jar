export function JarMark({ large = false }: { large?: boolean }) {
  return <svg className={large ? 'jar-mark jar-mark-large' : 'jar-mark'} viewBox="0 0 200 240" fill="none" aria-hidden="true">
    <path d="M66 54H134M70 44H130M72 60V78C72 86 47 94 47 116V189C47 207 61 218 79 218H121C139 218 153 207 153 189V116C153 94 128 86 128 78V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M59 139C83 130 116 153 141 140V187C141 199 133 206 121 206H79C67 206 59 199 59 187Z" fill="currentColor" opacity="0.1" />
    <g className="jar-light"><path d="M100 103V117M100 153V167M68 135H82M118 135H132M78 113L87 122M113 148L122 157M78 157L87 148M113 122L122 113" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="100" cy="135" r="9" fill="currentColor" opacity="0.75" /></g>
    <path d="M61 185V118C61 112 64 109 69 106" stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
  </svg>;
}
