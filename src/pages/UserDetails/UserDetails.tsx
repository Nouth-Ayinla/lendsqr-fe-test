import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { User } from "../../types/index.js";
import "./UserDetails.scss";

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const userData = await api.getUserById(id);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleBlacklistUser = () => {
    if (user) {
      // Implementation for blacklisting user
      console.log("Blacklist user:", user.id);
    }
  };

  const handleActivateUser = () => {
    if (user) {
      // Implementation for activating user
      console.log("Activate user:", user.id);
    }
  };

  const computeTier = (u: User | null) => {
    if (!u) return 1;
    // Simple derived rule: active => 3, pending => 2, others => 1
    const status = u.status.toLowerCase();
    if (status === "active") return 3;
    if (status === "pending") return 2;
    return 1;
  };

  if (loading) {
    return (
      <div className="user-details">
        <div className="user-details__loading">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details">
        <div className="user-details__error">User not found</div>
      </div>
    );
  }

  return (
    <div className="user-details">
      <a onClick={() => navigate("/users")} className="user-details__back">
        <span className="user-details__back-icon">
          <img src="/icons/chevron-left.svg" alt="Back" />
        </span>
        Back to Users
      </a>

      <div className="user-details__header">
        <h1 className="user-details__title">User Details</h1>
      </div>

      <div className="user-details__profile-card">
        <div className="user-details__profile-header">
          <div className="user-details__avatar">
            <img src="/icons/avatar-user.svg" alt={user.fullName} />
          </div>

          <div className="user-details__profile-info">
            <h2 className="user-details__user-name">{user.fullName}</h2>
            <p className="user-details__user-id">{user.username}</p>
          </div>

          <div className="user-details__profile-tier">
            <div className="user-details__tier">
              <span className="user-details__tier-label">User’s Tier</span>
              <div className="user-details__stars">
                {[1, 2, 3].map((i) => {
                  const tier = computeTier(user);
                  return (
                    <img
                      key={i}
                      src={
                        i <= tier
                          ? "/icons/star-filled.svg"
                          : "/icons/star-empty.svg"
                      }
                      alt=""
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="user-details__profile-bank">
            <span className="user-details__bank-amount">₦200,000.00</span>
            <span className="user-details__bank-details">
              9912345678/Providus Bank
            </span>
          </div>

          <div className="user-details__actions user-details__actions--in-card">
            <button
              className="user-details__action-button user-details__action-button--blacklist"
              onClick={handleBlacklistUser}
            >
              Blacklist User
            </button>
            <button
              className="user-details__action-button user-details__action-button--activate"
              onClick={handleActivateUser}
            >
              Activate User
            </button>
          </div>
        </div>

        <div className="user-details__tabs-wrapper">
          <div className="user-details__tabs">
            <div
              className={`user-details__tab ${
                activeTab === "general" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              General Details
            </div>
            <div
              className={`user-details__tab ${
                activeTab === "documents" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("documents")}
            >
              Documents
            </div>
            <div
              className={`user-details__tab ${
                activeTab === "bank" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("bank")}
            >
              Bank Details
            </div>
            <div
              className={`user-details__tab ${
                activeTab === "loans" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("loans")}
            >
              Loans
            </div>
            <div
              className={`user-details__tab ${
                activeTab === "savings" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("savings")}
            >
              Savings
            </div>
            <div
              className={`user-details__tab ${
                activeTab === "app" ? "user-details__tab--active" : ""
              }`}
              onClick={() => setActiveTab("app")}
            >
              App and System
            </div>
          </div>
        </div>
      </div>

      {activeTab === "general" && (
        <div className="user-details__info-card">
          <div className="user-details__info-section user-details__info-section--personal">
            <h3 className="user-details__info-title">Personal Information</h3>
            <div className="user-details__info-grid">
              <div className="user-details__info-item">
                <span className="user-details__info-label">Full Name</span>
                <span className="user-details__info-value">
                  {user.fullName}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Phone Number</span>
                <span className="user-details__info-value">
                  {user.phoneNumber}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Email Address</span>
                <span className="user-details__info-value user-details__info-value--email">
                  {user.email}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">BVN</span>
                <span className="user-details__info-value">
                  {user.bvn ?? "07060780922"}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Gender</span>
                <span className="user-details__info-value">{user.gender}</span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Marital Status</span>
                <span className="user-details__info-value">
                  {user.maritalStatus}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Children</span>
                <span className="user-details__info-value">
                  {user.children}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">
                  Type of Residence
                </span>
                <span className="user-details__info-value">
                  {user.typeOfResidence}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details__info-section user-details__info-section--education">
            <h3 className="user-details__info-title">
              Education and Employment
            </h3>
            <div className="user-details__info-grid">
              <div className="user-details__info-item">
                <span className="user-details__info-label">
                  Level of Education
                </span>
                <span className="user-details__info-value">
                  {user.levelOfEducation}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">
                  Employment Status
                </span>
                <span className="user-details__info-value">
                  {user.employmentStatus}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">
                  Sector of Employment
                </span>
                <span className="user-details__info-value">
                  {user.sectorOfEmployment}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">
                  Duration of Employment
                </span>
                <span className="user-details__info-value">
                  {user.durationOfEmployment}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Office Email</span>
                <span className="user-details__info-value">
                  {user.officeEmail}
                </span>
              </div>

              <div className="user-details__info-item">
                <span className="user-details__info-label">Monthly Income</span>
                <span className="user-details__info-value">
                  {user.monthlyIncome}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Loan Repayment</span>
                <span className="user-details__info-value">
                  {user.loanRepayment}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details__info-section user-details__info-section--socials">
            <h3 className="user-details__info-title">Socials</h3>
            <div className="user-details__info-grid">
              <div className="user-details__info-item">
                <span className="user-details__info-label">Twitter</span>
                <span className="user-details__info-value">
                  {user.socialMediaHandle}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Facebook</span>
                <span className="user-details__info-value">
                  {user.socialMediaHandle}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Instagram</span>
                <span className="user-details__info-value">
                  {user.socialMediaHandle}
                </span>
              </div>
            </div>
          </div>

          <div className="user-details__info-section user-details__info-section--guarantor">
            <h3 className="user-details__info-title">Guarantor</h3>
            <div className="user-details__info-grid">
              <div className="user-details__info-item">
                <span className="user-details__info-label">Full Name</span>
                <span className="user-details__info-value">
                  {user.guarantorFullName}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Phone Number</span>
                <span className="user-details__info-value">
                  {user.guarantorPhoneNumber}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Email Address</span>
                <span className="user-details__info-value user-details__info-value--email">
                  {user.guarantorEmail}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Relationship</span>
                <span className="user-details__info-value">
                  {user.guarantorRelationship}
                </span>
              </div>
            </div>

            {/* Second guarantor block to match provided layout */}
            <div className="user-details__info-grid">
              <div className="user-details__info-item">
                <span className="user-details__info-label">Full Name</span>
                <span className="user-details__info-value">
                  {user.guarantor2FullName ?? user.guarantorFullName}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Phone Number</span>
                <span className="user-details__info-value">
                  {user.guarantor2PhoneNumber ?? user.guarantorPhoneNumber}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Email Address</span>
                <span className="user-details__info-value user-details__info-value--email">
                  {user.guarantor2Email ?? user.guarantorEmail}
                </span>
              </div>
              <div className="user-details__info-item">
                <span className="user-details__info-label">Relationship</span>
                <span className="user-details__info-value">
                  {user.guarantor2Relationship ?? user.guarantorRelationship}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
