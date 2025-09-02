import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import { imagesURL } from "../api/index.js";
import { getStoredHomeData } from "../api/home.js";
import GlobalLoader from "../components/GlobalLoader.jsx";

// Helper to build Cloudflare image URL keys into full URLs
const buildImg = (key) => {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return key;
  return `${imagesURL}${key}/public`;
};

// Helper function to get activity colors
const getActivityColor = (type) => {
  switch (type) {
    case "Journey":
      return "#556BB9";
    case "Scavenger Hunt":
      return "#A979E8";
    case "Giveaway":
      return "#81BBBC";
    default:
      return "#676361";
  }
};

export default function Giveaways() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [giveaways, setGiveaways] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadGiveaways = async () => {
      try {
        setLoading(true);
        const homeData = await getStoredHomeData();

        if (homeData?.AllAcivity) {
          setGiveaways(homeData.AllAcivity);
        }
      } catch (error) {
        console.error("Error loading Giveaways:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGiveaways();
  }, []);

  // Filter products based on search term
  const filteredGiveaways = giveaways.filter(
    (giveaway) =>
      giveaway.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      giveaway.giveaway_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <GlobalLoader visible={true} />;
  }

  return (
    <AppLayout>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "16px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: 24, color: "#1E1F24" }}>
            Giveaways
          </h1>
        </div>

        {/* Search Bar */}
        {/* <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search giveaways..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <span style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 18,
            color: '#6B7280'
          }}>
            🔍
          </span>
        </div> */}
      </div>

      {/* Giveaways Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {filteredGiveaways.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 64, marginBottom: 16 }}>📦</span>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, color: "#1E1F24" }}>
              {searchTerm ? "No giveaways found" : "No giveaways available"}
            </h3>
            <p style={{ margin: 0, fontSize: 16, color: "#6B7280" }}>
              {searchTerm
                ? "Try a different search term"
                : "Check back later for new giveaways"}
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            {/* <div style={{ marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                {searchTerm ? `${filteredGiveaways.length} giveaways found` : `${giveaways.length} giveaways available`}
              </p>
            </div> */}

            {/* Giveaways Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 20,
              }}
            >
              {filteredGiveaways.map((activity, index) => {
                const activityColor = getActivityColor(activity?.activity_type);
                const img = buildImg(activity?.image || activity?.logo);
                const boothLabel =
                  activity?.booth_name ||
                  activity?.zone ||
                  activity?.stage ||
                  "";
                return (
                  <div
                    key={index}
                    style={{
                      background: "#F6F7FF",
                      border: "1px solid #e5e7eb",
                      borderRadius: 24,
                      overflow: "hidden",
                      padding: 16,
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 20,
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={activity.title || "Activity"}
                          style={{
                            maxWidth: "95%",
                            maxHeight: "95%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 40 }}>🎮</span>
                      )}
                    </div>

                    {/* Title + Booth badge */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: 24,
                          color: "#1E1F24",
                          fontWeight: 800,
                          lineHeight: 1.25,
                        }}
                      >
                        {activity.title || "Activity Title"}
                      </h4>
                      {boothLabel && (
                        <div
                          style={{
                            padding: "6px 10px",
                            background: "#E4EBFF",
                            color: "#3F57D0",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {boothLabel}
                        </div>
                      )}
                    </div>

                    {/* Type chip */}
                    <div style={{ marginTop: 12, marginBottom: 16 }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "8px 14px",
                          borderRadius: 24,
                          border: `2px solid ${activityColor}`,
                          color: activityColor,
                          background: `${activityColor}15`,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {activity.activity_type || "Activity"}
                      </span>
                    </div>

                    {/* View Details button */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button
                        style={{
                          width: "100%",
                          padding: "12px 18px",
                          background: "transparent",
                          color: "#3F57D0",
                          border: "3px solid #C9D3FF",
                          borderRadius: 999,
                          fontSize: 18,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // Navigate to giveaway details page
                          navigate('/giveaway-detail', {
                            state: {
                              giveawayData: activity,
                              fromActivities: false
                            }
                          });
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
