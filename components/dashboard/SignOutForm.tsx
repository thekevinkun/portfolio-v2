import { Button } from "@/components/ui";
import { signOutAdmin } from "@/lib/dashboard/actions/auth";

const SignOutForm = () => {
  return (
    <form action={signOutAdmin}>
      <Button type="submit" variant="secondary" size="sm">
        Sign out
      </Button>
    </form>
  );
};

export default SignOutForm;
