import Link from "next/link";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="dark flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1>HOMEPAGE</h1>
        <Button asChild>
          <Link href="/authentication">Ir para Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
