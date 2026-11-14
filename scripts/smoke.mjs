// Kiểm bản cài đã phát hành trên máy sạch: app mở được, gateway chạy, giao diện nói chuyện được với tiến trình chính,
// và máy chủ STEYG thật từ chối một khoá sai. Chạy: node scripts/smoke.mjs <đường dẫn file chạy của app> <thư mục ảnh>
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [exe, outDir = "smoke-out"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const check = (name, ok, detail = "") => {
	if (!ok) failed += 1;
	console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

const app = spawn(exe, [`--user-data-dir=${mkdtempSync(join(tmpdir(), "steyg-smoke-"))}`, "--remote-debugging-port=9333"], {
	stdio: "ignore",
});

async function until(fn, seconds) {
	for (let i = 0; i < seconds * 2; i += 1) {
		try {
			const value = await fn();
			if (value) return value;
		} catch {}
		await wait(500);
	}
	return null;
}

/** Gọi gateway với header Host tuỳ ý (fetch không cho đặt Host). */
const rawStatus = (path, headers) =>
	new Promise((resolve) => {
		const req = request({ host: "127.0.0.1", port: 8317, path, headers }, (res) => {
			res.resume();
			resolve(res.statusCode);
		});
		req.on("error", () => resolve(0));
		req.end();
	});

try {
	const health = await until(async () => (await fetch("http://127.0.0.1:8317/health")).json(), 60);
	check("app mở và gateway trả lời ở 127.0.0.1:8317", health?.ok === true, JSON.stringify(health));

	const unauth = await fetch("http://127.0.0.1:8317/v1/chat/completions", {
		method: "POST",
		headers: { authorization: "Bearer wrong", "content-type": "application/json" },
		body: "{}",
	});
	check("gateway từ chối mã lạ (401)", unauth.status === 401, `HTTP ${unauth.status}`);
	check("gateway từ chối Host lạ (403, chống DNS rebinding)", (await rawStatus("/v1/models", { host: "evil.example" })) === 403);

	const target = await until(async () => {
		const list = await (await fetch("http://127.0.0.1:9333/json")).json();
		return list.find((item) => item.type === "page" && item.url.includes("index.html"));
	}, 30);
	check("cửa sổ giao diện đã nạp", Boolean(target), target?.url);

	if (target) {
		const ws = new WebSocket(target.webSocketDebuggerUrl);
		await new Promise((resolve, reject) => {
			ws.onopen = resolve;
			ws.onerror = reject;
		});
		let seq = 0;
		const pending = new Map();
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			pending.get(message.id)?.(message.result);
		};
		const send = (method, params = {}) =>
			new Promise((resolve) => {
				seq += 1;
				pending.set(seq, resolve);
				ws.send(JSON.stringify({ id: seq, method, params }));
			});
		const evaluate = async (expression) =>
			(await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.value;

		const snapshot = await evaluate("window.steyg.snapshot()");
		check("giao diện đọc được trạng thái từ tiến trình chính", snapshot?.gateway?.running === true, `v${snapshot?.version} ${snapshot?.platform}`);
		check("nhận ra đúng hệ điều hành", snapshot?.platform === (process.platform === "win32" ? "windows" : "mac"), snapshot?.platform);
		const heading = await evaluate("document.querySelector('h1')?.textContent");
		check("màn đăng nhập hiện tiêu đề tiếng Việt có dấu", /Nối công cụ AI/.test(heading ?? ""), heading);
		const font = await evaluate("document.fonts.check('16px Inter') && [...document.fonts].some((f) => f.status === 'loaded')");
		check("phông Inter đã nạp", font === true);

		const signIn = await evaluate(`window.steyg.signInWithKey("sk-steyg-${"A".repeat(32)}")`);
		check("máy chủ STEYG thật từ chối khoá sai, app báo đúng lý do", signIn?.error === "key-rejected", JSON.stringify(signIn));

		for (const theme of ["dark", "light"]) {
			await evaluate(`window.steyg.updateSettings({ theme: "${theme}" })`);
			await wait(800);
			const shot = await send("Page.captureScreenshot", { format: "png" });
			writeFileSync(join(outDir, `${process.platform}-${theme}.png`), Buffer.from(shot.data, "base64"));
		}
		ws.close();
	}
} finally {
	app.kill();
}
console.log(failed === 0 ? "TẤT CẢ ĐẠT" : `${failed} bước hỏng`);
process.exit(failed === 0 ? 0 : 1);
