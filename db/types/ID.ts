import { bigint, customType } from 'drizzle-orm/mysql-core';
import { randomBytes } from 'crypto';

export const _ID = customType<{
    data: string;
    notNull: true;
    default: true;
}>(
    {
        dataType() {
            return 'bigint';
        },
        fromDriver(value: unknown): string {
            if (typeof value === 'undefined' || value === null) {
                // Generate a random 32-bit integer
                return randomBytes(4).readUInt32BE(0).toString();
            }
            return value.toString();
        },
        toDriver(value: string): string {
            return value;
        }
    },
);

export const ID = (name: string) => bigint(name, { mode: "number", unsigned: true }).unique().notNull()
    .$defaultFn(() => {
        return randomBytes(4).readUInt32BE(0);
    });

export const dID = (name: string) => bigint(name, { mode: "number", unsigned: true });
