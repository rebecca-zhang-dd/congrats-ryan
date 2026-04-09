import { useState } from 'react';

function CoverBackgroundImage({ src }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="cover-page__media-fallback" aria-hidden="true" />;
  }

  return (
    <img
      className="cover-page__media-img"
      src={src}
      alt=""
      onError={() => setFailed(true)}
    />
  );
}

export default function CoverPage({ coverImageSrc }) {
  return (
    <div className="cover-page">
      <div className="cover-page__media" aria-hidden="true">
        <CoverBackgroundImage key={coverImageSrc ?? 'none'} src={coverImageSrc} />
      </div>

      <div className="cover-page__content">
        <p className="cover-page__title cover-page__title--top">CONGRATULATIONS</p>

        <div className="cover-page__monogram" aria-hidden="true">
          <span className="cover-page__ornament">✽</span>
          <div className="cover-page__monogram-rings">
            <span className="cover-page__ring cover-page__ring--outer" />
            <span className="cover-page__ring cover-page__ring--inner" />
            <div className="cover-page__initials">
              <span className="cover-page__initial">R</span>
              <span className="cover-page__initial">J</span>
            </div>
          </div>
          <span className="cover-page__ornament">✽</span>
        </div>

        <p className="cover-page__title cover-page__title--bottom">RYAN &amp; JULIA</p>
      </div>
    </div>
  );
}
