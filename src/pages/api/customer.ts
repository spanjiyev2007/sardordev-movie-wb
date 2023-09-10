// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

interface Data {
    message?: string;
}

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16'
})

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { method } = req

    if (method == 'POST') {
        try {
            const { email, user_id } = req.body
            await stripe.customers.create({ email, metadata: {user_id} })
            return res.status(200).json({message: 'Success'})
        } catch (error){
            const results = error as Error
            return res.status(400).json({message: results.message})
        }
    } else {
        return res.status(400).json({ message: 'Method not allowed' })
    }
}
