export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const params = req.nextUrl.searchParams;
	// // https://api.adsbdb.com/v0/aircraft/a01112?callsign=AAL3
	const url = `${ process.env.NEXT_PUBLIC_ADSBDB_BASE_URL }/v0/aircraft/${ params.get('icao24') }?callsign=${ params.get('callsign') }`;

  try {
    const response = await fetch(url);
    const flight_details = await response.json();

    return NextResponse.json({ flight_details: flight_details.response }, { status: 200 })
  } catch (error) {
  	console.log('error: %o', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }	   
}
