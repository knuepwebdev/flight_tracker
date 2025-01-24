export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

	const url = `${process.env.NEXT_PUBLIC_OPENSKY_BASE_URL}/states/all?lamin=${ params.get('latitude_min') }&lomin=${ params.get('longitude_min') }&lamax=${ params.get('latitude_max') }&lomax=${ params.get('longitude_max') }`;
  
  const headers = new Headers({
    'Authorization': `Basic ${btoa(process.env.NEXT_PUBLIC_OPENSKY_USERNAME + ':' + process.env.NEXT_PUBLIC_OPENSKY_PASSWORD)}`
  })

  const enRoute = (flight) => {
    // Returns flights which are not on the ground
    return !flight[8];
  };  

  try {
    const response = await fetch(url, { headers: headers });
    const data = await response.json();

    return NextResponse.json({ flights: data.states.filter(enRoute) })
  } catch (error) {
    console.log('error: %o', error);
    return NextResponse.json({ error: error.message }, { status: 500 })
  }	   
}
