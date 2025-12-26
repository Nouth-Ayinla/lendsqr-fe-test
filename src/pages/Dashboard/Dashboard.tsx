import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import type { DashboardStats, User } from "../../types";
import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterPos, setFilterPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 52,
  });
  const [actionMenu, setActionMenu] = useState<{
    open: boolean;
    left: number;
    top: number;
    userId: string | null;
  }>({ open: false, left: 0, top: 0, userId: null });
  const [filter, setFilter] = useState({
    organization: "",
    username: "",
    email: "",
    phoneNumber: "",
    status: "",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableWrapperRef = useRef<HTMLDivElement | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, users] = await Promise.all([
          api.getDashboardStats(),
          api.getUsers(),
        ]);

        setStats(statsData);
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Unable to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Users",
      value: stats?.totalUsers ?? 0,
      icon: <img src="/icons/users.svg" alt="" />,
      tone: "users",
    },
    {
      label: "Active Users",
      value: stats?.activeUsers ?? 0,
      icon: <img src="/icons/active-users.svg" alt="" />,
      tone: "active",
    },
    {
      label: "Users with Loans",
      value: stats?.usersWithLoans ?? 0,
      icon: <img src="/icons/loans.svg" alt="" />,
      tone: "loans",
    },
    {
      label: "Users with Savings",
      value: stats?.usersWithSavings ?? 0,
      icon: <img src="/icons/savings.svg" alt="" />,
      tone: "savings",
    },
  ];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const PANEL_WIDTH = 270;
  const openFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (filterOpen) {
      closeFilter();
      return;
    }

    const wrapperRect = tableWrapperRef.current?.getBoundingClientRect();
    const buttonRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();

    if (wrapperRect) {
      const buttonCenter =
        buttonRect.left - wrapperRect.left + buttonRect.width / 2;
      setFilterPos({
        left: Math.max(16, buttonCenter - PANEL_WIDTH / 2),
        top: buttonRect.bottom - wrapperRect.top + 12,
      });
    }
    setFilterOpen(true);
  };
  const closeFilter = () => setFilterOpen(false);

  const MENU_WIDTH = 180;
  const MENU_HEIGHT = 130;
  const openActionMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: string
  ) => {
    if (actionMenu.open && actionMenu.userId === userId) {
      closeActionMenu();
      return;
    }
    const wrapperRect = tableWrapperRef.current?.getBoundingClientRect();
    const buttonRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    if (wrapperRect) {
      const GAP = 4;
      let left = buttonRect.left - wrapperRect.left - MENU_WIDTH - GAP; // place to the left of the dots
      const maxLeft = wrapperRect.width - MENU_WIDTH - GAP;
      if (left < GAP) {
        // not enough room on the left, place to the right of the dots
        left = buttonRect.right - wrapperRect.left + GAP;
      }
      left = Math.max(GAP, Math.min(left, maxLeft));

      let top =
        buttonRect.top -
        wrapperRect.top -
        (MENU_HEIGHT - buttonRect.height) / 2; // vertically center around dots
      const maxTop = wrapperRect.height - MENU_HEIGHT - GAP;
      top = Math.max(GAP, Math.min(top, maxTop));

      setActionMenu({ open: true, left, top, userId });
    } else {
      setActionMenu({ open: true, left: 0, top: 0, userId });
    }
  };

  const closeActionMenu = () =>
    setActionMenu({ open: false, left: 0, top: 0, userId: null });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        actionMenu.open &&
        actionMenuRef.current &&
        !actionMenuRef.current.contains(target) &&
        !target.closest(".dashboard__more-btn")
      ) {
        closeActionMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionMenu.open]);

  const organizations = Array.from(
    new Set(allUsers.map((u) => u.organization))
  ).sort();
  const applyFilters = (users: User[]) => {
    return users.filter((u) => {
      const byOrg =
        !filter.organization || u.organization === filter.organization;
      const byUsername =
        !filter.username ||
        u.username.toLowerCase().includes(filter.username.toLowerCase());
      const byEmail =
        !filter.email ||
        u.email.toLowerCase().includes(filter.email.toLowerCase());
      const byPhone =
        !filter.phoneNumber || u.phoneNumber.includes(filter.phoneNumber);
      const byStatus =
        !filter.status ||
        u.status.toLowerCase() === filter.status.toLowerCase();
      const byDate =
        !filter.date ||
        new Date(u.dateJoined).toISOString().slice(0, 10) === filter.date;
      return byOrg && byUsername && byEmail && byPhone && byStatus && byDate;
    });
  };

  const onFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyFilters(allUsers);
    setFilteredUsers(result);
    closeFilter();
  };

  const onFilterReset = () => {
    setFilter({
      organization: "",
      username: "",
      email: "",
      phoneNumber: "",
      status: "",
      date: "",
    });
    setFilteredUsers(null);
    closeFilter();
  };

  const allDisplayUsers = filteredUsers ?? allUsers;
  const totalUsers = allDisplayUsers.length;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = allDisplayUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Users</h1>
        </div>
      </div>

      {error && <div className="dashboard__error">{error}</div>}

      <div className="dashboard__cards">
        <div className="dashboard__cards-track">
          {statCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div className={`stat-card__icon stat-card__icon--${card.tone}`}>
                {card.icon}
              </div>
              <div className="stat-card__label">{card.label}</div>
              <div className="stat-card__value">
                {loading ? "--" : card.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="dashboard__panel">
        {/* Desktop Table View */}
        <div className="dashboard__table-wrapper" ref={tableWrapperRef}>
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Organization</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Username</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Email</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Phone Number</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Date Joined</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th>
                  <span className="dashboard__th">
                    <span className="dashboard__th-label">Status</span>
                    <button
                      type="button"
                      className="dashboard__th-icon-btn"
                      onClick={openFilter}
                      aria-label="Filter column"
                    >
                      <img
                        src="/icons/filter.svg"
                        alt=""
                        className="dashboard__th-icon"
                      />
                    </button>
                  </span>
                </th>
                <th className="dashboard__th-actions"></th>
              </tr>
            </thead>

            {filterOpen && (
              <tfoot>
                <tr>
                  <td colSpan={7}>
                    <div
                      className="dashboard__filter-panel"
                      style={{ left: filterPos.left, top: filterPos.top }}
                    >
                      <form onSubmit={onFilterSubmit}>
                        <div className="dashboard__filter-row">
                          <label>Organization</label>
                          <select
                            value={filter.organization}
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                organization: e.target.value,
                              })
                            }
                          >
                            <option value="">Select</option>
                            {organizations.map((org) => (
                              <option key={org} value={org}>
                                {org}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="dashboard__filter-row">
                          <label>Username</label>
                          <input
                            type="text"
                            placeholder="User"
                            value={filter.username}
                            onChange={(e) =>
                              setFilter({ ...filter, username: e.target.value })
                            }
                          />
                        </div>

                        <div className="dashboard__filter-row">
                          <label>Email</label>
                          <input
                            type="text"
                            placeholder="Email"
                            value={filter.email}
                            onChange={(e) =>
                              setFilter({ ...filter, email: e.target.value })
                            }
                          />
                        </div>

                        <div className="dashboard__filter-row">
                          <label>Date</label>
                          <div className="dashboard__input-with-icon">
                            <span
                              className={`dashboard__input-placeholder ${
                                filter.date ? "is-hidden" : ""
                              }`}
                            >
                              Date
                            </span>
                            <input
                              type="text"
                              value={filter.date}
                              onChange={(e) =>
                                setFilter({ ...filter, date: e.target.value })
                              }
                            />
                            <img
                              src="/icons/calendar.svg"
                              alt=""
                              className="dashboard__input-icon"
                            />
                          </div>
                        </div>

                        <div className="dashboard__filter-row">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            placeholder="Phone Number"
                            value={filter.phoneNumber}
                            onChange={(e) =>
                              setFilter({
                                ...filter,
                                phoneNumber: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="dashboard__filter-row">
                          <label>Status</label>
                          <select
                            value={filter.status}
                            onChange={(e) =>
                              setFilter({ ...filter, status: e.target.value })
                            }
                          >
                            <option value="">Select</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                            <option value="blacklisted">Blacklisted</option>
                          </select>
                        </div>

                        <div className="dashboard__filter-actions">
                          <button
                            type="button"
                            className="dashboard__ghost"
                            onClick={onFilterReset}
                          >
                            Reset
                          </button>
                          <button type="submit" className="dashboard__cta">
                            Filter
                          </button>
                          <button
                            type="button"
                            className="dashboard__close"
                            aria-label="Close"
                            onClick={closeFilter}
                          >
                            ×
                          </button>
                        </div>
                      </form>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="dashboard__loading">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && displayedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="dashboard__empty">
                    No users found yet.
                  </td>
                </tr>
              )}

              {!loading &&
                displayedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.organization}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{formatDate(user.dateJoined)}</td>
                    <td>
                      <span
                        className={`dashboard__status dashboard__status--${user.status}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="dashboard__td-actions">
                      <button
                        type="button"
                        className="dashboard__more-btn"
                        aria-label="Row actions"
                        onClick={(e) => openActionMenu(e, user.id)}
                      >
                        <img src="/icons/more.svg" alt="" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {actionMenu.open && (
            <div
              className="dashboard__action-menu"
              style={{ left: actionMenu.left, top: actionMenu.top }}
              ref={actionMenuRef}
            >
              <button
                type="button"
                className="dashboard__action-item"
                onClick={() => {
                  if (actionMenu.userId) {
                    navigate(`/users/${actionMenu.userId}`);
                    closeActionMenu();
                  }
                }}
              >
                <img
                  src="/icons/eye.svg"
                  alt=""
                  className="dashboard__action-icon"
                />
                View Details
              </button>
              <button type="button" className="dashboard__action-item">
                <img
                  src="/icons/user-block.svg"
                  alt=""
                  className="dashboard__action-icon"
                />
                Blacklist User
              </button>
              <button type="button" className="dashboard__action-item">
                <img
                  src="/icons/user-check.svg"
                  alt=""
                  className="dashboard__action-icon"
                />
                Activate User
              </button>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="dashboard__mobile-cards">
          {loading && <div className="dashboard__loading">Loading...</div>}

          {!loading && displayedUsers.length === 0 && (
            <div className="dashboard__empty">No users found yet.</div>
          )}

          {!loading &&
            displayedUsers.map((user) => (
              <div key={user.id} className="dashboard__user-card">
                <div className="dashboard__user-card-header">
                  <div className="dashboard__user-card-name">
                    {user.username}
                  </div>
                  <span
                    className={`dashboard__status dashboard__status--${user.status}`}
                  >
                    {user.status}
                  </span>
                </div>
                <div className="dashboard__user-card-org">
                  {user.organization}
                </div>
                <div className="dashboard__user-card-row">
                  <span className="dashboard__user-card-label">Email</span>
                  <span className="dashboard__user-card-value">
                    {user.email}
                  </span>
                </div>
                <div className="dashboard__user-card-row">
                  <span className="dashboard__user-card-label">Phone</span>
                  <span className="dashboard__user-card-value">
                    {user.phoneNumber}
                  </span>
                </div>
                <div className="dashboard__user-card-row">
                  <span className="dashboard__user-card-label">Joined</span>
                  <span className="dashboard__user-card-value">
                    {formatDate(user.dateJoined)}
                  </span>
                </div>
                <button
                  type="button"
                  className="dashboard__user-card-action"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </section>

      <div className="dashboard__pagination">
        <div className="dashboard__pagination-info">
          <span>Showing</span>
          <select
            className="dashboard__pagination-select"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>out of {totalUsers}</span>
        </div>

        <div className="dashboard__pagination-controls">
          <button
            className="dashboard__pagination-btn dashboard__pagination-arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <img src="/icons/arrow-left.svg" alt="" />
          </button>

          {currentPage > 2 && (
            <button
              className="dashboard__pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
          )}

          {currentPage > 3 && (
            <span className="dashboard__pagination-ellipsis">...</span>
          )}

          {Array.from({ length: 3 }, (_, i) => {
            const pageNum = currentPage - 1 + i;
            if (pageNum < 1 || pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                className={`dashboard__pagination-btn ${
                  currentPage === pageNum
                    ? "dashboard__pagination-btn--active"
                    : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {currentPage < totalPages - 2 && (
            <span className="dashboard__pagination-ellipsis">...</span>
          )}

          {currentPage < totalPages - 1 && (
            <>
              <button
                className="dashboard__pagination-btn"
                onClick={() => handlePageChange(totalPages - 1)}
              >
                {totalPages - 1}
              </button>
              <button
                className="dashboard__pagination-btn"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="dashboard__pagination-btn dashboard__pagination-arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <img src="/icons/arrow-right.svg" alt="" />
          </button>
        </div>
      </div>

      <div className="dashboard__bottom-spacer" aria-hidden />
    </div>
  );
};

export default Dashboard;
