import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateScriptPage() {
  const scriptId = crypto.randomUUID();

  return (
    <main className="flex h-screen flex-col items-center pt-16">
      <Button asChild>
        <Link href={`/dashboard/create-script/${scriptId}`}>
          Create new script
        </Link>
      </Button>
    </main>
  );
}
