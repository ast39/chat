"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    userId: 'cbaf539c-0396-4c63-8b7c-ba01faf532a7',
                    userName: 'Demo user 1',
                    userAvatar: null,
                },
            });
        });
        console.log('User created successfully.');
    }
    catch (e) {
        console.error('Error creating user:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=seed.js.map