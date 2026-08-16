import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CancelPage = () => {
  return (
    <div>
      <main>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-6">
              <CircleAlert size={38} color="red"></CircleAlert>
              <h4>Payment Canceled</h4>
            </div>
            <p className="mt-0 mb-6">
              If this is a mistake, please try again or contact us.
            </p>
            <Link href="/">
              <Button size={"lg"}>Return</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CancelPage;
