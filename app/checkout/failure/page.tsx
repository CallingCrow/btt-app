import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FailurePage = () => {
  return (
    <div>
      <main>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-6">
              <CircleAlert size={38} color="red"></CircleAlert>
              <h4>Payment Failed</h4>
            </div>
            <p className="mt-0 mb-6">Please try again or contact us.</p>
            <Link href="/">
              <Button size={"lg"}>Return</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FailurePage;
