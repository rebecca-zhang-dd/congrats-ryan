export default function MessagePage({ segments, pageNumber }) {
  return (
    <div className="message-page">
      <div className="message-page__text">
        <p className="message-page__kicker">From the team</p>
        <div
          className={
            segments.length > 1
              ? 'message-page__body-stack message-page__body-stack--multi'
              : 'message-page__body-stack'
          }
        >
          {segments.map((seg, i) => (
            <div
              key={`${seg.author}-${i}`}
              className={
                i > 0
                  ? 'message-page__content message-page__content--segment'
                  : 'message-page__content'
              }
            >
              <p className="message-page__body">{seg.body}</p>
              <p className="message-page__author">{seg.author}</p>
            </div>
          ))}
        </div>
        <p className="message-page__folio">{pageNumber}</p>
      </div>
    </div>
  );
}
