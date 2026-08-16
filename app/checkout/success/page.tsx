import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div>
      <main>
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-6">
              <CircleCheck size={38} color="green"></CircleCheck>
              <h4>Payment Successful!</h4>
            </div>
            <p className="mt-0 mb-6">
              Your order will be ready in 10-15 minutes.
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

export default SuccessPage;
