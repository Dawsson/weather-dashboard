import { type Document, Schema } from 'mongoose';
import { database } from '@/shared/database';
import { standardToJSON } from '@/shared/mongoose-transforms';

// Favorite city interface
export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  addedAt: Date;
}

// User interface extending Document
export interface User extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  favoriteCities: FavoriteCity[];
  createdAt: Date;
  updatedAt: Date;
}

// Favorite city schema
const FavoriteCitySchema = new Schema<FavoriteCity>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: false },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    addedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    image: { type: String, required: false },
    favoriteCities: { type: [FavoriteCitySchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'user',
    toJSON: standardToJSON,
  }
);

// Export the model
export const UserModel = database.model<User>('user', UserSchema);
export { UserSchema };
