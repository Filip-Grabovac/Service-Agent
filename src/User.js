export default class User {
  constructor() {
    this.loader = document.getElementById("loader");

    this.errorWrapper = document.getElementById("error-wrapper");
    this.errorMessage = document.getElementById("error-message");
    this.errorClose = document.getElementById("error-close");
    this.successWrapper = document.getElementById("success-wrapper");
    this.successMessage = document.getElementById("success-message");
    this.successClose = document.getElementById("success-close");

    this.errorClose.addEventListener("click", (e) => {
      this.errorWrapper.classList.add("hide");
    });
    if (this.successClose) {
      this.successClose.addEventListener("click", (e) => {
        this.successWrapper.classList.add("hide");
      });
    }

    const currentDomain = window.location.hostname;

    if (currentDomain.includes("webflow.io")) {
      this.branch = ":stage";
      this.dataSource = "stage";
    } else {
      this.branch = "";
      this.dataSource = "live";
    }
  }
  showError(message) {
    this.errorMessage.innerHTML = message;
    this.errorWrapper.classList.remove("hide");

    setTimeout(() => {
      this.errorWrapper.classList.add("hide");
    }, 3000);

    console.error("Error:", message);
  }
  showSuccess(message) {
    this.successMessage.innerHTML = message;
    this.successWrapper.classList.remove("hide");

    setTimeout(() => {
      this.successWrapper.classList.add("hide");
    }, 3000);
  }
  authenticate() {
    const failureRedirect = "/log-in";
    const authToken = localStorage.getItem("authToken");

    // If there's no auth token, redirect to the failure page if not already there
    if (!authToken) {
      if (
        window.location.pathname === "/registration" ||
        window.location.pathname === "/registration-2-4" ||
        window.location.pathname === "/registration-3-4" ||
        window.location.pathname === "/registration-4-4" ||
        window.location.pathname === "/forgotten-password" ||
        window.location.pathname === "/reset-password"
      ) {
        return;
      }
      if (window.location.pathname !== failureRedirect) {
        window.location.href = failureRedirect;
      }
      return;
    }

    // If there is a token, verify it with the API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code === "ERROR_CODE_UNAUTHORIZED") {
          if (
            window.location.pathname === "/registration" ||
            window.location.pathname === "/registration-2-4" ||
            window.location.pathname === "/registration-3-4" ||
            window.location.pathname === "/registration-4-4"
          ) {
            return;
          }

          localStorage.removeItem("authToken");
          if (window.location.pathname !== failureRedirect) {
            window.location.href = failureRedirect;
          }
        } else {
          if (result.archived) {
            localStorage.removeItem("authToken");

            window.location.href = "/log-in";
          }

          if (result.is_admin) {
            if (window.location.pathname !== "/admin-dashboard") {
              window.location.href = "/admin-dashboard";
            }
          } else {
            if (!result.is_verified) {
              if (window.location.pathname !== "/registration-3-4") {
                window.location.href = "/registration-3-4";
              }
            } else if (!result.is_active) {
              if (window.location.pathname !== "/registration-4-4") {
                window.location.href = "/registration-4-4";
              }
            } else {
              if (window.location.pathname !== "/user-dashboard") {
                window.location.href = "/user-dashboard";
              }
            }
          }
        }
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  me() {
    const authToken = localStorage.getItem("authToken");
    return fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/auth/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          this.showError("Server Error! Please, try again or contact support.");

          return;
        }

        return result;
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  register(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        this.loader.style.display = "none";

        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        if (result.authToken) {
          localStorage.setItem("authToken", result.authToken);

          window.location.href = "/registration-3-4";
        }
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  confirmCode(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/register/confirm-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        this.loader.style.display = "none";

        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        if (result.is_verified) {
          window.location.href = "/registration-4-4";
        }
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  login(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        if (result.authToken) {
          localStorage.setItem("authToken", result.authToken);

          this.authenticate();

          localStorage.removeItem("registerData");
        }
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  loginWithHash(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/auth/login-with-hash`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        if (result.authToken) {
          localStorage.setItem("authToken", result.authToken);

          this.authenticate();

          localStorage.removeItem("registerData");
        }
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  logOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("tourStage");

    window.location.href = "/log-in";
  }
  getAll(page = 1, perPage = 10, search = "") {
    const authToken = localStorage.getItem("authToken");

    let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/user?page=${page}&per_page=${perPage}`;
    if (search !== "") {
      url += `&search=${encodeURIComponent(search)}`;
    }

    // Call the Xano API
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "X-Data-Source": this.dataSource,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          this.showError("Server Error! Please, try again or contact support.");

          return;
        }

        return result;
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  getPrepopulatedUser(hash) {
    let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/prepopulated_users/${hash}`;

    // Call the Xano API
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Data-Source": this.dataSource,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          return null;
        }

        return result;
      })
      .catch((error) => {
        return null;
      });
  }
  initialPayment(data) {
    const authToken = localStorage.getItem("authToken");

    // Call the Xano API
    return fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:UQuTJ3vx${this.branch}/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          this.showError("Server Error! Please, try again or contact support.");

          return;
        }

        return result;
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  forgot(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/password/forgot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError("We can not find user with provided email address.");
          }

          return;
        }

        this.showSuccess(
          "Please check your Email for a link to reset password"
        );
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  reset(data) {
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:2vP05bpa${this.branch}/password/reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        window.location.href = "/log-in";
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  resendCode(data) {
    const authToken = localStorage.getItem("authToken");
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/register/resend-code`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.code) {
          if (result.message !== "") {
            this.showError(result.message);
          } else {
            this.showError(
              "Server Error! Please, try again or contact support."
            );
          }

          return;
        }

        this.showSuccess("Your code has been sent successfully!");
      })
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
  patchUser(userId, data) {
    const authToken = localStorage.getItem("authToken");
    // Call the Xano API
    fetch(
      `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/user/` +
        userId,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": this.dataSource,
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => {
        this.showError("Server Error! Please, try again or contact support.");
      });
  }
    sendReminder(userId) {
        const authToken =  localStorage.getItem('authToken');
        let url = `https://xjwh-2u0a-wlxo.n7d.xano.io/api:wGjIQByJ${this.branch}/send-user-reminder/` + userId;

        // Call the Xano API
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
                'X-Data-Source': this.dataSource,
            },
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.code) {
                    this.showError('Server Error! Please, try again or contact support.');

                    return false;
                }

                return true;
            })
            .catch((error) => {
                this.showError('Server Error! Please, try again or contact support.');
            });
    }
  callMethod(methodName, ...args) {
    if (typeof this[methodName] === "function") {
      return this[methodName](...args);
    } else {
      throw new Error(`Method "${methodName}" not exists.`);
    }
  }
}
