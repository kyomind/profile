#!/bin/bash

# HTML & CSS 版本更新腳本 - 使用時間戳到秒
# 格式：YYYYMMDDHHMISS

# 取得當前時間戳（到秒）
VERSION=$(date +"%Y%m%d%H%M%S")

echo "更新 HTML & CSS 版本號碼到: $VERSION"

# 替換 index.html 中的版本 meta 標籤
sed -i.bak "s/name=\"version\" content=\"[0-9]\{14\}\"/name=\"version\" content=\"$VERSION\"/g" index.html

# 替換 index.html 中的 CSS 版本參數
sed -i.bak2 "s/style\.css?v=[0-9]\{14\}/style.css?v=$VERSION/g" index.html

# 替換 CSS 檔案中的版本註解
sed -i.bak "s/\/\* Version: [0-9]\{14\} \*\//\/* Version: $VERSION *\//g" assets/css/style.css

# 刪除備份檔案
if [ -f "index.html.bak" ]; then
    rm index.html.bak
fi
if [ -f "index.html.bak2" ]; then
    rm index.html.bak2
fi
if [ -f "assets/css/style.css.bak" ]; then
    rm assets/css/style.css.bak
fi

echo "HTML & CSS 版本更新完成！當前版本: $VERSION"