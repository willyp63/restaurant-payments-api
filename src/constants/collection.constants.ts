export const DB_NAME = process.env.MONGODB_URI ? '' : 'restaurant-payments';
export const DB_BASE_URL =  process.env.MONGODB_URI || 'mongodb://localhost:27017';

export const TABLE_COLLECTION_NAME = 'tables';
export const TABLE_ITEM_COLLECTION_NAME = 'table-items';
export const TABLE_JOIN_COLLECTION_NAME = 'table-joins';
export const TABLE_LEAVE_COLLECTION_NAME = 'table-leaves';
export const TABLE_ITEM_PAY_COLLECTION_NAME = 'table-item-pays';
export const USER_COLLECTION_NAME = 'users';
