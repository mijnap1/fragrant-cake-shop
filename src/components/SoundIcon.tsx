/** A chubby little speaker with a face: it smiles and puffs out hearts when sound is on, and dozes when muted. Uses currentColor. */
export function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg className="sound-icon" viewBox="0 0 30 24" width="28" height="22" aria-hidden>
      <path
        d="M2.4 9.4 Q2.4 7.6 4.2 7.6 L6.4 7.6 L12 3.2 Q16 0.8 16 5 L16 19 Q16 23.2 12 20.8 L6.4 16.4 L4.2 16.4 Q2.4 16.4 2.4 14.6 Z"
        fill="currentColor"
      />
      {muted ? (
        <g fill="none" stroke="#fff" strokeWidth={0.9} strokeLinecap="round">
          <path d="M8.8 11 Q9.6 11.8 10.4 11 M12 11 Q12.8 11.8 13.6 11 M10.4 14.2 L12 14.2" />
        </g>
      ) : (
        <g>
          <circle cx={9.6} cy={10.8} r={1} fill="#fff" />
          <circle cx={12.8} cy={10.8} r={1} fill="#fff" />
          <path d="M9.8 13.2 Q11.2 14.8 12.6 13.2" fill="none" stroke="#fff" strokeWidth={0.9} strokeLinecap="round" />
        </g>
      )}
      {muted ? (
        <path d="M20 9.4 L25 14.4 M25 9.4 L20 14.4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      ) : (
        <g className="sound-waves">
          <path d="M18.6 9 Q20.4 12 18.6 15" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          <path d="M25.6 4.2 Q24.4 2.8 23.2 4 Q22 2.8 20.8 4.2 Q20.2 5.6 23.2 8.2 Q26.2 5.6 25.6 4.2 Z" fill="#ff8fab" />
          <path d="M28.6 12.4 Q27.7 11.4 26.8 12.3 Q25.9 11.4 25 12.4 Q24.6 13.4 26.8 15.2 Q29 13.4 28.6 12.4 Z" fill="#ffb3c8" />
        </g>
      )}
    </svg>
  );
}
