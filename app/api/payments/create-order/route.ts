import { NextResponse } from 'next/server';

// Fix for: Cannot find name 'require' error
declare const require: any;

export async function POST(req: Request) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    // Check environment variables first
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
       console.warn('Razorpay keys missing. Returning mock order.');
       return NextResponse.json({
           id: `order_mock_${Date.now()}`,
           currency: 'INR',
           amount: amount * 100,
           status: 'created'
       });
    }

    let Razorpay;
    try {
        // Note: In a real project, ensure `razorpay` is installed: npm install razorpay
        Razorpay = require('razorpay');
    } catch (e) {
        console.warn('Razorpay package missing. Using mock class.');
        Razorpay = class {
            constructor(options: any) {}
            orders = {
                create: async (options: any) => ({
                    id: `order_mock_no_pkg_${Date.now()}`,
                    currency: options.currency,
                    amount: options.amount,
                    status: 'created'
                })
            }
        };
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
    };

    const order = await instance.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}