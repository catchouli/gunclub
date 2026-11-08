// Club details that change from time to time.
// Edit this file to update opening hours, the notice banner, fees or the diary;
// the page is built from it, so there's no need to touch the HTML.
//
// Anything marked tbc: true shows up highlighted on the page as needing confirmation.

window.CLUB = {
  name: "Altrincham Rifle and Pistol Club",

  // Banner shown under the header. Set to null to hide it.
  notice: {
    text: "Our waiting list is currently full. Holders of a firearm certificate (FAC) can still apply.",
    linkText: "Join the waiting list",
    link: "#join",
  },

  // Existing Google Form for new-member enquiries from FAC holders.
  facForm: "https://forms.gle/QravD4CWapjbN2Sj7",

  policies: [
    { name: "GDPR policy", url: "https://www.altrinchamrpc.co.uk/_files/ugd/c23462_2145533a7e174d6e9578d0e83b10d936.pdf" },
    { name: "Cookie policy", url: "https://www.altrinchamrpc.co.uk/_files/ugd/c23462_fcde4affa86e402aa985d1a75893e9b4.pdf" },
  ],

  disciplines: {
    air: {
      name: "Air rifle & pistol",
      short: "Air",
      points: "6 firing points with electronic target changers",
      blurb:
        "The best place to start. Precision air rifle and pistol with top-quality club guns to borrow free of charge, and experienced members to take you from complete novice to competition shooter.",
      image: "assets/img/air-pistol.jpg",
      imageAlt: "A match air pistol and a tin of pellets on the bench, with an electronic target changer beside them",
    },
    sporting: {
      name: "Sporting rifle",
      short: "Sporting",
      points: "5 firing points, shared with target rifle",
      blurb:
        "Shot standing or seated, with less kit than target rifle. Shoot casually or stretch yourself in competitions alongside members with a strong national record. Club rifles available to borrow free.",
      image: "assets/img/sporting-rifle.jpg",
      imageAlt: "A scoped .22 rifle on a green shooting bench next to a scored target and spent cases",
    },
    target: {
      name: "Target rifle",
      short: "Target",
      points: "5 firing points, shared with sporting rifle",
      blurb:
        "Shot from the very stable prone position, with jackets and slings: this is all about accuracy and competition. The club has some of the best target shooters in the country. Club rifles available to borrow free.",
      image: "assets/img/range-lane.jpg",
      imageAlt: "A prone shooting mat with a target rifle, shooting glove and spotting scope, looking down the range",
    },
  },

  // day: 0 = Sunday, 1 = Monday ... 6 = Saturday
  // fridays: "first3" means the first three Fridays of the month only.
  sessions: [
    { discipline: "air", days: [1, 2, 3, 4], start: "19:30", end: "21:30" },
    { discipline: "air", days: [5], start: "19:30", end: "21:30", fridays: "first3" },
    { discipline: "air", days: [0], start: "10:30", end: "12:30" },

    { discipline: "sporting", days: [2, 4], start: "19:30", end: "21:30" },
    { discipline: "sporting", days: [5], start: "19:30", end: "21:30", fridays: "first3" },
    { discipline: "sporting", days: [0], start: "10:30", end: "12:30" },

    { discipline: "target", days: [1, 3], start: "19:30", end: "21:30" },
  ],
  lastEntryMinutes: 30,

  fees: [
    { item: "Joining fee", amount: "£TBC", tbc: true },
    { item: "Annual membership (adult)", amount: "£TBC", tbc: true },
    { item: "Annual membership (junior / concession)", amount: "£TBC", tbc: true },
    { item: "Pellets & ammunition", amount: "Pay as you shoot", tbc: true },
  ],

  // Upcoming events. In the real site these would come from a shared Google Calendar.
  events: [
    { date: "2026-11-15", title: "Club air pistol league, round 3", type: "Competition", example: true },
    { date: "2026-11-22", title: "Range working party", type: "Working party", example: true },
    { date: "2026-12-06", title: "Guest day: come and try air rifle", type: "Guest day", example: true },
    { date: "2026-12-13", title: "Christmas shoot & mince pies", type: "Social", example: true },
  ],

  contact: {
    phone: "0161 941 3857",
    email: "altrinchamrpc@gmail.com",
    facebook: "https://www.facebook.com/altrinchamtsc",
    // Deliberately just the town. The club doesn't publish its address.
    address: "Altrincham",
    addressTbc: false,
  },
};
