.PHONY: start dev update

start: dev

# 本機預覽：http://localhost:4321（改用 Astro 後換成 npm run dev，port 相同）
dev:
	@echo "預覽：http://localhost:4321"
	@python3 -m http.server 4321 --bind 127.0.0.1

# 更新版本號碼
update:
	@echo "正在更新版本號碼..."
	@./update-version.sh
