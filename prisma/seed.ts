import "dotenv/config";
// import { Role } from '@prisma/client';
import { auth } from "../lib/auth"; // Import our auth instance
import { prisma } from "../lib/prisma";

async function main() {
    const email = 'admin@signalforge.com';

    // Check omitted
    const existingUser = null;

    // Force delete to ensure fresh hash on re-seed
    try { await prisma.user.delete({ where: { email } }); } catch { }
    const user = null;

    if (!user) {
        console.log('Creating super admin via Better Auth API...');

        // We strive to use the official API to ensure hashing is correct.
        // However, `signUpEmail` is a public endpoint essentially. 
        // It might return session headers.

        try {
            const res = await auth.api.signUpEmail({
                body: {
                    email,
                    password: 'admin123',
                    name: 'Super Admin',
                },
                asResponse: false // we want the object properly?
            });

            // After creation, we need to promote to ADMIN.
            // `signUpEmail` creates a user with default role (USER).
            // So we update it.
            if (res?.user) {
                await prisma.user.update({
                    where: { id: res.user.id },
                    data: { role: 'ADMIN' as any }
                });
                console.log('Super Admin user created and promoted.');
            } else {
                console.error("Failed to create user via API, response empty:", res);
            }
        } catch (e) {
            console.error("Error creating user via API:", e);
            // Fallback: If API fails (e.g. checks request context), 
            // We might be forced to configure hashing or manual insert.
            process.exit(1);
        }


    }
}

main()
    .then(async () => {
        // await prisma.$disconnect() // Managed by lib?
    })
    .catch(async (e) => {
        console.error(e)
        process.exit(1)
    })
