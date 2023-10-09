import React from "react";
import getUser from "@/lib/getUser";
import getUserPosts from "@/lib/getUserPosts";
import { Suspense } from "react";
import UserPosts from "./components/UserPosts";
import Link from "next/link";
import type { Metadata } from "next";
import getAllUsers from "@/lib/getAllUsers";

import { notFound } from "next/navigation";

type Params = {
    params: {
        userId: string;
    };
};

export async function generateMetadata({
    params: { userId },
}: Params): Promise<Metadata> {
    const userData: Promise<User> = getUser(userId);
    const user: User = await userData;

    if (!user) {
        return {
            title: "User Not Found",
        };
    }

    return {
        title: user.name,
        description: `This is ${user.name}'s page.`,
    };
}

export default async function UserPage({ params: { userId } }: Params) {
    const userData: Promise<User> = getUser(userId);
    const userPostsData: Promise<Post[]> = getUserPosts(userId);

    const user = await userData;

    if (!user) {
        notFound();
    }

    return (
        <>
            <Link href="/">Home</Link>
            <br />
            <Link href="/users">Users</Link>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<p>Loading...</p>}>
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    );
}

export async function generateStaticParams() {
    const usersData: Promise<User[]> = getAllUsers();
    const users = await usersData;

    return users.map((user) => ({ userId: user.id.toString() }));
}
