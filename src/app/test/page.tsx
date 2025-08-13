export default function StickyTest() {
  return (
    <>
      <div className="bg-blue-600 text-white py-2 text-center">
        Announcement
      </div>
      <div className="sticky top-0 z-40 bg-white shadow py-3 text-center">
        I should stick
      </div>
      <div style={{ height: "200vh" }} className="bg-gray-50"></div>
    </>
  );
}
