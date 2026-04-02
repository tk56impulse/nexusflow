"use client";

export default function CalendarEmbed() {
  // 本来は Google カレンダーの設定画面から取得する「埋め込み用URL」を使います。
  // ここでは一旦、日本の祝日を表示する公開カレンダーをサンプルに入れています。
  const calendarSrc = "https://calendar.google.com/calendar/embed?src=ja.japanese%23holiday%40group.v.calendar.google.com&ctz=Asia%2FTokyo";

  return (
    <div className="w-full h-full min-h-[500px] bg-white">
      <iframe
        src={calendarSrc}
        style={{ border: 0 }}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        title="Google Calendar"
        className="opacity-90 hover:opacity-100 transition-opacity"
      ></iframe>
    </div>
  );
}