import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "../../theme";
import Providers from "@/app/providers";
import { Notifications } from "@mantine/notifications";
import FMAppShell from "@/components/FMAppShell";
import { validateRequest } from "@/db/auth";
import { getProfileFromUserId } from "@/utils/operations/userDbOperations";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreqMob",
  description: "A platform for artists.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await validateRequest();
  const profile = user.user && (await getProfileFromUserId(user.user.id))?.[0];

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications />
          <Providers>
            <FMAppShell user={user} profile={profile}>
              {children}
            </FMAppShell>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
