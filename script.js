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