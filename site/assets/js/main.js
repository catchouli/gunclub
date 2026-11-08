(function () {
  "use strict";

  const club = window.CLUB;
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, props = {}, children = []) => {
    const node = Object.assign(document.createElement(tag), props);
    for (const child of [].concat(children)) {
      node.append(child instanceof Node ? child : document.createTextNode(child));
    }
    return node;
  };
  const tbc = (text) => el("span", { className: "tbc", title: "Needs confirming" }, text);

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first
  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  // Notice banner
  if (club.notice) {
    const notice = $("#notice");
    notice.append(
      el("div", { className: "wrap" }, [
        el("p", {}, [
          club.notice.text + " ",
          el("a", { href: club.notice.link }, club.notice.linkText + " →"),
        ]),
      ])
    );
    notice.hidden = false;
  }

  // Discipline cards
  const cards = $("#discipline-cards");
  for (const [key, d] of Object.entries(club.disciplines)) {
    const times = club.sessions
      .filter((s) => s.discipline === key)
      .map((s) => {
        const days = s.days.map((n) => DAYS[n].slice(0, 3)).join(", ");
        const note = s.fridays === "first3" ? " (first 3 of the month)" : "";
        return `${days}${note} ${s.start}–${s.end}`;
      });
    cards.append(
      el("article", { className: `card card-${key}` }, [
        el("img", { src: d.image, alt: d.imageAlt, loading: "lazy" }),
        el("div", { className: "card-body" }, [
          el("h3", {}, d.name),
          el("p", { className: "card-points" }, d.points),
          el("p", {}, d.blurb),
          el("ul", { className: "card-times" }, times.map((t) => el("li", {}, t))),
        ]),
      ])
    );
  }

  // Weekly timetable
  $("#last-entry").textContent =
    `Last admittance is ${club.lastEntryMinutes} minutes before closing. ` +
    "Sporting and target rifle share the same five firing points, on different nights.";

  const legend = $("#legend");
  for (const [key, d] of Object.entries(club.disciplines)) {
    legend.append(el("span", { className: `chip chip-${key}` }, d.name));
  }

  const now = new Date();
  const today = now.getDay();
  const timetable = $("#timetable");
  for (const day of WEEK_ORDER) {
    const sessions = club.sessions
      .filter((s) => s.days.includes(day))
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const list = el(
      "ul",
      {},
      sessions.length
        ? sessions.map((s) =>
            el("li", { className: `session chip-${s.discipline}` }, [
              el("strong", {}, club.disciplines[s.discipline].name),
              el("span", {}, `${s.start}–${s.end}`),
              s.fridays === "first3" ? el("em", {}, "First 3 Fridays of the month") : "",
            ])
          )
        : [el("li", { className: "closed" }, "Closed")]
    );
    const col = el("div", { className: "day" + (day === today ? " is-today" : "") }, [
      el("h3", {}, [DAYS[day], day === today ? el("span", { className: "today-tag" }, "Today") : ""]),
      list,
    ]);
    timetable.append(col);
  }

  // "Open now" line in the hero
  const isFridayRunning = (date) => date.getDate() <= 21; // first three Fridays fall on the 1st–21st
  const runsOn = (s, date) =>
    s.days.includes(date.getDay()) && (s.fridays !== "first3" || isFridayRunning(date));
  const minsNow = now.getHours() * 60 + now.getMinutes();
  const openNow = club.sessions.filter(
    (s) => runsOn(s, now) && minsNow >= toMinutes(s.start) && minsNow < toMinutes(s.end)
  );
  const openNowEl = $("#open-now");
  if (openNow.length) {
    const names = openNow.map((s) => club.disciplines[s.discipline].name).join(" and ");
    openNowEl.innerHTML = "";
    openNowEl.append(el("span", { className: "dot dot-open" }), `Open now: ${names}, until ${openNow[0].end}`);
  } else {
    // Find the next session in the coming week.
    let next = null;
    for (let i = 0; i < 8 && !next; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const upcoming = club.sessions
        .filter((s) => runsOn(s, date) && (i > 0 || toMinutes(s.start) > minsNow))
        .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
      if (upcoming.length) next = { date, session: upcoming[0], offset: i };
    }
    if (next) {
      const when =
        next.offset === 0 ? "today" : next.offset === 1 ? "tomorrow" : DAYS[next.date.getDay()];
      openNowEl.append(
        el("span", { className: "dot" }),
        `Closed now. Next open ${when} at ${next.session.start}`
      );
    }
  }

  // Fees
  const fees = $("#fees");
  for (const f of club.fees) {
    fees.append(
      el("tr", {}, [el("th", { scope: "row" }, f.item), el("td", {}, f.tbc ? tbc(f.amount) : f.amount)])
    );
  }
  $("#fac-link").href = club.facForm;

  // Diary
  const events = $("#events");
  const fmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
  for (const ev of club.events) {
    const date = new Date(ev.date + "T12:00:00");
    const [weekday, day, month] = fmt.formatToParts(date).filter((p) => p.type !== "literal").map((p) => p.value);
    events.append(
      el("li", { className: "event" }, [
        el("time", { dateTime: ev.date }, [
          el("span", {}, weekday),
          el("strong", {}, day),
          el("span", {}, month),
        ]),
        el("div", {}, [
          el("span", { className: "event-type" }, ev.type),
          el("h3", {}, ev.title),
          ev.example ? el("span", { className: "tbc", title: "Example event" }, "Example event") : "",
        ]),
      ])
    );
  }

  // Contact details
  const c = club.contact;
  $("#address").append(c.addressTbc ? tbc(c.address) : c.address);
  const icon = (path) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<path d="${path}" fill="currentColor"/>`;
    return svg;
  };
  const contactList = $("#contact-list");
  contactList.append(
    el("li", {}, [
      icon("M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1Z"),
      el("a", { href: "tel:" + c.phone.replace(/\s/g, "") }, c.phone),
    ]),
    el("li", {}, [
      icon("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.5l8 5 8-5V6H4Zm16 2.85-8 5-8-5V18h16V8.85Z"),
      el("a", { href: "mailto:" + c.email }, c.email),
    ]),
    el("li", {}, [
      icon("M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8Z"),
      el("a", { href: c.facebook, target: "_blank", rel: "noopener" }, "Follow us on Facebook"),
    ])
  );

  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#form-status").textContent =
      "Thanks! (This is a mockup, so nothing was sent. The real form would email the club.)";
    e.target.reset();
  });

  // Footer
  const footerLinks = $("#footer-links");
  for (const p of club.policies) {
    footerLinks.append(el("li", {}, el("a", { href: p.url, target: "_blank", rel: "noopener" }, p.name)));
  }
  footerLinks.append(el("li", {}, el("a", { href: c.facebook, target: "_blank", rel: "noopener" }, "Facebook")));
  $("#year").textContent = now.getFullYear();

  // Disabled placeholder buttons
  document.querySelectorAll('[aria-disabled="true"]').forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault())
  );

  // Mobile nav
  const toggle = $(".nav-toggle");
  const nav = $("#site-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    }
  });

  // Gallery lightbox
  const lightbox = $("#lightbox");
  document.querySelectorAll(".gallery button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      lightbox.querySelector("img").src = btn.dataset.full;
      lightbox.querySelector("img").alt = img.alt;
      lightbox.querySelector(".lightbox-caption").textContent = btn.querySelector("span").textContent;
      lightbox.showModal();
    })
  );
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.close();
  });
})();
