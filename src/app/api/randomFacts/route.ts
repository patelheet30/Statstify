import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    const filePath = path.join(process.cwd(), 'src/data/randomFacts.txt');
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const facts = data.split('\n').filter(fact => fact.trim() !== '');
        return NextResponse.json({ facts });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read facts file' }, { status: 500 });
    }
}