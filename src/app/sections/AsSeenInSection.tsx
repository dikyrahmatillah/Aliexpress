export default function AsSeenInSection() {
  const mediaLogos = [
    { name: "ABC", width: 60 },
    { name: "The Australian", width: 120 },
    { name: "Sydney Morning Herald", width: 100 },
    { name: "Good Housekeeping", width: 80 },
    { name: "Better Homes & Gardens", width: 100 },
    { name: "Vogue Living", width: 90 },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          As seen in
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-60">
          {mediaLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              {/* Placeholder for media logos - in a real implementation, these would be actual logo images */}
              <div
                className="bg-gray-200 rounded flex items-center justify-center text-gray-600 font-semibold text-sm"
                style={{ width: `${logo.width}px`, height: "40px" }}
              >
                {logo.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
