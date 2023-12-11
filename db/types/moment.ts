import { customType } from 'drizzle-orm/mysql-core';

export const moment = customType<{
    data: number;
    notNull: true;
    default: true;
}>(
    {
        dataType() {
            return 'bigint';
        },
        fromDriver(value: unknown): number {
            return Number(value);
        },
        toDriver(value: number | Date): number {
            if (value instanceof Date) {
                return value.getTime();
            }
            return Number(value);
        }
    },
);