import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
	} catch (e) {
		console.error('Error creating user:', e);
	} finally {
		await prisma.$disconnect();
	}
}

main();
