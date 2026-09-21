# Longest Chariot 🏎️

Official website and product showcase for **Longest Chariot**, an independent product and software development studio.

---

## 🌟 Featured Apps & Projects

| App | Platform | Status | Description |
| :--- | :--- | :--- | :--- |
| **[TapToTalker](https://taptotalker.netlify.app/)** | Web App | `Live` | Responsive AAC communication helper for non-verbal individuals, featuring a tap-based voice & symbol interface. |
| **[RecipeNepal](https://receipenepal.com/)** | Web App | `Live` | Authentic Nepali recipes, culinary guides, and cultural food heritage from momo to sel roti. |
| **[Tom's Boat Repair](https://tomsboatrepair.com/)** | Web App | `Live` | Mobile marine mechanic portal providing dockside diagnostics, overhaul services, and emergency towing in Greater LA. |
| **TrailKeep** | iOS & Android | `In Development` | Backcountry offline navigation companion with topographic maps, waypoint logging, and trail telemetry. |
| **Roundtable** | Web App | `Private Alpha` | Team alignment software integrating collaborative agendas, automated follow-ups, and meeting action items. |

---

## 🛠️ Tech Stack

- **HTML5 & CSS3**
- **[Tailwind CSS](https://tailwindcss.com/)** (CDN-backed utility classes)
- **Vanilla JavaScript** (ES6+) for interactive features:
  - Live category filtering (All, Web, Mobile)
  - Real-time client-side search across title, tags, and descriptions
  - Dynamic subject auto-fill based on URL parameters (`?project=...`)
  - Form validation with asynchronous Formspree submission
  - Responsive mobile drawer navigation & scroll animations

---

## 📁 Project Structure

```text
.
├── index.html                  # Studio homepage & capabilities
├── apps.html                   # Apps portfolio page with filters & search
├── contact.html                # Contact and inquiry form with validation
├── functions/
│   └── api/
│       └── contact.js          # Cloudflare Pages Function (Email Routing dispatcher)
├── css/
│   └── style.css               # Custom typography, wheel animations, card transitions
├── js/
│   └── main.js                 # Filter engine, scroll reveal, mobile nav, form submission
└── .gitignore                  # Git ignore rules
```

---

## 🚀 Deployment & Cloudflare Setup

Deploy on **Cloudflare Pages** with zero build configuration:
- **Build command**: *(leave empty)*
- **Build output directory**: `/`

### 📧 Email Routing Integration:
Submissions to the contact form are dispatched through `functions/api/contact.js` directly to your official email via Cloudflare Email Routing.
- Optional: In **Cloudflare Pages** > **Settings** > **Functions**, you can add a **Send Email** binding named `CONTACT_EMAIL` pointing to your domain's email router.

---

## 📬 Contact & Support

- **General Inquiries & Collaboration**: [contact@longestchariot.com](mailto:contact@longestchariot.com)
- **Product Support & Help**: [help@longestchariot.com](mailto:help@longestchariot.com)

---

&copy; Longest Chariot. All rights reserved.
