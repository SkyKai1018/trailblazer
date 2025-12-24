#!/usr/bin/env python3
"""
將 PDF 轉換為圖片
需要安裝: pip3 install pdf2image pillow
"""

import os
import sys
from pathlib import Path

try:
    from pdf2image import convert_from_path
except ImportError:
    print("錯誤：需要安裝 pdf2image")
    print("請執行: pip3 install pdf2image pillow")
    sys.exit(1)

# 設定路徑
script_dir = Path(__file__).parent
pdf_path = script_dir.parent / "Topo_Mountain_Racer_4_Deep_Dive.pdf"
output_dir = script_dir / "public" / "slides" / "topo-mtn-racer-4"

# 確保輸出目錄存在
output_dir.mkdir(parents=True, exist_ok=True)

if not pdf_path.exists():
    print(f"錯誤：找不到 PDF 檔案: {pdf_path}")
    sys.exit(1)

print(f"PDF 路徑: {pdf_path}")
print(f"輸出目錄: {output_dir}")
print("開始轉換...")

try:
    # 轉換 PDF 為圖片 (300 DPI)
    images = convert_from_path(
        str(pdf_path),
        dpi=300,
        fmt='png'
    )
    
    print(f"成功讀取 {len(images)} 頁")
    
    # 儲存每頁為 PNG
    for i, image in enumerate(images, 1):
        filename = f"topo-mtn-racer-4-{i:02d}.png"
        filepath = output_dir / filename
        image.save(filepath, 'PNG', optimize=True)
        print(f"已儲存: {filename} ({image.size[0]}x{image.size[1]})")
    
    print(f"\n✅ 轉換完成！共 {len(images)} 張圖片")
    print(f"圖片位置: {output_dir}")
    
except Exception as e:
    print(f"錯誤: {e}")
    print("\n如果出現 poppler 相關錯誤，請執行:")
    print("  brew install poppler")
    sys.exit(1)

