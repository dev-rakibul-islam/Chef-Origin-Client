import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import LoadingPage from "../pages/LoadingPage";
import logo from "../assets/logo.png";
import {
  FaUser,
  FaShoppingBag,
  FaStar,
  FaHeart,
  FaUtensils,
  FaPlus,
  FaList,
  FaClipboardList,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaHome,
  FaBars,
} from "react-icons/fa";

const NavItem = ({ to, icon: Icon, label, activeCheck }) => (
  <li>
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1
        ${
          activeCheck
            ? "bg-orange-50 text-orange-600 font-semibold shadow-sm border-l-4 border-orange-500"
            : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
        }`}
    >
      <Icon
        className={`text-lg ${
          activeCheck ? "text-orange-500" : "text-gray-400"
        }`}
      />
      <span>{label}</span>
    </Link>
  </li>
);

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const [role, roleLoading] = useRole();
  const location = useLocation();

  const userRole = role;

  if (loading || roleLoading) return <LoadingPage />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-red-500">
            Access Denied
          </h1>
          <p className="mb-6 text-gray-600">
            Please login to access the dashboard
          </p>
          <Link to="/login" className="btn btn-primary text-white">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="drawer lg:drawer-open bg-gray-50 min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Mobile Header */}
        <div className="w-full navbar bg-white shadow-sm lg:hidden z-20 sticky top-0">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost text-orange-500"
            >
              <FaBars className="text-xl" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <span className="text-lg font-bold font-playfair text-gray-800">
              Chef Origin Dashboard
            </span>
          </div>
        </div>

        {/* Main Content */}
        <main className="grow p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-30">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-80 min-h-full bg-white text-base-content shadow-md flex flex-col">
          {/* Sidebar Header */}
          <div className="mb-8 pt-2">
            <Link
              to="/"
              className="hover:opacity-80 transition-opacity flex items-center gap-2 pb-6"
            >
              <img className="w-12 h-12" src={logo} alt="Chef Origin Logo" />{" "}
              <div className="text-2xl font-bold font-serif">
                <span className="text-4xl text-orange-500">C</span>hef Origin
              </div>
            </Link>

            {/* User Mini Profile */}
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-orange-200 ring-offset-base-100 ring-offset-1">
                  <img src={user?.photoURL} alt="User" />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate text-gray-800">
                  {user?.displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole || "User"}
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-1 grow">
            {/* User Section */}
            {userRole !== "chef" && userRole !== "admin" && (
              <>
                <li className="menu-title text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  User Menu
                </li>
                <NavItem
                  to="/dashboard/profile"
                  icon={FaUser}
                  label="My Profile"
                  activeCheck={isActive("/profile")}
                />
                <NavItem
                  to="/dashboard/orders"
                  icon={FaShoppingBag}
                  label="My Orders"
                  activeCheck={isActive("/orders")}
                />
                <NavItem
                  to="/dashboard/reviews"
                  icon={FaStar}
                  label="My Reviews"
                  activeCheck={isActive("/reviews")}
                />
                <NavItem
                  to="/dashboard/favorites"
                  icon={FaHeart}
                  label="Favorite Meals"
                  activeCheck={isActive("/favorites")}
                />
              </>
            )}

            {/* Chef Section */}
            {userRole === "chef" && (
              <>
                <li className="menu-title text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Chef Menu
                </li>
                <NavItem
                  to="/dashboard/profile"
                  icon={FaUser}
                  label="My Profile"
                  activeCheck={isActive("/profile")}
                />
                <NavItem
                  to="/dashboard/create-meal"
                  icon={FaPlus}
                  label="Create Meal"
                  activeCheck={isActive("/create-meal")}
                />
                <NavItem
                  to="/dashboard/my-meals"
                  icon={FaList}
                  label="My Meals"
                  activeCheck={isActive("/my-meals")}
                />
                <NavItem
                  to="/dashboard/order-requests"
                  icon={FaClipboardList}
                  label="Order Requests"
                  activeCheck={isActive("/order-requests")}
                />
              </>
            )}

            {/* Admin Section */}
            {userRole === "admin" && (
              <>
                <li className="menu-title text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">
                  Admin Menu
                </li>
                <NavItem
                  to="/dashboard/profile"
                  icon={FaUser}
                  label="My Profile"
                  activeCheck={isActive("/profile")}
                />
                <NavItem
                  to="/dashboard/manage-users"
                  icon={FaUsers}
                  label="Manage Users"
                  activeCheck={isActive("/manage-users")}
                />
                <NavItem
                  to="/dashboard/manage-requests"
                  icon={FaTasks}
                  label="Manage Requests"
                  activeCheck={isActive("/manage-requests")}
                />
                <NavItem
                  to="/dashboard/statistics"
                  icon={FaChartBar}
                  label="Platform Statistics"
                  activeCheck={isActive("/statistics")}
                />
              </>
            )}
          </ul>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors shadow-inner bg-orange-50"
            >
              <FaHome className="text-lg " />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
