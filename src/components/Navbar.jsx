import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { Link, NavLink } from "react-router";
import { Image } from "@imagekit/react";
import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const mobileTriggerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeMobileMenu = useCallback(() => {
    try {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 1023px)").matches
      ) {
        mobileMenuRef.current?.blur?.();
        mobileTriggerRef.current?.blur?.();
      }

      if (
        document.activeElement &&
        typeof document.activeElement.blur === "function"
      ) {
        document.activeElement.blur();
      }
    } catch {
      // Intentionally ignore
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      closeMobileMenu();
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "px-4 py-2 rounded-full bg-white text-orange-500 font-medium transition-all shadow-md"
      : "px-4 py-2 rounded-full text-orange-500 hover:bg-orange-100 hover:text-primary-accent transition-all font-medium";

  const navOptionsDesktop = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/meals" className={navLinkClass}>
          Meals
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  const navOptionsMobile = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-primary-accent font-bold" : "text-gray-700"
          }
          onClick={closeMobileMenu}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/meals"
          className={({ isActive }) =>
            isActive ? "text-primary-accent font-bold" : "text-gray-700"
          }
          onClick={closeMobileMenu}
        >
          Meals
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "text-primary-accent font-bold" : "text-gray-700"
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <section className="bg-white md:bg-white/10 backdrop-blur-md p-0 md:py-1 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300">
      <div className="navbar px-0 py-0 font-medium w-11/12 mx-auto ">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost p-0 hover:bg-transparent lg:hidden mr-6 rounded-full"
              ref={mobileTriggerRef}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm bg-white dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow"
              ref={mobileMenuRef}
            >
              {navOptionsMobile}
            </ul>
          </div>
          <Link
            to="/"
            className="hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <img className="w-12 h-12" src={logo} alt="Chef Origin Logo" />
            <div className="hidden md:block text-2xl font-bold font-serif">
              <span className="text-4xl text-orange-500">C</span>hef Origin
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex bg-orange-100 px-3 py-3 rounded-full backdrop-blur-xl shadow-inner">
          <nav className="p-1">
            <ul className="flex items-center gap-1">{navOptionsDesktop}</ul>
          </nav>
        </div>

        <div className="navbar-end gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className=" bg-transparent border-0 p-0"
                >
                  {user?.photoURL ? (
                    <div className="w-10 h-10 rounded-full">
                      <Image
                        urlEndpoint="https://ik.imagekit.io/rakibdev/"
                        src={user?.photoURL}
                        width={500}
                        height={500}
                        alt="Profile"
                        className="w-10 h-10 border border-orange-700 rounded-full object-cover"
                      />
                    </div>
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] space-y-1 shadow-2xl overflow-hidden rounded-xl p-2"
                >
                  <li className="bg-orange-50 pointer-events-none cursor-default rounded-xl m-1 border border-orange-100 overflow-hidden">
                    <div className="flex items-center gap-3 p-3 w-full min-w-0">
                      <div className="shrink-0">
                        {user?.photoURL ? (
                          <div className="w-10 h-10 rounded-full">
                            <Image
                              urlEndpoint="https://ik.imagekit.io/rakibdev/"
                              src={user?.photoURL}
                              width={200}
                              height={200}
                              alt="Profile"
                              className="w-10 h-10 border border-orange-700 rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full border border-orange-200 bg-white flex items-center justify-center text-orange-500">
                            <FiUser size={18} />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <h1 className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
                          Signed In As
                        </h1>
                        <h2
                          className="text-sm text-gray-800 font-semibold truncate"
                          title={user?.displayName || "User"}
                        >
                          {user?.displayName || "User"}
                        </h2>
                        <h2
                          className="text-xs text-gray-600 truncate"
                          title={user?.email}
                        >
                          {user?.email}
                        </h2>
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link
                      to="/dashboard"
                      className="text-sm py-2 border-l-4 border-transparent bg-orange-50 hover:bg-orange-100 hover:border-orange-500 transition-all"
                      onClick={closeMobileMenu}
                    >
                      <FiGrid size={20} className="text-orange-500" />
                      Dashboard
                      <span className="justify-end">
                        <IoIosArrowForward />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/profile"
                      className="text-sm py-2 border-l-4 border-transparent bg-orange-50 hover:bg-orange-100 hover:border-orange-500 transition-all"
                      onClick={closeMobileMenu}
                    >
                      <FiUser size={20} className="text-orange-500" />
                      My Profile
                      <span className="justify-end">
                        <IoIosArrowForward />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-sm py-2 border-l-4 border-transparent bg-red-50 hover:bg-red-100 hover:border-red-500 transition-all"
                    >
                      <FiLogOut size={20} className="text-red-500" />
                      Logout
                      <span className="justify-end">
                        <IoIosArrowForward />
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-primary btn-sm text-white hover:shadow-lg transition-all bg-orange-500 border-orange-500 hover:bg-orange-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-outline btn-sm transition-all border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
