import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const firstLetter = user.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <main className="profile-page">
      <div className="profile-page-container">

        <div className="profile-page-heading">
          <p>YOUR ZOVA ACCOUNT</p>
          <h1>My Profile</h1>
          <span>Manage your account information.</span>
        </div>

        <div className="profile-card">

          <div className="profile-big-avatar">
            {firstLetter}
          </div>

          <div className="profile-details">

            <div className="profile-detail">
              <span className="profile-detail-label">
                Name
              </span>

              <strong>
                {user.name}
              </strong>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-label">
                Email
              </span>

              <strong>
                {user.email}
              </strong>
            </div>

            <div className="profile-detail">
              <span className="profile-detail-label">
                Account
              </span>

              <strong>
                ZOVA Member
              </strong>
            </div>

          </div>

        </div>

        <div className="profile-actions">

          <button
            type="button"
            className="profile-orders-button"
            onClick={() => navigate("/orders")}
          >
            View My Orders →
          </button>

          <button
            type="button"
            className="profile-back-button"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

        </div>

      </div>
    </main>
  );
}

export default Profile;