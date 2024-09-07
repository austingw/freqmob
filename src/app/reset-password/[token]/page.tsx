import PasswordResetForm from "@/components/PasswordResetForm";

export default async function Page({ params }: { params: { token: string } }) {
  console.log(params.token);
  return (
    <div>
      <PasswordResetForm token={params.token} />{" "}
    </div>
  );
}
