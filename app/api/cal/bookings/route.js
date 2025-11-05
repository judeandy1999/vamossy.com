import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    console.log("Fetching all bookings from Cal.com");

    const res = await fetch(`https://api.cal.com/v2/bookings?limit=50`, {
      headers: {
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        "cal-api-version": "v2",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Cal.com API error:", errorText);
      return NextResponse.json(
        {
          error: "Failed to fetch bookings from Cal.com",
          details: errorText,
          status: res.status,
        },
        { status: 500 }
      );
    }

    const responseData = await res.json();
    console.log("Fetched bookings data:", responseData);

    const bookings = responseData?.data?.bookings || responseData?.bookings || [];

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
