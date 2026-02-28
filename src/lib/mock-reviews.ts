/**
 * Mock customer reviews for demo mode.
 *
 * Uses app-001 (Weatherly) as the default app for reviews.
 * Territory codes use ISO 3166-1 alpha-3 (matching real ASC API).
 */

export interface MockReview {
  id: string;
  appId: string;
  rating: number;
  title: string;
  body: string;
  reviewerNickname: string;
  territory: string; // ISO 3166-1 alpha-3
  createdDate: string;
  response?: {
    id: string;
    responseBody: string;
    lastModifiedDate: string;
    state: "PENDING_PUBLISH" | "PUBLISHED";
  };
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: "rev-001",
    appId: "app-001",
    rating: 5,
    title: "Best weather app I've used",
    body: "Clean interface, accurate forecasts, and the radar is incredibly smooth. Exactly what a weather app should be – fast and beautiful without being bloated.",
    reviewerNickname: "JohnDoe",
    territory: "USA",
    createdDate: "2026-02-25T16:29:00Z",
  },
  {
    id: "rev-002",
    appId: "app-001",
    rating: 3,
    title: "Good but widget needs work",
    body: "The app itself is great, but the home screen widget often shows stale data. It would also be nice to have a wind speed widget option.",
    reviewerNickname: "RonCv55",
    territory: "NLD",
    createdDate: "2026-02-23T20:40:00Z",
    response: {
      id: "resp-002",
      responseBody: "Thanks for the feedback! We're aware of the widget refresh issue and have a fix coming in 2.1.1. Wind speed widget is on our roadmap.",
      lastModifiedDate: "2026-02-24T09:15:00Z",
      state: "PUBLISHED",
    },
  },
  {
    id: "rev-003",
    appId: "app-001",
    rating: 1,
    title: "Crashes on launch since update",
    body: "Updated to 2.0.1 and the app crashes immediately on my iPhone 14. Tried reinstalling twice. Was working fine before.",
    reviewerNickname: "soundneedle",
    territory: "USA",
    createdDate: "2026-02-19T00:04:00Z",
    response: {
      id: "resp-003",
      responseBody: "Sorry about this! We've identified the issue affecting iPhone 14 models and submitted a fix. Please try updating to 2.0.2 when it's available.",
      lastModifiedDate: "2026-02-20T11:30:00Z",
      state: "PENDING_PUBLISH",
    },
  },
  {
    id: "rev-004",
    appId: "app-001",
    rating: 5,
    title: "Simple et efficace",
    body: "Enfin une app météo qui va droit au but. Pas de pubs, pas d'abonnement, juste la météo. L'animation de pluie est magnifique.",
    reviewerNickname: "LeMacUser",
    territory: "FRA",
    createdDate: "2026-02-11T08:30:00Z",
  },
  {
    id: "rev-005",
    appId: "app-001",
    rating: 4,
    title: "Almost perfect",
    body: "Love the design and accuracy. Only thing missing is air quality alerts – I need to know when pollen counts are high. Would instantly be 5 stars with that.",
    reviewerNickname: "WeatherWatcher42",
    territory: "GBR",
    createdDate: "2026-02-08T14:20:00Z",
  },
  {
    id: "rev-006",
    appId: "app-001",
    rating: 2,
    title: "Standort wird immer zurückgesetzt",
    body: "Jedes Mal wenn ich die App öffne, springt sie zurück zu meinem Heimatort, statt sich die letzte Stadt zu merken. Sehr nervig auf Reisen.",
    reviewerNickname: "TravelPro",
    territory: "DEU",
    createdDate: "2026-02-05T09:45:00Z",
  },
  {
    id: "rev-007",
    appId: "app-002",
    rating: 5,
    title: "Finally a task app that makes sense",
    body: "I've tried dozens of task managers and this is the only one that stays out of my way. Clean, fast, and syncs perfectly across devices.",
    reviewerNickname: "ProductivityGuru",
    territory: "USA",
    createdDate: "2026-02-22T11:00:00Z",
  },
  {
    id: "rev-008",
    appId: "app-002",
    rating: 2,
    title: "No calendar integration",
    body: "This app would be great if it could sync with my calendar. Without that, I have to manually manage everything in two places.",
    reviewerNickname: "BusyBee99",
    territory: "CAN",
    createdDate: "2026-02-18T15:30:00Z",
    response: {
      id: "resp-008",
      responseBody: "Calendar integration is our most requested feature and is coming in v3.0. Thanks for your patience!",
      lastModifiedDate: "2026-02-19T08:00:00Z",
      state: "PUBLISHED",
    },
  },
  {
    id: "rev-009",
    appId: "app-003",
    rating: 4,
    title: "Great camera controls",
    body: "Manual exposure and focus controls are excellent. RAW capture works flawlessly. Only wish the UI was a bit more intuitive for beginners.",
    reviewerNickname: "ShutterSnap",
    territory: "AUS",
    createdDate: "2026-02-20T06:15:00Z",
  },
  {
    id: "rev-010",
    appId: "app-003",
    rating: 1,
    title: "写真が保存されない",
    body: "撮影後に写真がカメラロールに保存されません。設定を確認しましたが、問題が解決しません。早急に修正してください。",
    reviewerNickname: "カメラ好き",
    territory: "JPN",
    createdDate: "2026-02-15T03:45:00Z",
  },
];

export function getMockCustomerReviews(appId: string): MockReview[] {
  return MOCK_REVIEWS.filter((r) => r.appId === appId);
}
