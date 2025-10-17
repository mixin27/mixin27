"use client"

import React from 'react'

const Page = () => {
    return (
        <section className='my-4'>
            <h1 className='text-4xl'>Privacy Policy for Myanmar Calendar App</h1>
            <p className='text-base bold'><strong>Last Updated: 14th October, 2025</strong></p>
            <h2 id="introduction" className='text-3xl'>Introduction</h2>
            <p>Thank you for using Myanmar Calendar (&quot;we,&quot; &quot;our,&quot; or &quot;the App&quot;). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our mobile application.</p>
            <hr />
            <h2 id="information-we-collect">Information We Collect</h2>
            <h3 id="1-information-we-do-not-collect">1. Information We DO NOT Collect</h3>
            <p>Myanmar Calendar is designed with privacy in mind. <strong>We do NOT collect, store, or transmit any of the following:</strong></p>
            <ul>
                <li>❌ Personal identification information (name, email, phone number)</li>
                <li>❌ Location data or GPS coordinates</li>
                <li>❌ Device identifiers (IMEI, MAC address, etc.)</li>
                <li>❌ Usage analytics or behavioral tracking</li>
                <li>❌ Contact lists or social media information</li>
                <li>❌ Payment information (app is free)</li>
                <li>❌ Any data that leaves your device</li>
            </ul>
            <h3 id="2-information-stored-locally-on-your-device">2. Information Stored Locally on Your Device</h3>
            <p>The following data is stored <strong>ONLY</strong> on your device and never transmitted to our servers:</p>
            <ul>
                <li><strong>App Settings</strong>: Your theme preferences, language selection, calendar configuration</li>
                <li><strong>User Events</strong> (Future Feature): Events and reminders you create (Phase 2)</li>
                <li><strong>Custom Holidays</strong> (Future Feature): Personal holidays you add (Phase 2)</li>
                <li><strong>Notes</strong> (Future Feature): Notes you create (Phase 2)</li>
            </ul>
            <p><strong>Important</strong>: All data is stored locally using secure SQLite database on your device. We have no access to this data.</p>
            <hr />
            <h2 id="how-we-use-information">How We Use Information</h2>
            <p>Since we don&#39;t collect any data, we don&#39;t use your information for any purpose. The app functions entirely offline on your device.</p>
            <h3 id="app-functionality">App Functionality</h3>
            <p>The app performs calendar calculations locally on your device using:</p>
            <ul>
                <li>Myanmar calendar algorithms</li>
                <li>Astrological calculations</li>
                <li>Date conversions</li>
                <li>Holiday lookups</li>
            </ul>
            <p><strong>All calculations happen on your device without any network communication.</strong></p>
            <hr />
            <h2 id="data-sharing-and-third-parties">Data Sharing and Third Parties</h2>
            <h3 id="we-do-not-share-data-with-">We Do NOT Share Data With:</h3>
            <ul>
                <li>❌ Third-party analytics services</li>
                <li>❌ Advertising networks</li>
                <li>❌ Social media platforms</li>
                <li>❌ Government agencies (unless legally required)</li>
                <li>❌ Any other third parties</li>
            </ul>
            <h3 id="third-party-services">Third-Party Services</h3>
            <p>Myanmar Calendar does <strong>NOT</strong> use any third-party services that collect data, including:</p>
            <ul>
                <li>No analytics (Google Analytics, Firebase Analytics, etc.)</li>
                <li>No crash reporting tools</li>
                <li>No advertising networks</li>
                <li>No social media SDKs</li>
                <li>No cloud services (in current version)</li>
            </ul>
            <h3 id="future-cloud-backup-feature-phase-3-">Future Cloud Backup Feature (Phase 3)</h3>
            <p>In a future update, we plan to offer <strong>optional</strong> cloud backup functionality:</p>
            <ul>
                <li>This will be <strong>opt-in only</strong> (disabled by default)</li>
                <li>You will be able to choose your backup provider (Firebase, custom server)</li>
                <li>Data will be encrypted before upload</li>
                <li>You can delete your cloud data anytime</li>
                <li>We will update this policy before implementing this feature</li>
            </ul>
            <hr />
            <h2 id="data-storage-and-security">Data Storage and Security</h2>
            <h3 id="local-storage">Local Storage</h3>
            <p>All data is stored on your device using:</p>
            <ul>
                <li><strong>SQLite Database</strong>: Encrypted local database</li>
                <li><strong>Secure Storage</strong>: Android/iOS secure storage mechanisms</li>
                <li><strong>No Cloud</strong>: Data stays on your device</li>
            </ul>
            <h3 id="security-measures">Security Measures</h3>
            <p>Even though data doesn&#39;t leave your device, we implement security best practices:</p>
            <ul>
                <li>✅ Secure coding practices</li>
                <li>✅ Regular security updates</li>
                <li>✅ Input validation and sanitization</li>
                <li>✅ Protection against common vulnerabilities</li>
            </ul>
            <hr />
            <h2 id="permissions">Permissions</h2>
            <h3 id="android-permissions">Android Permissions</h3>
            <p>Myanmar Calendar requests <strong>minimal permissions</strong>:</p>
            <h4 id="currently-used-permissions-">Currently Used Permissions:</h4>
            <ul>
                <li><strong>NONE</strong> - The app requires no permissions in Version 2.0</li>
            </ul>
            <h4 id="future-permissions-optional-features-">Future Permissions (Optional Features):</h4>
            <p><strong>Phase 2 (Events &amp; Notifications):</strong></p>
            <ul>
                <li><code>VIBRATE</code>: For haptic feedback and reminder vibrations</li>
                <li><code>POST_NOTIFICATIONS</code> (Android 13+): For event reminders</li>
                <li><code>SCHEDULE_EXACT_ALARM</code>: For precise reminder timing</li>
            </ul>
            <p><strong>Phase 3 (Cloud Backup - Optional):</strong></p>
            <ul>
                <li><code>INTERNET</code>: Only if you enable cloud backup feature</li>
                <li><code>ACCESS_NETWORK_STATE</code>: To check internet connectivity for backup</li>
            </ul>
            <h3 id="ios-permissions">iOS Permissions</h3>
            <ul>
                <li><strong>Notifications</strong>: Only if you enable event reminders (Phase 2)</li>
                <li><strong>Internet</strong>: Only if you enable cloud backup (Phase 3, opt-in)</li>
            </ul>
            <p><strong>All permissions are requested only when needed and with clear explanation.</strong></p>
            <hr />
            <h2 id="children-s-privacy">Children&#39;s Privacy</h2>
            <p>Myanmar Calendar is suitable for all ages, including children under 13. Since we don&#39;t collect any personal information, the app complies with COPPA (Children&#39;s Online Privacy Protection Act) and similar international regulations.</p>
            <p>We do not:</p>
            <ul>
                <li>Collect personal information from children</li>
                <li>Allow children to share personal information</li>
                <li>Target advertising to children (we have no ads)</li>
            </ul>
            <hr />
            <h2 id="your-rights-and-choices">Your Rights and Choices</h2>
            <h3 id="data-control">Data Control</h3>
            <p>You have full control over your data:</p>
            <ol>
                <li><strong>View Data</strong>: All data is stored locally; you control it</li>
                <li><strong>Delete Data</strong>: Uninstall the app to remove all data</li>
                <li><strong>Export Data</strong> (Future): Export your events and notes (Phase 2)</li>
                <li><strong>No Tracking</strong>: We don&#39;t track you, so nothing to opt-out of</li>
            </ol>
            <h3 id="app-settings">App Settings</h3>
            <p>You can control:</p>
            <ul>
                <li>Theme and appearance</li>
                <li>Language preferences</li>
                <li>Calendar configuration</li>
                <li>Display settings</li>
            </ul>
            <p>These settings are stored locally and can be reset anytime.</p>
            <hr />
            <h2 id="data-retention">Data Retention</h2>
            <h3 id="local-data">Local Data</h3>
            <ul>
                <li>Stored indefinitely on your device until you delete it</li>
                <li>Removed completely when you uninstall the app</li>
                <li>No backup unless you explicitly enable it (Phase 3)</li>
            </ul>
            <h3 id="cloud-data-future-feature-">Cloud Data (Future Feature)</h3>
            <ul>
                <li>Only if you opt-in to cloud backup</li>
                <li>You can delete anytime from settings</li>
                <li>Deleted within 30 days of request</li>
            </ul>
            <hr />
            <h2 id="changes-to-this-privacy-policy">Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be reflected by updating the &quot;Last Updated&quot; date at the top of this policy.</p>
            <h3 id="how-we-notify-you">How We Notify You</h3>
            <ul>
                <li>In-app notification for major changes</li>
                <li>Updated policy in app settings</li>
                <li>Play Store/App Store description update</li>
            </ul>
            <h3 id="your-continued-use">Your Continued Use</h3>
            <p>Continued use of the app after policy changes constitutes acceptance of those changes.</p>
            <hr />
            <h2 id="international-users">International Users</h2>
            <p>Myanmar Calendar is available worldwide. Since we don&#39;t collect data, we automatically comply with international privacy regulations including:</p>
            <ul>
                <li>🇪🇺 <strong>GDPR</strong> (European Union General Data Protection Regulation)</li>
                <li>🇺🇸 <strong>CCPA</strong> (California Consumer Privacy Act)</li>
                <li>🇬🇧 <strong>UK GDPR</strong> (United Kingdom)</li>
                <li>🇨🇦 <strong>PIPEDA</strong> (Canada)</li>
                <li>🇦🇺 <strong>Privacy Act</strong> (Australia)</li>
                <li>🇧🇷 <strong>LGPD</strong> (Brazil)</li>
            </ul>
            <hr />
            <h2 id="open-source-components">Open Source Components</h2>
            <p>Myanmar Calendar uses open-source packages that have their own privacy policies:</p>
            <ul>
                <li><strong>Flutter Framework</strong>: <a href="https://flutter.dev/privacy">flutter.dev/privacy</a></li>
                <li><strong>Dart Language</strong>: <a href="https://dart.dev/privacy">dart.dev/privacy</a></li>
            </ul>
            <p>No open-source component we use collects personal data.</p>
            <hr />
            <h2 id="contact-us">Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or our privacy practices:</p>
            <h3 id="email">Email</h3>
            <p>kyawzayartun.contact@gmail.com</p>
            <h3 id="website">Website</h3>
            <p><a href="https://www.kyawzayartun.com/myanmar-calendar-app/privacy">https://www.kyawzayartun.com/myanmar-calendar-app/privacy</a></p>
            <h3 id="mailing-address">Mailing Address</h3>
            <p>Your Company Name
                Street Address
                City, State/Region ZIP
                Country</p>
            <h3 id="response-time">Response Time</h3>
            <p>We aim to respond to all inquiries within 48 hours.</p>
            <hr />
            <h2 id="transparency-report">Transparency Report</h2>
            <p>As of [Date]:</p>
            <ul>
                <li><strong>Total user data collected</strong>: 0 bytes</li>
                <li><strong>Data breaches</strong>: 0</li>
                <li><strong>Government data requests</strong>: 0</li>
                <li><strong>Third-party data sharing</strong>: None</li>
            </ul>
            <p>We are committed to transparency and will publish updates quarterly.</p>
            <hr />
            <h2 id="legal-basis-for-processing-gdpr-">Legal Basis for Processing (GDPR)</h2>
            <p>For EU users, even though we don&#39;t process personal data, our legal basis would be:</p>
            <ul>
                <li><strong>Legitimate Interest</strong>: Providing calendar functionality</li>
                <li><strong>Consent</strong>: If you opt-in to future features like cloud backup</li>
            </ul>
            <hr />
            <h2 id="your-privacy-rights">Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <h3 id="right-to-access">Right to Access</h3>
            <p>You can access all your data anytime (it&#39;s on your device)</p>
            <h3 id="right-to-deletion">Right to Deletion</h3>
            <p>Uninstall the app to delete all data</p>
            <h3 id="right-to-portability">Right to Portability</h3>
            <p>Future feature will allow data export (Phase 2)</p>
            <h3 id="right-to-rectification">Right to Rectification</h3>
            <p>You can modify all data through the app interface</p>
            <h3 id="right-to-object">Right to Object</h3>
            <p>You can disable any features you don&#39;t want to use</p>
            <hr />
            <h2 id="cookies-and-tracking">Cookies and Tracking</h2>
            <p>Myanmar Calendar does <strong>NOT</strong> use:</p>
            <ul>
                <li>❌ Cookies</li>
                <li>❌ Tracking pixels</li>
                <li>❌ Web beacons</li>
                <li>❌ Fingerprinting</li>
                <li>❌ Any tracking technology</li>
            </ul>
            <hr />
            <h2 id="advertising">Advertising</h2>
            <p>Myanmar Calendar is <strong>100% ad-free</strong>. We will never:</p>
            <ul>
                <li>Show advertisements</li>
                <li>Sell ad space</li>
                <li>Share data with advertisers</li>
                <li>Track you for advertising purposes</li>
            </ul>
            <hr />
            <h2 id="updates-and-notifications">Updates and Notifications</h2>
            <h3 id="app-updates">App Updates</h3>
            <ul>
                <li>Downloaded through official app stores (Google Play, App Store)</li>
                <li>No data collection during updates</li>
            </ul>
            <h3 id="push-notifications">Push Notifications</h3>
            <ul>
                <li>Only local notifications (on your device)</li>
                <li>For event reminders you create</li>
                <li>No marketing or promotional notifications</li>
            </ul>
            <hr />
            <h2 id="commitment-to-privacy">Commitment to Privacy</h2>
            <p>At Myanmar Calendar, <strong>privacy is not an afterthought—it&#39;s a fundamental principle.</strong></p>
            <p>We believe:</p>
            <ul>
                <li>✅ Your data belongs to you</li>
                <li>✅ Privacy is a human right</li>
                <li>✅ Apps can be useful without surveillance</li>
                <li>✅ Transparency builds trust</li>
            </ul>
            <hr />
            <h2 id="summary">Summary</h2>
            <p><strong>In plain English:</strong></p>
            <p>Myanmar Calendar:</p>
            <ul>
                <li>✅ Works completely offline</li>
                <li>✅ Collects zero data</li>
                <li>✅ Tracks nothing</li>
                <li>✅ No ads, ever</li>
                <li>✅ Your data stays on your device</li>
                <li>✅ No third-party services</li>
                <li>✅ Open and transparent</li>
            </ul>
            <p><strong>We can&#39;t misuse data we don&#39;t have.</strong></p>
            <hr />
            <p><strong>Last Updated</strong>: 2025/10/14
                <strong>Version</strong>: 1.1
                <strong>Effective Date</strong>: 2025/10/14</p>
            <hr />
            <p>© 2024 Kyaw Zayar Tun. All rights reserved.</p>
        </section>
    )
}

export default Page
