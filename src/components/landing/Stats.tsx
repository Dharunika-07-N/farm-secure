const stats = [
  { value: "10,000+", label: "Farms Protected" },
  { value: "98%", label: "Disease Detection Rate" },
  { value: "24/7", label: "Alert Monitoring" },
  { value: "45+", label: "Countries Supported" },
];

export function Stats() {
  return (
    <section className="bg-muted/50 py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-extrabold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
