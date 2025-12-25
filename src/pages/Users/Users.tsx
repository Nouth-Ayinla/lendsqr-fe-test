import Dashboard from "../Dashboard/Dashboard";

const Users: React.FC = () => {
  return <Dashboard />;
};

/*
const UsersLegacy: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [filterParams, setFilterParams] = useState<FilterParams>({});

  const filterRef = useRef<HTMLDivElement>(null);
  const actionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilterPopup(false);
      }

      // Close action menu if clicked outside
      if (activeActionMenu) {
        const actionRef = actionRefs.current[activeActionMenu];
        if (actionRef && !actionRef.contains(event.target as Node)) {
          setActiveActionMenu(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeActionMenu]);

  const handleFilter = () => {
    let filtered = users;

    if (filterParams.organization) {
      filtered = filtered.filter((u) =>
        u.organization
          .toLowerCase()
          .includes(filterParams.organization!.toLowerCase())
      );
    }

    if (filterParams.username) {
      filtered = filtered.filter((u) =>
        u.username.toLowerCase().includes(filterParams.username!.toLowerCase())
      );
    }

    if (filterParams.email) {
      filtered = filtered.filter((u) =>
        u.email.toLowerCase().includes(filterParams.email!.toLowerCase())
      );
    }

    if (filterParams.phoneNumber) {
      filtered = filtered.filter((u) =>
        u.phoneNumber.includes(filterParams.phoneNumber!)
      );
    }

    if (filterParams.status) {
      filtered = filtered.filter((u) => u.status === filterParams.status);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const handleResetFilter = () => {
    setFilterParams({});
    setFilteredUsers(users);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleBlacklistUser = (userId: string) => {
    // Implementation for blacklisting user
    console.log("Blacklist user:", userId);
    setActiveActionMenu(null);
  };

  const handleActivateUser = (userId: string) => {
    // Implementation for activating user
    console.log("Activate user:", userId);
    setActiveActionMenu(null);
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="users">
        <h1 className="users__title">Users</h1>
        <div className="users__loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="users">
      <h1 className="users__title">Users</h1>

      <div className="users__table-wrapper">
        <table className="users__table">
          <thead>
            <tr>
              <th>
                Organization
                <span
                  className="users__filter-icon"
                  onClick={() => setShowFilterPopup(!showFilterPopup)}
                >
                  🔽
                </span>
                {showFilterPopup && (
                  <div ref={filterRef} className="filter-popup">
                    <form
                      className="filter-popup__form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleFilter();
                      }}
                    >
                      <div className="filter-popup__field">
                        <label className="filter-popup__label">
                          Organization
                        </label>
                        <input
                          type="text"
                          className="filter-popup__input"
                          placeholder="Enter organization"
                          value={filterParams.organization || ""}
                          onChange={(e) =>
                            setFilterParams({
                              ...filterParams,
                              organization: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="filter-popup__field">
                        <label className="filter-popup__label">Username</label>
                        <input
                          type="text"
                          className="filter-popup__input"
                          placeholder="Enter username"
                          value={filterParams.username || ""}
                          onChange={(e) =>
                            setFilterParams({
                              ...filterParams,
                              username: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="filter-popup__field">
                        <label className="filter-popup__label">Email</label>
                        <input
                          type="email"
                          className="filter-popup__input"
                          placeholder="Enter email"
                          value={filterParams.email || ""}
                          onChange={(e) =>
                            setFilterParams({
                              ...filterParams,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="filter-popup__field">
                        <label className="filter-popup__label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="filter-popup__input"
                          placeholder="Enter phone number"
                          value={filterParams.phoneNumber || ""}
                          onChange={(e) =>
                            setFilterParams({
                              ...filterParams,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="filter-popup__field">
                        <label className="filter-popup__label">Status</label>
                        <select
                          className="filter-popup__select"
                          value={filterParams.status || ""}
                          onChange={(e) =>
                            setFilterParams({
                              ...filterParams,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="">All</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                          <option value="blacklisted">Blacklisted</option>
                        </select>
                      </div>
                      <div className="filter-popup__actions">
                        <button
                          type="button"
                          className="filter-popup__button filter-popup__button--reset"
                          onClick={handleResetFilter}
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          className="filter-popup__button filter-popup__button--filter"
                        >
                          Filter
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date Joined</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.organization}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{new Date(user.dateJoined).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`users__status users__status--${user.status}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="users__actions"
                      ref={(el) => {
                        if (el) actionRefs.current[user.id] = el;
                      }}
                    >
                      <button
                        className="users__actions-button"
                        onClick={() =>
                          setActiveActionMenu(
                            activeActionMenu === user.id ? null : user.id
                          )
                        }
                      >
                        ⋮
                      </button>
                      {activeActionMenu === user.id && (
                        <div className="actions-menu">
                          <div
                            className="actions-menu__item"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            <span className="actions-menu__item-icon">👁️</span>
                            View Details
                          </div>
                          <div
                            className="actions-menu__item"
                            onClick={() => handleBlacklistUser(user.id)}
                          >
                            <span className="actions-menu__item-icon">🚫</span>
                            Blacklist User
                          </div>
                          <div
                            className="actions-menu__item"
                            onClick={() => handleActivateUser(user.id)}
                          >
                            <span className="actions-menu__item-icon">✓</span>
                            Activate User
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="users__empty">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="users__pagination">
        <div className="users__pagination-info">
          <span>Showing</span>
          <select
            className="users__pagination-select"
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>out of {filteredUsers.length}</span>
        </div>

        <div className="users__pagination-buttons">
          <button
            className="users__pagination-button"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ◀
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`users__pagination-button ${
                page === currentPage ? "users__pagination-button--active" : ""
              }`}
              onClick={() => typeof page === "number" && paginate(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="users__pagination-button"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
*/

export default Users;
