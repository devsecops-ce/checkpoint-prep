# Checkpoint Prep — Setup Guide

Until you finish Part 1, the app works **offline on one device**, with no logins and no admin panel.
After Part 1 it switches to **multi-user mode** automatically: logins, cloud sync, and an admin panel.

---

## Part 1 (FREE): Turn on accounts and the admin panel (Supabase, about 10 minutes)

1. Go to **https://supabase.com**, sign up, and click **New project**.
   - Name: `checkpoint-prep`. Choose a strong database password and save it somewhere safe.
   - Region: the one closest to your students.
2. When the project is ready, open **SQL Editor → New query**.
   Open the file `supabase/schema.sql` from this folder, copy everything in it, paste it, and click **Run**.
   You should see "Success. No rows returned."
3. Open **Authentication → Sign In / Providers → Email**:
   - For the easiest start, turn **Confirm email** OFF, so students can log in straight away.
     Leave it ON if you want students to confirm their email address first.
4. Open **Project Settings → API** and copy two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **anon public** key (a long string starting `eyJ…`, or `sb_publishable_…`)
5. Open `config.js` in this folder and paste them in:
   ```js
   window.APP_CONFIG = {
     supabaseUrl: "https://abcdxyz.supabase.co",
     supabaseAnonKey: "eyJ...",
   };
   ```
6. Open `index.html` and click **New student? Create account**.
   **The very first account you create becomes the admin.** Create yours first.
   You don't need a join code for this first account.
7. As admin, go to **🛠 Admin → Settings** and set your **class join code**. The default is `CHECKPOINT8`.
   Give this code to your students. They use it to create their own accounts.

### What the admin panel does
| Tab | What you can do |
|---|---|
| **Overview** | Student count, how many were active this week, the class average, students who need attention (low scores or inactive), and the class's weakest topics |
| **Students** | Search; click a student to see per-subject scores, weak topics and every attempt; rename them; make them admin; disable or re-enable their account; export a CSV |
| **Subjects** | Average score per test and the weakest topics for each subject |
| **Settings** | Join code, school name, CSV export of every result |

### Security
- Students see only their own data. Only admins can see everyone's results.
- Students can't make themselves admin or read the join code.
- A disabled account can't save anything.
- Every student can delete their own account and data (**Dashboard → My account**). The App Store requires this.

---

## Part 2 (FREE): Put it online and install it on iPhone, iPad and Android

There's no Apple fee and no App Store. The app installs from Safari and works offline after the first visit.

1. Open the **Terminal** app and run:
   `~/Desktop/Checkpoint/tools/make-site.sh`
   This creates the folder `Checkpoint/site`, about 1 MB.
2. Go to **https://app.netlify.com/drop** and sign up free with email or GitHub.
   Drag the **`site`** folder onto the page.
   After about 10 seconds you get a link like `https://checkpoint-prep-123.netlify.app`.
   You can rename it under **Site configuration → Change site name**.
3. Send that link to students.
   - **iPhone/iPad:** open the link in **Safari** → tap **Share** (□↑) → **Add to Home Screen** → **Add**.
   - **Android:** open in Chrome → **⋮** → **Install app**.
   - **Computer:** just use the link, or click the install icon in Chrome's address bar.
4. **Updating:** after changing content, run step 1 again. Then in Netlify open **Deploys** and drag the new `site` folder there.
   Before running step 1, also raise `VERSION` at the top of `sw.js` (for example `cp8-v1` → `cp8-v2`), so installed apps download the update.

**Free plan limits:** Netlify's free plan is far more than a class needs.
A free Supabase project **pauses after 7 days with no activity**. If that happens, log in at supabase.com and click **Restore**. Regular student use keeps it awake.

---

## Part 3 (optional, $99/year): Native App Store / TestFlight app

**You need:** this Mac with Xcode (already installed) and an **Apple Developer Program** membership ($99/year, https://developer.apple.com/programs/).

1. Finish Part 1 first. The iOS app reads the same `config.js`.
2. Open `ios/CheckpointPrep.xcodeproj` in Xcode.
3. Click **CheckpointPrep** (the blue icon) → **Signing & Capabilities**:
   - **Team:** choose your developer account.
   - **Bundle Identifier:** change `com.checkpointprep.app` to something unique to you, for example `com.yourname.checkpointprep`.
4. Try it on your own iPhone: plug it in, choose it at the top of Xcode, and press ▶︎.
5. Create the App Store record at **https://appstoreconnect.apple.com → Apps → +**, using the same Bundle ID.
6. In Xcode choose **Any iOS Device**, then **Product → Archive → Distribute App → App Store Connect → Upload**.
7. In App Store Connect → **TestFlight**, add testers by email. They install with the free TestFlight app.
   For a public release, fill in the store listing and submit it for review.

### Things Apple will ask for
- **Privacy policy URL:** required. Say that you store each student's name, email and test scores so the app can work, and that nothing is shared or sold.
- **App Privacy:** Name, Email address, and Other user content (test scores), all *linked to the user*, used for *App Functionality*, with **no tracking**. This matches the privacy manifest already in the app.
- **Age rating:** fill in the questionnaire. The app has no objectionable content.
  Don't put it in the **Kids** category; that category has extra rules about logins.
- **Review notes:** give Apple a test student login (email and password) so the reviewer can sign in.
- **Encryption:** already answered in the app ("standard HTTPS only"), so Apple won't ask.

### Updating content later
Edit the files in `data/`, `app.js` and the other app files, as usual. The iOS app copies them in every time it builds.
For a new iOS version, raise **Build** (and **Version**, if needed) in Xcode, then archive and upload again.

If you ever change `ios/project.yml`, regenerate the Xcode project with `cd ios && xcodegen`.

---

## Files
| Path | What it is |
|---|---|
| `index.html`, `app.js`, `styles.css` | The app |
| `data/*.js` | Subject content: notes, tests and papers |
| `config.js` | Your Supabase connection; empty means offline mode |
| `cloud.js`, `admin.js` | Accounts and sync, and the admin panel |
| `supabase/schema.sql` | Database tables and security rules |
| `ios/` | The iOS Xcode project |
| `tools/validate.js` | Checks subject content: `node tools/validate.js` |
