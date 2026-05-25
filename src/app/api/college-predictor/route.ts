import { NextResponse } from 'next/server';

const deprecatedResponse = {
  error: {
    code: 'DEPRECATED_ROUTE',
    message:
      'College Predictor is now served by the paid backend API. Use /api/v1/predictor endpoints.',
  },
};

export async function GET() {
  return NextResponse.json(deprecatedResponse, { status: 410 });
}

export async function POST() {
  return NextResponse.json(deprecatedResponse, { status: 410 });
}
