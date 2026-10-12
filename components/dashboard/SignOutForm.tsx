import { Button } from "@/components/ui";
import { signOut } from "@/lib/auth";

const SignOutForm = () => {
  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/dashboard/login" });
  }

  return (
    <form action={signOutAction}>
      <Button type="submit" variant="secondary" size="sm">
        Sign out
      </Button>
    </form>
  );
};

export default SignOutForm;
