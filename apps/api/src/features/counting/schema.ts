import { type Document, Schema } from 'mongoose';
import { database } from '@/shared/database';
import { standardToJSON } from '@/shared/mongoose-transforms';

// Counter interface extending Document
export interface Counter extends Document {
  name: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const CounterSchema = new Schema<Counter>(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'counters',
    toJSON: standardToJSON,
  }
);

// Export the model
export const CounterModel = database.model<Counter>('counter', CounterSchema);
export { CounterSchema };
