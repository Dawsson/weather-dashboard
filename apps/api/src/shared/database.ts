import mongoose from 'mongoose';
import { env } from '@/env';

mongoose.connect(env.DATABASE_URL);

export const database = mongoose.connection;

database.once('open', () => {
  // Database connection successful
});

database.on('error', (_error) => {
  // Database connection error - handled by mongoose internally
});
