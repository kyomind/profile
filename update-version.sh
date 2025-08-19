#!/bin/bash

# HTML 版本更新腳本 - 使用時間戳到秒
# 格式：YYYYMMDDHHMISS

# 取得當前時間戳（到秒）
VERSION=$(date +"%Y%m%d%H%M%S")

echo "更新 HTML 版本號碼到: $VERSION"

# 替換 index.html 中的版本 meta 標籤
sed -i.bak "s/name=\"version\" content=\"[0-9]\{14\}\"/name=\"version\" content=\"$VERSION\"/g" index.html

# 刪除備份檔案
if [ -f "index.html.bak" ]; then
    rm index.html.bak
fi

echo "HTML 版本更新完成！當前版本: $VERSION"