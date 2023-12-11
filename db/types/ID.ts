import { bigint, customType, serial } from 'drizzle-orm/mysql-core';

const _ID = customType<{
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
                const bytes = new Uint32Array(1);
                crypto.getRandomValues(bytes);
                return bytes[0].toString();
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
        const bytes = new Uint32Array(1);
        crypto.getRandomValues(bytes);
        return bytes[0]
    });

export const dID = (name: string) => bigint(name, { mode: "number", unsigned: true })