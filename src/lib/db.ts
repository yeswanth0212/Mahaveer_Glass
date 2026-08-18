import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MemoryStore {
  admin: any[];
  products: any[];
  categories: any[];
  enquiries: any[];
  gallery: any[];
  businessInfo: any;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db_fallback.json');

export function getFallbackData(): MemoryStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial: MemoryStore = {
      admin: [],
      products: [],
      categories: [],
      enquiries: [],
      gallery: [],
      businessInfo: null
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {
      admin: [],
      products: [],
      categories: [],
      enquiries: [],
      gallery: [],
      businessInfo: null
    };
  }
}

export function saveFallbackData(data: MemoryStore) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (MONGODB_URI) {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 2000,
      };
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m).catch((err) => {
        console.warn('MongoDB connection failed, using JSON fallback store:', err.message);
        return null;
      });
    }
    cached.conn = await cached.promise;
    if (cached.conn) return cached.conn;
  }
  return null;
}
