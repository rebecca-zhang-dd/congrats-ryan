import { useCallback, useEffect, useRef, useState } from 'react';
import { coverSquareSrc, versoImages } from '../data/bookImages';
import { messages } from '../data/messages';
import CoverPage from './CoverPage';
import MessagePage from './MessagePage';
import { VersoCoverBack, VersoMessageBack } from './VersoPanel';
import './Book.css';

const PAGE_COUNT = 1 + messages.length;
const FLIP_DURATION_MS = 650;

/** Printed recto folio for message at index (0-based): 2, 4, 6, … */
function rectoFolio(idx) {
  return 2 * (idx + 1);
}

/** Folio on the back of that sheet (left when viewing next spread): 3, 5, 7, … */
function versoFolioForMessageIdx(idx) {
  return 2 * (idx + 1) + 1;
}

/** Live left-leaf folio when the book is open to currentPageIndex (1 = first message). */
function spreadLeftFolio(currentPageIndex) {
  if (currentPageIndex <= 1) return 1;
  return 2 * (currentPageIndex - 1) + 1;
}

function getPageZIndex(i, currentPageIndex) {
  if (i < currentPageIndex) return i;
  return 100 + (PAGE_COUNT - 1 - (i - currentPageIndex));
}

function renderSpreadVerso(currentPageIndex) {
  if (currentPageIndex === 1) {
    return <VersoCoverBack imageSrc={versoImages[0]} />;
  }
  const msg = messages[currentPageIndex - 2];
  return (
    <VersoMessageBack
      message={msg}
      pageNumber={spreadLeftFolio(currentPageIndex)}
      imageSrc={versoImages[currentPageIndex - 1]}
    />
  );
}

export default function Book() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [animatingPageIndex, setAnimatingPageIndex] = useState(null);
  const [flipDirection, setFlipDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);

  const canPrev = currentPageIndex > 0 && !isAnimating;
  const canNext = currentPageIndex < PAGE_COUNT - 1 && !isAnimating;

  const handlePrev = useCallback(() => {
    if (!canPrev) return;
    const targetIndex = currentPageIndex - 1;
    setIsAnimating(true);
    setAnimatingPageIndex(targetIndex);
    setFlipDirection('prev');
    animationTimerRef.current = window.setTimeout(() => {
      setCurrentPageIndex((n) => Math.max(0, n - 1));
      setIsAnimating(false);
      setAnimatingPageIndex(null);
      setFlipDirection(null);
    }, FLIP_DURATION_MS);
  }, [canPrev, currentPageIndex]);

  const handleNext = useCallback(() => {
    if (!canNext) return;
    const targetIndex = currentPageIndex;
    setIsAnimating(true);
    setAnimatingPageIndex(targetIndex);
    setFlipDirection('next');
    animationTimerRef.current = window.setTimeout(() => {
      setCurrentPageIndex((n) => Math.min(PAGE_COUNT - 1, n + 1));
      setIsAnimating(false);
      setAnimatingPageIndex(null);
      setFlipDirection(null);
    }, FLIP_DURATION_MS);
  }, [canNext, currentPageIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (isAnimating) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isAnimating, handlePrev, handleNext]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  /* Warm image cache so verso photos decode before first flip (reduces flash). */
  useEffect(() => {
    const urls = [coverSquareSrc, ...versoImages];
    urls.forEach((url) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
    });
  }, []);

  const getIsFlipped = (i) => {
    const baselineFlipped = i < currentPageIndex;
    if (!isAnimating || animatingPageIndex !== i) return baselineFlipped;
    return flipDirection === 'next';
  };

  const getAnimatedZIndex = (i) => {
    if (isAnimating && animatingPageIndex === i) return 1000;
    return getPageZIndex(i, currentPageIndex);
  };

  const isClosingCover =
    isAnimating &&
    flipDirection === 'prev' &&
    currentPageIndex === 1 &&
    animatingPageIndex === 0;

  /* Widen at start of open flip; narrow at start of close flip (mirror behavior) */
  const spreadOpen =
    (!isClosingCover && currentPageIndex > 0) ||
    (isAnimating &&
      flipDirection === 'next' &&
      currentPageIndex === 0 &&
      animatingPageIndex === 0);

  const versoSpreadIndex =
    currentPageIndex === 0 &&
    isAnimating &&
    flipDirection === 'next' &&
    animatingPageIndex === 0
      ? 1
      : currentPageIndex;

  return (
    <div className="book-app">
      <div className="book-spread">
        <div className="book-root">
          <div
            className={[
              'book-viewport',
              spreadOpen ? '' : 'book-viewport--closed',
              isClosingCover ? 'book-viewport--closing' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-live="polite"
          >
            {spreadOpen && (
              <div className="book-verso">
                {renderSpreadVerso(versoSpreadIndex)}
              </div>
            )}
            <div className="book-recto-stack">
              {messages.map((msg, idx) => {
                const i = idx + 1;
                const flipped = getIsFlipped(i);
                return (
                  <div
                    key={i}
                    className="page-sheet"
                    style={{ zIndex: getAnimatedZIndex(i) }}
                  >
                    <div
                      className={
                        flipped
                          ? 'page-sheet-inner page-sheet-inner--flipped'
                          : 'page-sheet-inner'
                      }
                    >
                      <div className="page-face page-face--front">
                        <div className="book-page">
                          <MessagePage
                            segments={msg.segments}
                            pageNumber={rectoFolio(idx)}
                          />
                        </div>
                      </div>
                      <div className="page-face page-face--back" aria-hidden="true">
                        <div className="book-page book-page--verso">
                          <VersoMessageBack
                            message={msg}
                            pageNumber={versoFolioForMessageIdx(idx)}
                            imageSrc={versoImages[idx + 1]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div
                className="page-sheet page-sheet--cover"
                style={{ zIndex: getAnimatedZIndex(0) }}
              >
                <div
                  className={
                    getIsFlipped(0)
                      ? 'page-sheet-inner page-sheet-inner--flipped'
                      : 'page-sheet-inner'
                  }
                >
                  <div className="page-face page-face--front">
                    <div className="book-page book-page--cover">
                      <CoverPage coverImageSrc={coverSquareSrc} />
                    </div>
                  </div>
                  <div className="page-face page-face--back" aria-hidden="true">
                    <div className="book-page book-page--verso">
                      <VersoCoverBack imageSrc={versoImages[0]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="book-nav" aria-label="Book navigation">
        <button
          type="button"
          className="book-nav__btn book-nav__btn--prev"
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="book-nav__progress">
          Page {currentPageIndex + 1} of {PAGE_COUNT}
        </span>
        <button
          type="button"
          className="book-nav__btn book-nav__btn--next"
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next page"
        >
          Next
        </button>
      </nav>
    </div>
  );
}
