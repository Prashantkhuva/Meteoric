import { NextResponse } from "next/server"

const CAL_API = "https://api.cal.com/v2"

export async function GET() {
  const key = process.env.CALCOM_API_KEY
  if (!key) {
    return NextResponse.json({ error: "CALCOM_API_KEY not set" }, { status: 500 })
  }

  try {
    const res = await fetch(`${CAL_API}/bookings`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Cal.com API error: ${res.status}` }, { status: res.status })
    }

    const json = await res.json()
    return NextResponse.json({ bookings: json.data || [] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
