"use client"
import React from 'react'
import { css } from "styled-system/css";
import { hstack, vstack } from "styled-system/patterns";
import { useRouter } from "next/navigation";

function page() {
    const router = useRouter();

    const session = {
      data: {
        user: {
          name: "Samuel Abera",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080",
          email: "samuel@gmail.com"
        }
      }
    }

  return (
    <section
      className={css({
        w: "full",
        overflow: "hidden",
        _dark: { bg: "gray.900" },
      })}
    >
      <div className={vstack({ flexDir: "column" })}>
        {/* <!-- Cover Image --> */}
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw5fHxjb3ZlcnxlbnwwfDB8fHwxNzEwNzQxNzY0fDA&ixlib=rb-4.0.3&q=80&w=1080"
          alt="User Cover"
          className={css({
            w: "full",
            xl: { h: "20rem" },
            lg: { h: "18rem" },
            md: { h: "16rem" },
            sm: { h: "11rem" },
          })}
        />

        {/* <!-- Profile Image --> */}
        <div
          className={css({
            sm: { w: "90%" },
            ml: "auto",
            mr: "auto",
            display: "flex",
          })}
        >
          <img
            src={session.data?.user?.image || ""}
            alt="User Profile"
            className={css({
              rounded: "md",
              lg: { w: "12rem", h: "12rem", bottom: "5rem" },
              md: { w: "10rem", h: "10rem" },
              sm: { w: "7rem", h: "7rem", bottom: "3rem" },
              outlineStyle: "solid",
              ringWidth: "2px",
              ringOffset: "offset.2",
              ringColor: "blue.500",
              pos: "relative",
            })}
          />

          {/* <!-- FullName --> */}
          <h1
            className={css({
              w: "full",
              textAlign: "left",
              my: 4,
              sm: { mx: 4, fontSize: "3xl" },
              base: { pl: 4, fontSize: "xl" },
              color: "gray.800",
              _dark: { color: "white" },
              lg: { fontSize: "4xl" },
              md: { fontSize: "3xl" },
            })}
          >
            {session.data?.user?.name}
          </h1>
        </div>

        <div
          className={css({
            xl: { w: "80%" },
            lg: { w: "90%", top: ".top-8" },
            md: { w: "90%", top: ".top-6" },
            sm: { w: "90%", top: ".top-4" },
            ml: "auto",
            mr: "auto",
            display: "flex",
            flexDir: "column",
            gap: "4",
            alignItems: "center",
            pos: "relative",
          })}
        >
          {/* <!-- Description --> */}
          <p
            className={css({
              w: "",
              color: "gray.700",
              _dark: { color: "gray.400" },
              fontSize: "md",
            })}
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            debitis labore consectetur voluptatibus mollitia dolorem veniam
            omnis ut quibusdam minima sapiente repellendus asperiores explicabo,
            eligendi odit, dolore similique fugiat dolor, doloremque eveniet.
            Odit, consequatur. Ratione voluptate exercitationem hic eligendi
            vitae animi nam in, est earum culpa illum aliquam.
          </p>

          {/* <!-- Detail --> */}
          <div
            className={vstack({
              w: "full",
              my: "auto",
              py: 6,
              flexDir: "column",
              justifyContent: "center",
              p: 2,
            })}
          >
            <div
              className={hstack({
                w: "full",
                sm: { flexDir: "row" },
                base: { flexDir: "column" },
                p: 2,
                justifyContent: "center",
              })}
            >
              <div className={css({ w: "full" })}>
                <dl
                  className={css({
                    color: "gray.900",
                    _dark: { color: "white" },
                  })}
                >
                  <div className={vstack({ flexDir: "column", pb: 3 })}>
                    <dt
                      className={css({
                        mb: 1,
                        color: "gray.500",
                        md: { fontSize: "lg" },
                        _dark: { color: "gray.400" },
                      })}
                    >
                      First Name
                    </dt>
                    <dd
                      className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                      })}
                    >
                      Samuel
                    </dd>
                  </div>
                  <div className={vstack({ flexDir: "column", py: 3 })}>
                    <dt
                      className={css({
                        mb: 1,
                        color: "gray.500",
                        md: { fontSize: "lg" },
                        _dark: { color: "gray.400" },
                      })}
                    >
                      Last Name
                    </dt>
                    <dd
                      className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                      })}
                    >
                      Abera
                    </dd>
                  </div>
                </dl>
              </div>
              <div className={css({ w: "full" })}>
                <dl
                  className={css({
                    color: "gray.900",
                    _dark: { color: "white" },
                  })}
                >
                  <div className={vstack({ flexDir: "column", pt: 3 })}>
                    <dt
                      className={css({
                        mb: 1,
                        color: "gray.500",
                        md: { fontSize: "lg" },
                        _dark: { color: "gray.400" },
                      })}
                    >
                      Phone Number
                    </dt>
                    <dd
                      className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                      })}
                    >
                      +251913****30
                    </dd>
                  </div>
                  <div className={vstack({ flexDir: "column", pt: 3 })}>
                    <dt
                      className={css({
                        mb: 1,
                        color: "gray.500",
                        md: { fontSize: "lg" },
                        _dark: { color: "gray.400" },
                      })}
                    >
                      Email
                    </dt>
                    <dd
                      className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                      })}
                    >
                      {session.data?.user?.email}
                    </dd>
                  </div>

                  <div className={vstack({ flexDir: "column", pt: 3 })}>
                    <dt
                      className={css({
                        mb: 1,
                        color: "gray.500",
                        md: { fontSize: "lg" },
                        _dark: { color: "gray.400" },
                      })}
                    >
                      Website
                    </dt>
                    <dd
                      className={css({
                        fontSize: "lg",
                        fontWeight: "semibold",
                      })}
                    >
                      https://www.teclick.com
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* <!-- Social Links --> */}
          <div
            className={hstack({
              m: 20,
              rounded: "sm",
              bg: "gray.200",
              color: "gray.500",
              _dark: { bg: "gray.200/80", color: "gray.700" },
              _hover: { color: "gray.600" },
            })}
          >
            <a href="https://www.linkedin.com/in/samuel-abera-6593a2209/">
              <div className={css({ p: 2, _hover: { color: "primary" } })}>
                <svg
                  className={css({
                    lg: { w: 6, h: 6 },
                    sm: { w: 4, h: 4 },
                    color: "blue.500",
                  })}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                    clip-rule="evenodd"
                  />
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                </svg>
              </div>
            </a>
            <a href="https://twitter.com/Samuel7Abera7">
              <div className={css({ p: 2, _hover: { color: "primary" } })}>
                <svg
                  className={css({
                    lg: { w: 6, h: 6 },
                    sm: { w: 4, h: 4 },
                    color: "gray.900",
                  })}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z" />
                </svg>
              </div>
            </a>
            <a href="">
              <div className={css({ p: 2, _hover: { color: "blue.500" } })}>
                <svg
                  className={css({
                    lg: { w: 6, h: 6 },
                    sm: { w: 4, h: 4 },
                    color: "blue.700",
                  })}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </a>
            <a href="https://www.youtube.com/@silentcoder7">
              <div className={css({ p: 2, _hover: { color: "primary" } })}>
                <svg
                  className={css({
                    lg: { w: 6, h: 6 },
                    sm: { w: 4, h: 4 },
                    color: "red.600",
                  })}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );

}

export default page