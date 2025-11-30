import React, { useState } from "react";
import "./index.css";

// Helper function to get team logo URL (placeholder URLs - replace with actual team logos)
const getTeamLogo = (teamName) => {
  const logoMap = {
    "الأخضر": "https://via.placeholder.com/80x80/27ae60/ffffff?text=الأخضر",
    "الهلال": "https://via.placeholder.com/80x80/ffffff/000000?text=🌙",
    "الاتفاق": "https://via.placeholder.com/80x80/2980b9/ffffff?text=الاتفاق",
    "الاتحاد": "https://via.placeholder.com/80x80/ffffff/000000?text=⚽",
    "النصر": "https://via.placeholder.com/80x80/ffd700/000000?text=النصر",
    "الشباب": "https://via.placeholder.com/80x80/000000/ffffff?text=⚡",
  };
  return logoMap[teamName] || "https://via.placeholder.com/80x80/667eea/ffffff?text=Team";
};

const MOCK_MATCHES = [
  {
    id: 1,
    homeTeam: "الأخضر",
    homeTeamIcon: "🟢",
    homeTeamLogo: "/Alahli.png",
    awayTeam: "الهلال",
    awayTeamIcon: "🌙",
    awayTeamLogo: "/alhilal.png",
    date: "2026-02-17",
    stadium: "Red Arena",
    price: 50,
    time: "21:00",
  },
  {
    id: 2,
    homeTeam: "الاتفاق",
    homeTeamIcon: "🔵",
    homeTeamLogo: "/%20Al-Ettifaq.png",
    awayTeam: "الاتحاد",
    awayTeamIcon: "⚽",
    awayTeamLogo: "/Al-Ittihad.png",
    date: "2026-03-02",
    stadium: "Green Arena",
    price: 75,
    time: "20:30",
  },
  {
    id: 3,
    homeTeam: "النصر",
    homeTeamIcon: "🟡",
    homeTeamLogo: "/Al-Nassr.png",
    awayTeam: "الشباب",
    awayTeamIcon: "⚡",
    awayTeamLogo: "/AlShabab.png",
    date: "2026-04-10",
    stadium: "Blue Arena",
    price: 60,
    time: "19:00",
  },
];

export default function App() {
  const [screen, setScreen] = useState("login"); // login | matches | matchDetails | confirm | payment | success | myTickets
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [seatInfo, setSeatInfo] = useState({
    zone: "",
    areaNumber: "",
  });
  const [tickets, setTickets] = useState([]);

  const handleLogin = () => {
    setScreen("matches");
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setScreen("matchDetails");
  };

  const handleSeatChange = (field, value) => {
    setSeatInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoConfirm = () => {
    setScreen("confirm");
  };

  const handleConfirmBooking = () => {
    if (!selectedMatch) return;

    const newTicket = {
      id: Date.now(),
      match: selectedMatch,
      seatInfo,
    };

    setTickets((prev) => [...prev, newTicket]);
    setScreen("payment");
  };

  const handlePaymentSuccess = () => {
    setScreen("success");
  };

  const handleGoToMyTickets = () => {
    setScreen("myTickets");
  };

  const currentPrice = selectedMatch ? selectedMatch.price : 0;

  return (
    <div className="app-root">
      <div className="phone-frame">
        {/* Top bar with app title + menu */}
        {screen !== "login" && (
          <header className="top-bar">
            <button
              className="icon-button"
              onClick={() => setSideMenuOpen(true)}
            >
              ☰
            </button>
            <div className="top-bar-title">
              <img
                src="/aboor-logo.png"
                alt="Aboor"
                className="top-bar-logo"
              />
            </div>
          </header>
        )}

        {/* SCREENS */}
        {screen === "login" && <LoginScreen onLogin={handleLogin} />}

        {screen === "matches" && (
          <MatchListScreen
            matches={MOCK_MATCHES}
            onSelectMatch={handleSelectMatch}
          />
        )}

        {screen === "matchDetails" && selectedMatch && (
          <MatchDetailsScreen
            match={selectedMatch}
            seatInfo={seatInfo}
            onSeatChange={handleSeatChange}
            onNext={handleGoConfirm}
            onBack={() => setScreen("matches")}
          />
        )}

        {screen === "confirm" && selectedMatch && (
          <ConfirmScreen
            match={selectedMatch}
            seatInfo={seatInfo}
            price={currentPrice}
            onBack={() => setScreen("matchDetails")}
            onConfirm={handleConfirmBooking}
          />
        )}

        {screen === "payment" && (
          <PaymentScreen
            price={currentPrice}
            onBack={() => setScreen("confirm")}
            onPay={handlePaymentSuccess}
          />
        )}

        {screen === "success" && (
          <SuccessScreen onGoTickets={handleGoToMyTickets} />
        )}

        {screen === "myTickets" && (
          <MyTicketsScreen
            tickets={tickets}
            onBack={() => setScreen("matches")}
          />
        )}

        {/* SIDE MENU OVERLAY */}
        {sideMenuOpen && (
          <SideMenu
            onClose={() => setSideMenuOpen(false)}
            onMyTickets={() => {
              setSideMenuOpen(false);
              setScreen("myTickets");
            }}
            onHome={() => {
              setSideMenuOpen(false);
              setScreen("matches");
            }}
            onLogout={() => {
              setSideMenuOpen(false);
              setScreen("login");
            }}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------- Screens ---------------------- */

function LoginScreen({ onLogin }) {
  return (
    <div className="screen login-screen">
      <div className="nafath-logo">نفاذ</div>
      <label className="field-label">رقم السجل المدني</label>
      <input
        type="text"
        className="input"
        placeholder="رقم السجل المدني"
      />
      <div className="captcha-placeholder">reCAPTCHA</div>
      <button className="primary-button" onClick={onLogin}>
        تسجيل الدخول
      </button>

      <div className="store-links">
        <div className="store-badge">Download on App Store</div>
        <div className="store-badge">Get it on Google Play</div>
      </div>

      <p className="hint-text">
        لا يوجد لديك حساب نفاذ؟ يمكنك تسجيل الدخول باستخدام حساب أبشر.
      </p>
    </div>
  );
}

function MatchListScreen({ matches, onSelectMatch }) {
  return (
    <div className="screen">
      <h2 className="screen-title">المباريات المتاحة</h2>
      <div className="match-list">
        {matches.map((match) => (
          <button
            key={match.id}
            className="match-card"
            onClick={() => onSelectMatch(match)}
          >
            {match.time && (
              <div className="match-time">{match.time}</div>
            )}
            <div className="match-card-content">
              <div className="match-team-section">
                <img 
                  src={match.homeTeamLogo} 
                  alt={match.homeTeam}
                  className="team-logo"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/100x100/667eea/ffffff?text=${encodeURIComponent(match.homeTeamIcon)}`;
                  }}
                />
                <div className="team-name">{match.homeTeam}</div>
              </div>
              
              <div className="match-vs-section">
                <div className="vs-text">VS</div>
              </div>
              
              <div className="match-team-section">
                <img 
                  src={match.awayTeamLogo} 
                  alt={match.awayTeam}
                  className="team-logo"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/100x100/667eea/ffffff?text=${encodeURIComponent(match.awayTeamIcon)}`;
                  }}
                />
                <div className="team-name">{match.awayTeam}</div>
              </div>
            </div>
            <div className="match-meta">
              <span>{match.date}</span>
              <span>{match.stadium}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MatchDetailsScreen({ match, seatInfo, onSeatChange, onNext, onBack }) {
  return (
    <div className="screen">
      <div className="screen-header-with-back">
        <button className="back-button-icon" onClick={onBack}>
          ←
        </button>
        <h2 className="screen-title">تفاصيل المباراة</h2>
      </div>
      <div className="match-header">
        <div className="match-header-team">
          <img 
            src={match.homeTeamLogo} 
            alt={match.homeTeam}
            className="team-logo-large"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/100x100/667eea/ffffff?text=${encodeURIComponent(match.homeTeamIcon)}`;
            }}
          />
          <div className="team-name-large">{match.homeTeam}</div>
        </div>
        <span className="vs-inline-large">VS</span>
        <div className="match-header-team">
          <img 
            src={match.awayTeamLogo} 
            alt={match.awayTeam}
            className="team-logo-large"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/100x100/667eea/ffffff?text=${encodeURIComponent(match.awayTeamIcon)}`;
            }}
          />
          <div className="team-name-large">{match.awayTeam}</div>
        </div>
      </div>

      {/* Match info */}
      <div className="match-info">
        <div className="match-info-item">
          <span className="match-info-icon">📅</span>
          <span className="match-info-label">التاريخ:</span>
          <span className="match-info-value">{match.date}</span>
        </div>
        <div className="match-info-item">
          <span className="match-info-icon">🏟️</span>
          <span className="match-info-label">الملعب:</span>
          <span className="match-info-value">{match.stadium}</span>
        </div>
        {match.time && (
          <div className="match-info-item">
            <span className="match-info-icon">⏰</span>
            <span className="match-info-label">الوقت:</span>
            <span className="match-info-value">{match.time}</span>
          </div>
        )}
      </div>

      {/* Stadium Map */}
      <div className="stadium-map">
        <img 
          src="/image.png" 
          alt="Stadium Seating Chart" 
          className="stadium-image"
        />
      </div>

      {/* Area Selection */}
      <div className="seat-form">
        <label className="field-label">لون المنطقة</label>
        <select
          className="input"
          value={seatInfo.zone}
          onChange={(e) => onSeatChange("zone", e.target.value)}
        >
          <option value="">اختر لون المنطقة</option>
          <option value="Red">أحمر (Red)</option>
          <option value="Yellow">أصفر (Yellow)</option>
          <option value="Green">أخضر (Green)</option>
          <option value="Blue">أزرق (Blue)</option>
          <option value="Pink">وردي (Pink)</option>
          <option value="Orange">برتقالي (Orange)</option>
          <option value="Cyan">سماوي (Cyan)</option>
        </select>

        <label className="field-label">رقم المنطقة</label>
        <select
          className="input"
          value={seatInfo.areaNumber || ""}
          onChange={(e) => onSeatChange("areaNumber", e.target.value)}
        >
          <option value="">اختر رقم المنطقة</option>
          <option value="104">104</option>
          <option value="105">105</option>
          <option value="106">106</option>
          <option value="107">107</option>
          <option value="108">108</option>
          <option value="109">109</option>
          <option value="110">110</option>
          <option value="111">111</option>
          <option value="112">112</option>
          <option value="113">113</option>
          <option value="114">114</option>
          <option value="115">115</option>
          <option value="116">116</option>
          <option value="119">119</option>
          <option value="120">120</option>
          <option value="121">121</option>
          <option value="125">125</option>
          <option value="126">126</option>
          <option value="130">130</option>
          <option value="131">131</option>
          <option value="132">132</option>
          <option value="133">133</option>
          <option value="134">134</option>
          <option value="135">135</option>
          <option value="136">136</option>
          <option value="137">137</option>
          <option value="138">138</option>
          <option value="139">139</option>
          <option value="140">140</option>
          <option value="201">201</option>
          <option value="202">202</option>
          <option value="203">203</option>
          <option value="204">204</option>
          <option value="205">205</option>
          <option value="206">206</option>
          <option value="207">207</option>
          <option value="208">208</option>
          <option value="209">209</option>
          <option value="210">210</option>
          <option value="211">211</option>
          <option value="212">212</option>
          <option value="213">213</option>
          <option value="214">214</option>
          <option value="215">215</option>
          <option value="216">216</option>
          <option value="217">217</option>
          <option value="218">218</option>
          <option value="219">219</option>
          <option value="220">220</option>
          <option value="221">221</option>
          <option value="222">222</option>
          <option value="223">223</option>
          <option value="224">224</option>
          <option value="225">225</option>
          <option value="226">226</option>
        </select>
      </div>

      {/* Price + ticket icon */}
      <div className="price-row">
        <div className="price-text">{match.price} SAR</div>
        <div className="ticket-icon">🎟️</div>
      </div>

      <button className="primary-button" onClick={onNext}>
        NEXT
      </button>
    </div>
  );
}

function ConfirmScreen({ match, seatInfo, price, onBack, onConfirm }) {
  return (
    <div className="screen">
      <h2 className="screen-title">تأكيد الحجز</h2>

      <InfoBox label="المباراة">
        <div className="info-team-row-logos">
          <div className="info-team">
            <img
              src={match.homeTeamLogo || getTeamLogo(match.homeTeam)}
              alt={match.homeTeam}
              className="info-team-logo"
              onError={(e) => {
                e.target.src = getTeamLogo(match.homeTeam);
              }}
            />
            <span>{match.homeTeam}</span>
          </div>
          <span className="vs-inline">VS</span>
          <div className="info-team">
            <img
              src={match.awayTeamLogo || getTeamLogo(match.awayTeam)}
              alt={match.awayTeam}
              className="info-team-logo"
              onError={(e) => {
                e.target.src = getTeamLogo(match.awayTeam);
              }}
            />
            <span>{match.awayTeam}</span>
          </div>
        </div>
      </InfoBox>

      <InfoBox label="التاريخ">{match.date}</InfoBox>

      <InfoBox label="المدرج / المنطقة">
        {seatInfo.zone && seatInfo.areaNumber 
          ? `${seatInfo.zone} - Area ${seatInfo.areaNumber}`
          : "لم يتم اختيار المنطقة"}
      </InfoBox>

      <InfoBox label="المبلغ">{price.toFixed(2)} SAR</InfoBox>

      <div className="button-row">
        <button className="secondary-button" onClick={onBack}>
          رجوع
        </button>
        <button className="primary-button" onClick={onConfirm}>
          تأكيد
        </button>
      </div>
    </div>
  );
}

function PaymentScreen({ price, onBack, onPay }) {
  return (
    <div className="screen payment-screen">
      <h2 className="screen-title">الدفع</h2>

      <div className="payment-price">
        <span className="payment-amount">{price} SAR</span>
        <span className="ticket-icon-large">🎟️</span>
      </div>

      <div className="payment-methods">
        <span>mada</span>
        <span>VISA</span>
        <span>MasterCard</span>
        <span>Apple Pay</span>
        <span>STC Pay</span>
        <span>PayPal</span>
        <span>تمارا</span>
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={onBack}>
          رجوع
        </button>
        <button className="applepay-button" onClick={onPay}>
          Buy with Pay
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ onGoTickets }) {
  return (
    <div className="screen success-screen">
      <h2 className="success-title">تم الحجز</h2>
      <div className="success-emoji">🥳</div>
      <button className="primary-button" onClick={onGoTickets}>
        الذهاب إلى التذاكر
      </button>
    </div>
  );
}

function MyTicketsScreen({ tickets, onBack }) {
  return (
    <div className="screen">
      <h2 className="screen-title">تذاكري</h2>

      {tickets.length === 0 && (
        <p className="hint-text">لا توجد تذاكر حتى الآن.</p>
      )}

      <div className="ticket-list">
        {tickets.map((t) => (
          <div key={t.id} className="ticket-card">
            <div className="ticket-card-content">
              <div className="ticket-card-team">
                <img
                  src={t.match.homeTeamLogo || getTeamLogo(t.match.homeTeam)}
                  alt={t.match.homeTeam}
                  className="ticket-team-logo"
                  onError={(e) => {
                    e.target.src = getTeamLogo(t.match.homeTeam);
                  }}
                />
                <div className="ticket-team-name">{t.match.homeTeam}</div>
              </div>
              <div className="ticket-card-vs">VS</div>
              <div className="ticket-card-team">
                <img
                  src={t.match.awayTeamLogo || getTeamLogo(t.match.awayTeam)}
                  alt={t.match.awayTeam}
                  className="ticket-team-logo"
                  onError={(e) => {
                    e.target.src = getTeamLogo(t.match.awayTeam);
                  }}
                />
                <div className="ticket-team-name">{t.match.awayTeam}</div>
              </div>
            </div>

            <div className="ticket-meta">
              <span>{t.match.stadium}</span>
              <span>{t.match.date}</span>
            </div>

            <div className="ticket-seat-info">
              {t.seatInfo.zone && t.seatInfo.areaNumber
                ? `${t.seatInfo.zone} - Area ${t.seatInfo.areaNumber}`
                : "لم يتم اختيار المنطقة"}
            </div>
            <div className="ticket-actions">
              <button className="secondary-button small">التفاصيل</button>
              <button className="secondary-button small">
                إعادة البيع
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="secondary-button" onClick={onBack}>
        رجوع إلى المباريات
      </button>
    </div>
  );
}

/* ---------------------- Shared components ---------------------- */

function InfoBox({ label, children }) {
  return (
    <div className="info-box">
      <div className="info-label">{label}</div>
      <div className="info-value">{children}</div>
    </div>
  );
}

function SideMenu({ onClose, onMyTickets, onHome, onLogout }) {
  return (
    <div className="side-menu-overlay" onClick={onClose}>
      <div
        className="side-menu"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="side-menu-header">
          <div className="side-menu-title">
            <img
              src="/aboor-logo.png"
              alt="Aboor"
              className="top-bar-logo"
            />
          </div>
          <button className="icon-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <button className="side-menu-item" onClick={onHome}>
          المباريات
        </button>
        <button className="side-menu-item" onClick={onMyTickets}>
          تذاكري
        </button>
        <button className="side-menu-item" onClick={onLogout}>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
