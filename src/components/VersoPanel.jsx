import { useState } from 'react';

/**
 * Fills the verso frame; updates `src` in place (no remount) to avoid flash between spreads.
 * `errorSrc` ties failures to a specific URL so a new `src` still attempts to load.
 */
function VersoFillImage({ src, className }) {
  const [errorSrc, setErrorSrc] = useState(null);

  if (!src) {
    return null;
  }

  if (errorSrc === src) {
    return null;
  }

  return (
    <img
      className={className}
      src={src}
      alt=""
      decoding="async"
      onError={() => setErrorSrc(src)}
    />
  );
}

/**
 * Static left-leaf (verso) content and matching backs for 3D flip faces.
 */
export function VersoCoverBack({ imageSrc }) {
  return (
    <div className="verso-page verso-page--cover-back">
      <div
        className="verso-page__visual verso-page__visual--tall"
        aria-hidden="true"
      >
        <VersoFillImage src={imageSrc} className="verso-page__visual-img" />
      </div>
      <p className="verso-page__folio">1</p>
    </div>
  );
}

export function VersoMessageBack({ message, pageNumber, imageSrc }) {
  return (
    <div className="verso-page verso-page--message-back">
      <p className="verso-page__kicker">Congratulations</p>
      {message.versoBody ? (
        <p className="verso-page__body">{message.versoBody}</p>
      ) : null}
      <div className="verso-page__visual" aria-hidden="true">
        <VersoFillImage src={imageSrc} className="verso-page__visual-img" />
      </div>
      <p className="verso-page__folio">{pageNumber}</p>
    </div>
  );
}
