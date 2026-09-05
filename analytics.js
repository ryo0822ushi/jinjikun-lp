/* ==========================================================================
   スーパー人事くん アクセス計測（Googleアナリティクス4）
   --------------------------------------------------------------------------
   ■ 書き換える場所は、下の GA_ID の1行だけです。
     index.html / contact.html / privacy.html の3ページが全部このファイルを
     読み込むので、ここを1回直せば、サイト全体に反映されます。

   ■ このファイルが数えるもの
     1. ページの閲覧数と、どこから来たか（検索・広告・SNSなど）
     2. お問い合わせフォームの送信＝成果（contact_submit）
     3. 電話番号 0120-058-053 のタップ（tel_tap）

   ■ 測定IDが未設定のあいだは、何も送信しません（安全に空回りします）
   ========================================================================== */
(function () {
  "use strict";

  /* ▼▼▼ ここだけ書き換える ▼▼▼
     Googleアナリティクスの「測定ID」（G- で始まる文字列）に差し替えてください。 */
  var GA_ID = "G-ZGLQGDFNSV";
  /* ▲▲▲ ここだけ書き換える ▲▲▲ */

  /* 他のページから呼ばれてもエラーにならないよう、先に空の関数を置いておく */
  window.jkTrack = function () {};

  /* 測定IDが未設定なら、ここで終了（誤った送信もエラーも起こさない） */
  if (!GA_ID || GA_ID.slice(0, 2) !== "G-" || GA_ID === "G-XXXXXXXXXX") { return; }

  /* 手元での確認（パソコン内のファイルを直接開いた場合など）は数えない */
  var host = location.hostname;
  if (location.protocol === "file:" || host === "" || host === "localhost" || host === "127.0.0.1") { return; }

  /* ---- 1. 基本の計測：ページの閲覧数・流入元 ---- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);

  var tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  (document.head || document.documentElement).appendChild(tag);

  /* ---- 共通の送信口（フォーム側からも呼ぶ） ---- */
  window.jkTrack = function (name, params) {
    try {
      var p = params || {};
      p.page_path = location.pathname;
      gtag("event", name, p);
    } catch (e) { /* 計測の失敗でサイトを止めない */ }
  };

  /* ---- 3. 電話番号リンクのタップを数える ---- */
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    var a = (t && t.closest) ? t.closest('a[href^="tel:"]') : null;
    if (!a) { return; }
    window.jkTrack("tel_tap", {
      tel_number: a.getAttribute("href").replace(/^tel:/, ""),
      link_place: (a.className || "") + ""
    });
  }, true);
})();
