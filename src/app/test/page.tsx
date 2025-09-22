import { TRPCTest } from "@/components/trpc-test";

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-bold text-3xl">tRPC Backend Test</h1>
      <TRPCTest />
    </div>
  );
}
