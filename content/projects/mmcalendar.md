---
num: 14
category: mobile
title: Myanmar Calendar
description: Useful myanmar calendar application.
image: /assets/work/myanmar_calendar.png
github: https://github.com/mixin27/mmcalendar
playstore: https://play.google.com/store/apps/details?id=dev.mixin27.mmcalendar
appstore:
live:
stacks: [{ name: "Flutter" }, { name: "Dart" }]
developers: ["Kyaw Zayar Tun"]
highlights: ["Flutter", "Firebase", "table_calendar", "flutter_mmcalendar"]
date: "2024-08-15"
---

The Myanmar Calendar app is a beautifully designed tool that brings the traditional Myanmar calendar to your fingertips. Built with Flutter, this app offers a seamless experience across devices, ensuring you stay connected with Myanmar’s rich cultural heritage.

| ![home_page](https://res.cloudinary.com/ds6vu9ry4/image/upload/v1724040484/projects/mmcalendar/home_page_zatg0z.png)                     | ![detail_page](https://res.cloudinary.com/ds6vu9ry4/image/upload/v1724040497/projects/mmcalendar/detail_page_rbe5pv.png)                     |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ![home_page_landscape](https://res.cloudinary.com/ds6vu9ry4/image/upload/v1724040479/projects/mmcalendar/home_page_landscape_hyarjl.png) | ![detail_page_landscape](https://res.cloudinary.com/ds6vu9ry4/image/upload/v1724040481/projects/mmcalendar/detail_page_landscape_rovegc.png) |

## Key Features:

- **Comprehensive Calendar Views**: The app provides both a month view and a detailed day view, allowing you to easily navigate through dates and access specific Myanmar calendar information, such as holidays, auspicious days, and important cultural events.

- **Multi-Language Support**: To cater to a diverse user base, the app supports multiple languages, including English, Myanmar Unicode, Myanmar Zawgyi, Karen, Mon, and Tai. You can switch languages effortlessly to suit your preference.

- **Cultural Insights**: Gain deeper insights into Myanmar’s traditions with detailed information about the Myanmar lunar calendar, astrological signs, and other culturally significant details that are integrated into the calendar.

- **User-Friendly Interface**: Designed with simplicity and ease of use in mind, the app’s intuitive interface ensures that navigating through dates and viewing Myanmar calendar information is a hassle-free experience.

Whether you're planning events, checking auspicious dates, or simply staying in tune with Myanmar’s cultural rhythms, the Myanmar Calendar app is your go-to companion.

## Libraries

- [flutter_mmcalendar](https://pub.dev/packages/flutter_mmcalendar)
- [table_calendar](https://pub.dev/packages/table_calendar)

## Project Setup

To clone the repo for the first time

```bash
git clone https://github.com/mixin27/mmcalendar.git
cd mmcalendar/
flutter packages get
```

Generate `build_runner` and `easy_localization`

```bash
# build_runner
dart run build_runner build

# easy_localization
dart run easy_localization:generate -S assets/translations -O lib/src/l10n -o locale_keys.g.dart -f keys
```

You will need to create firebase project to configure firebase

```bash
flutterfire configure
```

Go to onesignal, login or create an account and create an app. Then copy onesignalAppId and paste to `.env` file.
