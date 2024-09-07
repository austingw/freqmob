export default async function Page({ params }: { params: { token: string } }) {
  console.log(params.token);
  return <div />;
}
