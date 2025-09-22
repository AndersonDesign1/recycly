import { TRPCTest } from '@/components/trpc-test';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">tRPC Backend Test</h1>
      <TRPCTest />
    </div>
  );
}
