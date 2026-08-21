# Monee: Your Personal Finance Companion

Create a mobile-first personal finance PWA designed primarily for iPhone.

The app name is "Monee".

DESIGN:

Create a clean, elegant, modern finance app with a soft mint green and white theme.

Use rounded cards, subtle shadows, lots of white space and simple line icons.

The design should feel like a native iOS app, not a website.

Use the visual style of a modern Korean finance app.

Do not copy any existing app's branding or copyrighted graphics.

The entire interface should initially be in Vietnamese.

MAIN NAVIGATION:

Create 4 bottom navigation tabs:

1. Trang chủ

2. Thống kê

3. Tài sản

4. Cài đặt

Place a large circular + button above the bottom navigation for adding transactions.

HOME SCREEN:

At the top show:

- Month selector: "Tháng 8/2026"

- Income card: "Thu nhập"

- Expense card: "Chi tiêu"

- Balance card: "Số dư"

Example values:

Thu nhập: 58.035.000 ₫

Chi tiêu: 1.035.000 ₫

Số dư: 57.000.000 ₫

Add a monthly budget card:

"Ngân sách tháng"

Ngân sách: 50.000.000 ₫

Đã dùng: 1.035.000 ₫

Còn lại: 48.965.000 ₫

Show a visual progress indicator.

Below it show:

"Giao dịch gần đây"

Group transactions by date.

Example:

Thứ Ba, 18/08/2026

Lương chồng

+33.000.000 ₫

Vietcombank

Chủ Nhật, 02/08/2026

Lương chồng

+25.035.000 ₫

Vietcombank

Thứ Bảy, 01/08/2026

Ăn uống

Ốc / 우렁집

-1.035.000 ₫

Tiền mặt

ADD TRANSACTION:

When pressing +, open a transaction entry screen.

Tabs:

Chi tiêu

Thu nhập

Chuyển khoản

Allow the user to:

- enter amount

- select category

- select date and time

- select wallet/account

- add a note

- choose whether transaction is included in statistics

Create a custom numeric keypad.

Include:

0-9

00

backspace

+

-

×

÷

AC

Xong

Allow calculations while entering an amount.

CATEGORIES:

Include initial categories:

Ăn uống

Đi lại

Sinh hoạt

Hóa đơn

Mua sắm

Giải trí

Sức khỏe

Giáo dục

Khác

Users must be able to add, edit and delete categories.

ASSETS:

Create an asset screen showing:

- Tài sản ròng

- Tổng tài sản

- Tổng nợ

Allow multiple accounts such as:

Tiền mặt

Ngân hàng

Ví điện tử

Users can create their own accounts.

Each account must have its own currency.

SUPPORTED CURRENCIES:

VND (₫)

KRW (₩)

Default currency: VND.

Do NOT automatically force Korean Won based on device language or region.

Allow transfers between accounts.

Transfers should not count as income or expense.

STATISTICS:

Create monthly and yearly views.

Show:

- total income

- total expenses

- balance

- spending calendar

- daily spending trend

- spending by category

- income by category

SETTINGS:

Include:

Danh mục

Ngân sách

Giao dịch định kỳ

Quản lý tài khoản

Tiền tệ

Ngôn ngữ

Currency options:

VND ₫

KRW ₩

Language architecture should support:

Tiếng Việt

한국어

Use Vietnamese as the default.

DATA:

For the first prototype, persist user data locally so refreshing or reopening the PWA does not erase transactions.

ARCHITECTURE:

Build the project so that a cloud database, authentication and multi-device synchronization can be added later without redesigning the whole application.

PWA:

Make the application installable as a Progressive Web App on iPhone.

Configure:

- web app manifest

- standalone display

- mobile viewport

- app name

- theme color

- home screen icon support

Optimize specifically for iPhone screens and Safari.

IMPORTANT:

This is a functional prototype, not just a visual mockup.

Navigation, adding transactions, calculations, wallets, budgets and currency selection should actually work.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f237347-669d-4c3a-8b52-c676bd82a24c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
