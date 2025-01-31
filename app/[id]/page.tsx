import { notFound } from "next/navigation";

import Editor from "components/Editor";

import { prisma } from "lib/prisma";
import { getSession } from "lib/auth";

import type { Metadata } from "next";

async function getSnippet(id: string) {
  return await prisma.snippet.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      code: true,
      settings: true,
      userId: true,
      views: {
        select: {
          count: true,
        },
      },
    },
  });
}

async function increaseViewCount(id: string) {
  return await prisma.view.update({
    where: {
      snippetId: id,
    },
    data: {
      count: {
        increment: 1,
      },
    },
    select: {
      count: true,
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const partialSnippet = await getSnippet(params.id);

  return {
    title: !partialSnippet ? "404" : partialSnippet?.title ?? "Untitled",
    description: "Yet another code sharing app...",
    openGraph: {
      title: !partialSnippet ? "404" : partialSnippet?.title ?? "Untitled",
      description: "Yet another code sharing app...",
      url: `https://shade.dragi.me/${params.id}`,
      siteName: "shade - Share some code",
      images: [
        {
          url: "https://shade.dragi.me/opengraph-image.png",
          width: 1200,
          height: 600,
        },
      ],
      locale: "en-US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: !partialSnippet ? "404" : partialSnippet?.title ?? "Untitled",
      creator: "@dragidavid",
      description: "Yet another code sharing app...",
      images: ["https://shade.dragi.me/opengraph-image.png"],
    },
    themeColor: "#000",
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

  const partialSnippet = await getSnippet(params.id);

  let views;

  if (partialSnippet) {
    views =
      session?.user?.id !== partialSnippet.userId
        ? await increaseViewCount(params.id)
        : partialSnippet.views;
  }

  const editable = session?.user?.id === partialSnippet?.userId;
  const isAuthenticated = !!session;

  if (!partialSnippet) {
    notFound();
  }

  return (
    <Editor
      partialSnippet={partialSnippet}
      views={views?.count}
      editable={editable}
      isAuthenticated={isAuthenticated}
    />
  );
}
