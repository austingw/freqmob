"use server";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  console.log(params.username);
  return <div></div>;
}
