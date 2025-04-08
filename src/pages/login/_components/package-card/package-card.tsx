interface PackageCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function PackageCard({
  title,
  price,
  features,
  highlighted,
}: PackageCardProps) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlighted
          ? "bg-white text-blue-600 shadow-lg"
          : "bg-white/20 backdrop-blur-sm"
      }`}
    >
      <h3 className="font-bold text-lg">{title}</h3>
      <p
        className={`font-medium ${
          highlighted ? "text-blue-500" : "text-white"
        } mb-2`}
      >
        {price}
      </p>
      <ul className="text-sm space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="text-xs">✓</span> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
