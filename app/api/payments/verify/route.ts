
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
        // Demo mode bypass
        return NextResponse.json({ success: true, message: 'Demo Verification Successful' });
    }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
