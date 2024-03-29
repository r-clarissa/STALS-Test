import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import logo from "public/images/logo.png";
import user from "public/images/def_user.png";
import Image from "next/image";
import { type FieldValues, type UseFormRegister } from "react-hook-form";
import { useRouter } from "next/router";
import { UserType } from "@prisma/client";

interface NavBarProps {
  register?: UseFormRegister<FieldValues>;
  name?: string;
  showBack?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ register, name, showBack }) => {
  // const router = useRouter();
  return (
    <>
      {/* Navigation bar */}
      <nav
        id="up"
        className="sticky top-0 z-50 flex w-full flex-wrap items-center justify-between bg-p-dviolet p-4 py-1 sm:flex-row"
      >
        {/* Left side */}
        {/* {showBack && (
          <div
            className="flex cursor-pointer items-center"
            onClick={() => {
              router.back();
            }}
          >
            <div className="relative h-10 w-10">
              <svg
                aria-hidden="true"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </div>
        )} */}
        <div className="flex grow items-center justify-center sm:grow-0">
          {/* div button hack again */}
          <Link href="/homepage" className="flex items-center">
            <div className="relative h-[3.5rem] w-[3.5rem]">
              <Image
                src={logo.src}
                className="rounded-3xl object-contain py-2"
                alt="STALS Logo"
                fill
              />
            </div>
            <h1 className="mb-0.5 px-1 py-0 text-3xl font-bold text-white">
              STALS
            </h1>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex grow items-center justify-end p-4 font-medium sm:flex-col md:mt-0 md:flex-row md:space-x-5 md:border-0 md:p-0">
          <div>
            {register && name ? (
              <div className="mr-3 flex items-center sm:mr-0">
                <input
                  {...register(name)}
                  type="text"
                  placeholder="Search accommodations..."
                  className="w-56 rounded-l-full px-4 py-2 text-p-dviolet outline outline-1 outline-white sm:w-fit"
                />
                <button className="rounded-r-full bg-white py-2 pl-2 pr-3 text-white outline outline-1 outline-white">
                  <svg
                    className="h-6 w-6 pb-0.5 text-p-dviolet opacity-50 hover:text-p-rblue"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div>
            <ProfileButton />
          </div>
        </div>
      </nav>
    </>
  );
};

const ProfileButton: React.FC = () => {
  const { data: sessionData } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleLogout = () => {
    void signOut({
      callbackUrl: "/",
    });
  };

  const UserInfo: React.FC = () => {
    if (sessionData) {
      return (
        <div className="block w-full rounded-lg p-2 text-left">
          <Link href={"/profile"} className="">
            <p className="text-lg font-bold text-p-bviolet">
              {`${sessionData?.profile.first_name ?? ""} ${
                sessionData?.profile.middle_name ?? ""
              } ${sessionData?.profile.last_name ?? ""}
            ${sessionData?.profile.Suffix ?? ""}`}
            </p>
            <p className="mb-3 mt-0 overflow-hidden truncate text-sm italic text-gray-400">
              {sessionData?.user.email}
            </p>
          </Link>
        </div>
      );
    } else {
      return (
        <div className="block w-full rounded-lg p-2 text-left">
          <p className="text-lg font-bold text-p-bviolet">Guest</p>
          <p className="mb-1 overflow-hidden truncate text-sm italic text-gray-400">
            Unregistered user
          </p>
        </div>
      );
    }
  };

  const UserDropdown: React.FC = () => {
    if (sessionData) {
      return (
        <div className="profile-dropdown">
          <UserInfo />
          <hr className="mb-4 h-px border-0 bg-gray-200 dark:bg-gray-700"></hr>
          <div className="flex flex-col items-stretch gap-2">
            {sessionData?.profile.type != UserType.USER && (
              <div className="dropdown-buttons">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-home mr-2"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                </svg>
                <Link href={"/accommodation/management"}>Management</Link>
              </div>
            )}
            <div className="dropdown-buttons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-logout mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                <path d="M9 12h12l-3 -3"></path>
                <path d="M18 15l3 -3"></path>
              </svg>

              <button className="text-left" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="profile-dropdown">
          <UserInfo />
          <hr className="my-2 h-px border-0 bg-gray-200  dark:bg-gray-700"></hr>
          <div className="flex flex-col items-stretch gap-2">
            <div className="dropdown-buttons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-login mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                <path d="M20 12h-13l3 -3m0 6l-3 -3"></path>
              </svg>
              <Link href={"/login"}>Sign In</Link>
            </div>
            {/* <div className="dropdown-buttons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user-plus -ml-1 mr-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                <path d="M16 19h6"></path>
                <path d="M19 16v6"></path>
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
              </svg>
              <Link href={"/login"}>Sign Up</Link>
            </div> */}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <button
        className="relative flex h-[2.5rem] w-[2.5rem] items-center justify-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <Image
          src={sessionData?.user.image ?? user.src}
          className="rounded-full object-cover"
          alt="Profile"
          fill
        />
      </button>
      {showDropdown && <UserDropdown />}
    </div>
  );
};

export default NavBar;
