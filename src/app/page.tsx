export default function Home() {
  return (
    <div className="text-center py-xxl">
      <h1 className="text-h1 text-text mb-md">Welcome to Recycly</h1>
      <p className="text-body text-muted mb-xl">
        Making recycling rewarding for everyone in Nigeria.
      </p>
      <div className="flex flex-col sm:flex-row gap-md justify-center">
        <button className="bg-primary text-page px-lg py-md rounded-base hover:bg-primary-dark transition-colors">
          Get Started
        </button>
        <button className="border border-border text-text px-lg py-md rounded-base hover:bg-background transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}
