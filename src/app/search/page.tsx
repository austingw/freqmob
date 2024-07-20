export default async function Page({
  searchParams,
}: {
  searchParams: { term: string };
}) {
  return <div>Search Results {searchParams.term}</div>;
}
