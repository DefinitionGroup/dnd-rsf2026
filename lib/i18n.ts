/**
 * Single source of truth for locales. Everything (schema, routing, Studio
 * structure, seed, demo, metadata) derives from this list. `en` is primary.
 */
export const LOCALES = [
  { id: "en", title: "English", ogLocale: "en_GB", htmlLang: "en" },
  { id: "de", title: "Deutsch", ogLocale: "de_DE", htmlLang: "de" },
  { id: "fr", title: "Français", ogLocale: "fr_FR", htmlLang: "fr" },
  { id: "pl", title: "Polski", ogLocale: "pl_PL", htmlLang: "pl" },
  { id: "ja", title: "日本語", ogLocale: "ja_JP", htmlLang: "ja" },
] as const;

export type Locale = (typeof LOCALES)[number]["id"];

export const locales = LOCALES.map((l) => l.id) as unknown as readonly Locale[];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return Boolean(value) && (locales as readonly string[]).includes(value as string);
}

export function localeMeta(locale: Locale) {
  return LOCALES.find((l) => l.id === locale) ?? LOCALES[0];
}

/** Sanity plugin-shaped list (`{id, title}`) for document-internationalization / internationalized-array */
export const sanityLanguages = LOCALES.map(({ id, title }) => ({ id, title }));

/** Small UI dictionary for chrome that is not editor-managed. Keep tiny; prefer CMS fields. */
export const ui = {
  en: { skipToContent: "Skip to content", language: "Language", menu: "Menu", close: "Close", notFoundTitle: "Page not found", notFoundBody: "The page you are looking for does not exist or has moved.", backHome: "Back to home", disableDraft: "Exit draft mode", sendAnother: "Send another message", findStockist: "Find a stockist", scrollHint: "Scroll", dragToRotate: "Drag to rotate", resetView: "Reset view", rotateKeys: "Use the arrow keys to rotate the model, and 0 to reset the view.", watchFilm: "Watch the film", playVideo: "Play video" },
  de: { skipToContent: "Zum Inhalt springen", language: "Sprache", menu: "Menü", close: "Schließen", notFoundTitle: "Seite nicht gefunden", notFoundBody: "Die gesuchte Seite existiert nicht oder wurde verschoben.", backHome: "Zur Startseite", disableDraft: "Entwurfsmodus beenden", sendAnother: "Weitere Nachricht senden", findStockist: "Händler finden", scrollHint: "Scrollen", dragToRotate: "Zum Drehen ziehen", resetView: "Ansicht zurücksetzen", rotateKeys: "Mit den Pfeiltasten das Modell drehen, mit 0 die Ansicht zurücksetzen.", watchFilm: "Film ansehen", playVideo: "Video abspielen" },
  fr: { skipToContent: "Aller au contenu", language: "Langue", menu: "Menu", close: "Fermer", notFoundTitle: "Page introuvable", notFoundBody: "La page que vous cherchez n'existe pas ou a été déplacée.", backHome: "Retour à l'accueil", disableDraft: "Quitter le mode brouillon", sendAnother: "Envoyer un autre message", findStockist: "Trouver un revendeur", scrollHint: "Faites défiler", dragToRotate: "Glissez pour pivoter", resetView: "Réinitialiser la vue", rotateKeys: "Utilisez les flèches pour faire pivoter le modèle et 0 pour réinitialiser la vue.", watchFilm: "Voir le film", playVideo: "Lire la vidéo" },
  pl: { skipToContent: "Przejdź do treści", language: "Język", menu: "Menu", close: "Zamknij", notFoundTitle: "Nie znaleziono strony", notFoundBody: "Strona, której szukasz, nie istnieje lub została przeniesiona.", backHome: "Wróć na stronę główną", disableDraft: "Wyjdź z trybu roboczego", sendAnother: "Wyślij kolejną wiadomość", findStockist: "Znajdź sprzedawcę", scrollHint: "Przewiń", dragToRotate: "Przeciągnij, aby obrócić", resetView: "Zresetuj widok", rotateKeys: "Strzałkami obracasz model, klawiszem 0 resetujesz widok.", watchFilm: "Obejrzyj film", playVideo: "Odtwórz wideo" },
  ja: { skipToContent: "本文へスキップ", language: "言語", menu: "メニュー", close: "閉じる", notFoundTitle: "ページが見つかりません", notFoundBody: "お探しのページは存在しないか、移動しました。", backHome: "ホームへ戻る", disableDraft: "下書きモードを終了", sendAnother: "別のメッセージを送る", findStockist: "販売店を探す", scrollHint: "スクロール", dragToRotate: "ドラッグして回転", resetView: "視点をリセット", rotateKeys: "矢印キーでモデルを回転、0キーで視点をリセットします。", watchFilm: "ムービーを見る", playVideo: "動画を再生" },
} satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)["en"];
export function t(locale: Locale, key: UiKey) {
  return ui[locale]?.[key] ?? ui.en[key];
}
