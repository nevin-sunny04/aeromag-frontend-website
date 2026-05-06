"use client";

import { LoaderCircle, Send } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import { Policy } from "../utils/types";
import { Subscribe } from "./home/actions/subscribe";

export default function Footer({
  footerLogo,
  social,
  content,
  policy,
}: {
  footerLogo: { image: string; alt_text: string }[];
  social: { icon: string; url: string }[];
  content: string;
  policy: Policy[];
}) {
  const footerMenu = [
    { id: 1, name: "Home", link: "/" },
    { id: 2, name: "About Us", link: "/about-us" },
    { id: 3, name: "Contact Us", link: "/contact-us" },
    { id: 4, name: "Gallery", link: "/gallery" },
    { id: 5, name: "Media Kit", link: "/media-kit" },
  ];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await Subscribe(email);
    if (response.status === "success") {
      toast.success(`Subscription successful!`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
        transition: Slide,
      });
      setEmail("");
    } else {
      toast.error(`Something went wrong. Please Try Again`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
        transition: Slide,
      });
    }

    setLoading(false);
  };

  return (
    <>
      <footer className="bg-secondary text-white text-center pt-8">
        <div className="container mx-auto px-4">
          <div className="flex lg:flex-row flex-col gap-8 items-center">
            <div className="lg:w-3/12 w-full"></div>
            <div className="flex lg:w-6/12 flex-col items-center">
              {footerLogo && footerLogo[1] && (
                <Image
                  src={footerLogo[1].image}
                  alt={footerLogo[1].alt_text}
                  width={322}
                  height={68}
                  className="h-auto w-[230px] mb-4"
                />
              )}

              <div
                className="content font-extralight  mx-auto mb-4"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>

              <nav className="mb-4">
                <ul className="flex flex-wrap justify-center gap-6 text-sm">
                  {footerMenu.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.link}
                        className="hover:font-medium transition-all font-extralight text-[16px]"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="flex items-center gap-4 mb-4">
                {social.map((profile, index) => (
                  <Link
                    key={`social_${index}`}
                    href={profile.url}
                    target="_blank"
                  >
                    {profile.icon === "twitter" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        fill="currentColor"
                        className="bi bi-twitter-x"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                      </svg>
                    ) : (
                      <DynamicIcon
                        name={
                          profile.icon as Parameters<
                            typeof DynamicIcon
                          >[0]["name"]
                        }
                        size={16}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-4 lg:w-3/12 w-full px-4">
              <form onSubmit={handleSubscribe}>
                <label
                  htmlFor="email"
                  className="block lg:text-left text-center text-md font-extralightlight mb-2"
                >
                  Subscribe to our newsletter
                </label>
                <div className="flex w-full justify-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    placeholder="Enter Your Email"
                    className="px-4 py-1 bg-white dark:bg-secondary border text-sm w-100 placeholder:text-black dark:placeholder:text-foreground dark:text-foreground text-black focus:outline-none"
                  />
                  <button className="bg-red-600 cursor-pointer px-2 py-2 ">
                    {loading ? (
                      <LoaderCircle
                        className="animate-spin text-white"
                        size={16}
                      />
                    ) : (
                      <Send className="text-white" size={16} />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="border-t font-extralight  border-white mt-4 gap-5 py-4 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>Copyright {new Date().getFullYear()} All rights reserved</p>

            <div className="flex gap-4">
              {policy.map((policy) => (
                <Link
                  key={policy.id}
                  href={`/policy/${policy.slug}`}
                  className="hover:font-medium transition-all"
                >
                  {policy.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </>
  );
}
