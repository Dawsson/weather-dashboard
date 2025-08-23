import type { Document } from 'mongoose';

/**
 * Standard toJSON transform for Mongoose schemas
 * - Converts _id to id as string
 * - Converts all ObjectId references to strings
 * - Preserves Date objects
 */
export const standardToJSON = {
  transform: (_doc: Document, ret: any) => {
    // Convert _id to id and ensure it's a string
    if (ret._id) {
      ret.id = ret._id.toString();
      // biome-ignore lint/performance/noDelete: don't worry
      delete ret._id;
    }

    // Convert all ObjectId fields to strings
    for (const key in ret) {
      if (ret[key] && ret[key]._bsontype === 'ObjectId') {
        ret[key] = ret[key].toString();
      }
      // Handle arrays of ObjectIds
      else if (Array.isArray(ret[key])) {
        ret[key] = ret[key].map((item: any) =>
          item && item._bsontype === 'ObjectId' ? item.toString() : item
        );
      }
    }

    return ret;
  },
  // Ensure virtuals are included
  virtuals: true,
  // Don't convert dates to strings
  flattenObjectIds: false,
};
