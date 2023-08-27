async function createPdf() {
  //PDF生成
  const pdf = await PDFLib.PDFDocument.create();

  //埋込フォント使用
  pdf.registerFontkit(fontkit);

  //日本語フォント読込(ダウンロードして同階層に配置しておく)
  const bold = await pdf.embedFont(await (await fetch('fonts/ShipporiMinchoB1-Bold.ttf')).arrayBuffer());
  const font = await pdf.embedFont(await (await fetch('fonts/ShipporiMinchoB1-Regular.ttf')).arrayBuffer());

  //ページ追加（単位はポイント、A4サイズにしています）
  const page = pdf.addPage([595, 842]);

  //文字描画（こちらも size, x, y の単位はポイント、原点は左下）
  const title = document.getElementById('title').value;
  page.drawText(title, { font: bold, size: 14, x: 20, y: 800 });

  //文字描画（こちらも size, x, y の単位はポイント、原点は左下）
  const content = document.getElementById('content').value;
  page.drawText(content, { font: font, size: 10.5, x: 20, y: 760, lineHeight: 15 });

  //PDF表示(別タブ)
  const url = URL.createObjectURL(new Blob([await pdf.save()], { type: 'application/pdf' }));
  window.open(url, '_blank');
};

// ボタンクリック
document.getElementById('btn').addEventListener('click', () => {
  // loadingを表示
  const loading = document.getElementById('loading');
  loading.style.display = 'flex';
  // PDFを出力したらloadingを非表示
  createPdf().then(() => {
    loading.style.display = 'none';
  });
});

// 保存ボタンクリック
document.getElementById('save-btn').addEventListener('click', () => {
  const msg = "入力内容を保存しますか？\n※入力内容はご利用の端末のローカルストレージに保存されます。\n※過去に保存した内容がある場合は上書きされます。";
  // 確認ダイアログ
  if(confirm(msg)) {
    // タイトルを保存
    localStorage.setItem('title', document.getElementById('title').value);
    // 内容を保存
    localStorage.setItem('content', document.getElementById('content').value);
  }
});

// 呼び出しボタンクリック
document.getElementById('load-btn').addEventListener('click', () => {
  const msg = "以前、保存した入力内容を呼び出しますか？\n※現在の入力内容は破棄されます。";
  // 確認ダイアログ
  if(confirm(msg)) {
    // タイトルを取得
    const title = localStorage.getItem('title');
    // 内容を取得
    const content = localStorage.getItem('content');
    // タイトルを入力欄にセット
    document.getElementById('title').value = title;
    // 内容を入力欄にセット
    document.getElementById('content').value = content;
  }
});