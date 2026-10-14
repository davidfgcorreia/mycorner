/** Loose pen sketches on the notebook paper; decorative, with no extra reading content. */
export function NotebookDoodles({ cover = false }: { cover?: boolean }) {
  return <svg className={`notebook-doodle ${cover ? 'is-cover' : 'is-margin'}`} viewBox={cover ? '0 0 430 330' : '0 0 430 100'} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    {cover ? <>
      <g className="doodle-light">
        <path d="M65 136 163 57 259 137M70 140l94-77 90 71M83 124l-2 89 161 3-3-92M86 130l-1 78 149 5" />
        <path d="m114 211 2-50 31 2-2 50m30-75 37 2-1 35-36-1zM194 141l-1 31m-17-16 34 2" />
        <path d="m100 110 12 7m1-19 13 8m0-19 13 8m0-19 14 8m17-9 15-9m-1 21 15-9m-1 22 16-9m-1 22 13-8" />
        <path d="M45 219c38-8 61-3 89 1s60 6 92 1 55-5 89 0M27 239c20-11 31 11 52 1s30-11 51-1 31 9 50-1 29-8 48 1 32 11 53 0 32-8 52 2 30 7 53-1M48 255c18-9 29 9 47 1m30-2c22-11 31 10 49 1m31 0c18-11 32 9 52 0m28 1c19-9 31 6 51 1" />
      </g>
      <path d="M298 36c-18-2-26 15-23 29s22 24 35 13 15-34-2-40M279 41l-10-11m27-3 1-13m24 24 10-9m-1 28 15-1m-24 26 8 10m-34-7-3 13m-21-27-13 4" />
      <path d="M41 76q13-17 26 0 13-13 24-1m230 65q11-12 20 1 11-13 22-3" />
      <g transform="translate(35 285) rotate(-9)">
        <path d="m12 2 11 1-1 33-12-1zM1 10l10 1-1 18-10-1m24-14 47 2m-48 8 49 2m0-24 12 1-1 34-12-1zM85 11l10 1-1 18-10-1" />
        <path className="doodle-light" d="m29 31 27 1m-39-26-2 25m63-22-1 22" />
      </g>
      <path d="M328 311c-2-20 1-33 9-51m-6 32c-18 1-28-7-28-18 16-1 26 6 28 18m4-15c-1-13 7-23 22-23 0 13-7 22-22 23m3-19c-8-1-11-8-8-13 4-6 12-4 14 0 5-8 13-5 13 2s-7 10-19 11" />
      <path className="doodle-light" d="m171 288 13-7-5 14m4-13c22 13 42 14 63 5m-6-6 8 6-10 6" />
    </> : <>
      <path d="M18 73c18-11 29 9 48 0s31-9 51 0 31 10 52-1 30-8 51 2 32 10 52-1 30-8 51 1 30 9 51-1 26-8 40 0" />
      <path className="doodle-light" d="M32 87c18-8 28 8 45 0m22 1c18-9 30 7 46-1m34 0c16-8 31 7 47 1m34-1c17-9 30 8 47 0m26 0c18-8 27 7 44 0" />
      <path d="M184 57c-5-16 8-30 25-30s28 16 21 32m-38-38-5-9m26 8 2-10m20 19 10-7m-7 24 12-1m-78 4-11-3" />
      <path d="M53 34q10-10 19 1 11-11 21-1m239 9q10-11 19 1 10-13 21-2" />
      <path className="doodle-light" d="m135 55 24-2m97 7 31-2m-163 8 15-1" />
    </>}
  </svg>;
}
