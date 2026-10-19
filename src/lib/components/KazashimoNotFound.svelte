<script lang="ts">
 import '@fontsource/zen-maru-gothic/700.css';
</script>

<svelte:head>
 <title>Kazashimo Not Found | かざぐるま</title>
 <meta name="robots" content="noindex" />
</svelte:head>

<main class="not-found">
 <div class="content">
  <p class="code" aria-label="エラー404">404</p>
  <h1>Kazashimo Not Found</h1>
  <p class="lead">お探しの風下は見つかりませんでした。</p>
  <div class="reasons">
   <p>以下のような原因が考えられます。</p>
   <ul>
    <li>URLが間違っている。</li>
    <li>ページが移動、または削除された。</li>
    <li>風下が寝ている。</li>
   </ul>
  </div>
  <a href="/" data-sveltekit-reload>ホームへ戻る<span aria-hidden="true"> →</span></a>
 </div>
</main>

<style>
 :global(html) { min-height: 100%; background-color: #fbfaf4; background-image: linear-gradient(#dfe5ec 1px, transparent 1px), linear-gradient(90deg, #dfe5ec 1px, transparent 1px); background-size: 22px 22px; }
 :global(body) { margin: 0; }
 .not-found { box-sizing: border-box; display: grid; min-height: 100vh; min-height: 100svh; place-items: center; padding: 64px 24px; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; }
 .content { width: min(100%, 560px); min-width: 0; }
 .code { margin: 0 0 8px; color: #5a65b1; font: 700 80px/1 'Zen Maru Gothic', sans-serif; letter-spacing: .04em; }
 h1 { margin: 0 0 18px; font: 700 clamp(27px, 4vw, 40px)/1.35 'Zen Maru Gothic', sans-serif; letter-spacing: -.025em; overflow-wrap: anywhere; }
 .lead { margin: 0; font-size: 16px; }
 .reasons { margin: 30px 0; font-size: 14px; }
 .reasons p { margin: 0 0 10px; }
 ul { margin: 0; padding-left: 1.4em; }
 li + li { margin-top: 5px; }
 a { display: inline-flex; align-items: center; min-height: 44px; gap: 12px; color: #454e8f; font-size: 15px; font-weight: 700; text-decoration: underline; text-underline-offset: 5px; }
 a:hover { color: #0f172a; }
 a:focus-visible { outline: 3px solid #5a65b1; outline-offset: 5px; }
 @media(max-width: 600px) {
  .not-found { padding: 44px 22px; }
  .code { font-size: 64px; }
  h1 { font-size: 27px; }
  .lead { font-size: 15px; }
  .reasons { font-size: 13px; }
 }
</style>
