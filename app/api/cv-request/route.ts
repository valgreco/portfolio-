import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company } = await req.json();

    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Where the "someone downloaded your CV" notification is sent (kept out of
    // source so the public repo doesn't leak a personal address).
    const NOTIFY_TO = process.env.CONTACT_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !NOTIFY_TO) {
      // Structure is in place; email sending activates once the key is set.
      console.warn("RESEND_API_KEY or CONTACT_EMAIL not set: skipping notification email.");
      return NextResponse.json({ ok: true, notified: false });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        reply_to: email,
        subject: `CV download: ${name}${company ? ` (${company})` : ""}`,
        text: `Someone just downloaded your CV.\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\n\nTime: ${new Date().toISOString()}`,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
      // Don't block the download if the notification fails.
      return NextResponse.json({ ok: true, notified: false });
    }

    return NextResponse.json({ ok: true, notified: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
