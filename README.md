# STEYG Desktop

Nối Claude Code, Codex CLI và OpenCode với [STEYG Code](https://steyg.one) bằng một lần bấm. App chạy trên macOS và Windows.

**[Tải bản mới nhất](https://github.com/STEYG-One/steyg-desktop/releases/latest)**

| Máy của bạn | File cần tải |
| --- | --- |
| Mac chip Apple (M1 trở lên) | `STEYG-Desktop-<phiên bản>-mac-arm64.dmg` |
| Mac chip Intel | `STEYG-Desktop-<phiên bản>-mac-x64.dmg` |
| Windows 10/11 (64-bit) | `STEYG-Desktop-<phiên bản>-win-x64.exe` |

## App làm gì

- **Nối tự động**: bấm Nối là app tự ghi cấu hình cho Claude Code, Codex CLI, OpenCode. Không phải gõ lệnh hay sửa file. Bấm Ngắt là máy trở về đúng cấu hình cũ.
- **Giữ kết nối**: app chạy một gateway ngay trên máy bạn. Mạng rớt hay nguồn quá tải trong chốc lát thì gateway tự gọi lại trước khi công cụ báo lỗi.
- **Combo**: xếp vài model theo thứ tự ưu tiên; model đầu lỗi thì app chuyển sang model kế. Mỗi request tính theo model thật sự trả lời.
- **Xem hạn mức**: số credit còn lại, số request hôm nay, và từng request vừa đi qua.
- **Chẩn đoán**: gọi thật stream, gọi tool, suy luận, cache prompt và đọc ảnh cho model bạn chọn, rồi báo cái nào chạy kèm mã request để tra.
- **Chế độ tràn cho Claude Code**: dùng gói Claude của bạn trước; gói chạm giới hạn thì app nối Claude Code sang STEYG để làm tiếp, tới giờ giới hạn mở lại thì trả về gói của bạn.
- **Khoá an toàn**: khoá API nằm trong kho khoá của hệ điều hành (Keychain trên macOS, DPAPI trên Windows), không nằm trong file cấu hình của công cụ.

Cline, Roo Code, Kilo Code, Cursor và công cụ khác: app đưa sẵn địa chỉ, khoá và tên model để chép vào công cụ.

## Cài đặt

Cần một khoá API STEYG Code (`sk-steyg-…`). Tạo ở [steyg.one › STEYG Code › Khoá API](https://steyg.one/code?tab=keys).

Đây là bản beta, **chưa ký số**, nên hệ điều hành hỏi lại ở lần mở đầu tiên.

### macOS

1. Mở file `.dmg`, kéo **STEYG Desktop** vào thư mục Applications.
2. Mở app. macOS báo không xác minh được nhà phát triển: bấm **Done**.
3. Vào **System Settings › Privacy & Security**, kéo xuống cuối, bấm **Open Anyway** cạnh dòng STEYG Desktop, rồi xác nhận.

Từ lần sau app mở bình thường. Trên Mac, khi có bản mới app sẽ báo và đưa bạn về trang này để tải.

### Windows

1. Chạy file `.exe`.
2. Windows hiện "Windows protected your PC": bấm **More info**, rồi **Run anyway**.

App tự cài và tự cập nhật các bản sau.

## Bắt đầu

1. Dán khoá API vào app, bấm **Đăng nhập bằng khoá**.
2. Vào **Công cụ**, bấm **Nối** ở công cụ bạn dùng.
3. Mở Terminal, gõ `claude` (hoặc `codex`, `opencode`) và dùng như thường.

Đóng cửa sổ thì app vẫn chạy ở khay hệ thống để công cụ dùng tiếp. Thoát hẳn app thì công cụ được trỏ thẳng tới STEYG (vẫn dùng được, không còn thử lại và combo); đổi cách này ở **Cài đặt**.

## Hỗ trợ

[steyg.one › STEYG Code › Trợ giúp](https://steyg.one/code?tab=help)

---

# English

Connect Claude Code, Codex CLI and OpenCode to [STEYG Code](https://steyg.one) in one click. For macOS and Windows. The app is available in Vietnamese and English (switch on the first screen or in Settings).

**[Download the latest release](https://github.com/STEYG-One/steyg-desktop/releases/latest)**

| Your computer | File to download |
| --- | --- |
| Mac with Apple silicon (M1 or later) | `STEYG-Desktop-<version>-mac-arm64.dmg` |
| Mac with Intel | `STEYG-Desktop-<version>-mac-x64.dmg` |
| Windows 10/11 (64-bit) | `STEYG-Desktop-<version>-win-x64.exe` |

## What it does

- **One-click connect**: the app writes the config for Claude Code, Codex CLI and OpenCode. Disconnect puts every file back the way it was.
- **Keeps the stream alive**: a gateway runs on your own computer and retries brief upstream failures before your tool sees an error.
- **Combos**: list models in priority order; when the first one fails the app moves to the next. Each request is billed for the model that actually answers.
- **Quota at a glance**: credits remaining, today's requests, and a live request log.
- **Diagnostics**: calls streaming, tool calls, reasoning, prompt cache and image input for the model you pick and reports what works, with a request ID per check.
- **Overflow mode for Claude Code**: use your own Claude plan first; when it hits its limit the app connects Claude Code to STEYG so you can keep working, then hands it back when the limit resets.
- **Your key stays safe**: stored in the system keychain (Keychain on macOS, DPAPI on Windows), not in tool config files.

## Install

You need a STEYG Code API key (`sk-steyg-…`): create one at [steyg.one › STEYG Code › API keys](https://steyg.one/code?tab=keys).

This is an **unsigned** beta, so the operating system asks once on first launch.

- **macOS**: open the `.dmg`, drag the app to Applications and open it. When macOS says it cannot verify the developer, click **Done**, go to **System Settings › Privacy & Security**, scroll down and click **Open Anyway**. On Mac the app tells you when a new version is out and sends you here to download it.
- **Windows**: run the `.exe`. On "Windows protected your PC", click **More info**, then **Run anyway**. The app updates itself afterwards.

## Support

[steyg.one › STEYG Code › Help](https://steyg.one/code?tab=help)
