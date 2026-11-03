.PHONY: start dev build check ready

start: dev

# 本機預覽：http://localhost:4321
dev:
	npm run dev

# 建置到 dist/
build:
	npm run build

# 檢查現有 dist/（要對最新內容請用 make ready）
check:
	npm run check

# 先 build 再 check
ready: build
	@$(MAKE) --no-print-directory check
