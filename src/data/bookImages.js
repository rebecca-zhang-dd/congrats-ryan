/**
 * Photos live in `public/images/` (served as `/images/...`).
 * `cover.png` = front-cover portrait (palm shadow). Verso list = 15 slots (inner cover + 14 spreads);
 * with 10 unique photos we repeat the first five for spreads 11–15.
 */
export const coverSquareSrc = '/images/cover.png';

const _versoUnique = [
  '/images/374615055_3269100990048216_8501702753724874051_n.jpg',
  '/images/626164304_18557488300006716_931959806991403887_n.jpg',
  '/images/626243820_18557488333006716_3035244585770959725_n.jpg',
  '/images/627650967_18557488291006716_4403329056413404465_n.jpg',
  '/images/627691978_18557488318006716_467105426968930572_n.jpeg',
  '/images/628042214_18557488282006716_8116780761346261239_n.jpg',
  '/images/628091652_18557488309006716_8680137028355760267_n.jpg',
  '/images/641021331_18564509887056669_3093309279888005625_n.jpg',
  '/images/645059738_18145527607482445_2813857145658599442_n.jpg',
  '/images/656024500_18380632387095587_1371044138968701518_n.jpg',
];

export const versoImages = [..._versoUnique, ..._versoUnique.slice(0, 5)];
