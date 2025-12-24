// PDF 轉圖片腳本
// 使用 pdf-poppler 將 PDF 轉換為圖片

const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');

const pdfPath = path.join(__dirname, '../Topo_Mountain_Racer_4_Deep_Dive.pdf');
const outputDir = path.join(__dirname, 'public/slides/topo-mtn-racer-4');

// 確保輸出目錄存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const options = {
  format: 'png',
  out_dir: outputDir,
  out_prefix: 'slide',
  page: null, // 轉換所有頁面
  scale: 2.0, // 提高解析度
};

console.log('開始轉換 PDF 為圖片...');
console.log('PDF 路徑:', pdfPath);
console.log('輸出目錄:', outputDir);

pdf.convert(pdfPath, options)
  .then(() => {
    console.log('轉換完成！');
    // 重新命名檔案為有序的格式
    const files = fs.readdirSync(outputDir)
      .filter(f => f.startsWith('slide') && f.endsWith('.png'))
      .sort();
    
    files.forEach((file, index) => {
      const oldPath = path.join(outputDir, file);
      const newPath = path.join(outputDir, `topo-mtn-racer-4-${String(index + 1).padStart(2, '0')}.png`);
      fs.renameSync(oldPath, newPath);
      console.log(`已重新命名: ${file} -> ${path.basename(newPath)}`);
    });
    
    console.log(`\n成功轉換 ${files.length} 張圖片！`);
    console.log(`圖片位置: ${outputDir}`);
  })
  .catch((error) => {
    console.error('轉換失敗:', error);
    console.error('\n如果出現錯誤，請嘗試：');
    console.error('1. 安裝 poppler: brew install poppler');
    console.error('2. 或使用 Python: pip3 install pdf2image pillow');
  });

