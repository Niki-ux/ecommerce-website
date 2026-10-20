export default function AnnouncementBar() {
  const offers = [
    "LIMITED-TIME DEALS",
    "SPECIAL OFFERS",
    "SHOP NOW ↗",
    "DON'T MISS OUT",
  ];

  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        {[1, 2].map((copy) => (
          <div className="announcement-group" key={copy}>
            {offers.map((offer) => (
              <span className="announcement-item" key={offer}>
                {offer}
                <span className="announcement-star">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}