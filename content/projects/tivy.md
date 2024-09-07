---
num: 09
category: flutter package
title: Tivy
description: Flutter package for getting video quality urls for vimeo and youtube
image: /assets/work/dart.png
github: https://github.com/mixin27/tivy
playstore:
appstore:
live: https://pub.dev/packages/tivy
stacks: [{ name: "Flutter" }, { name: "Dart" }]
developers: ["Kyaw Zayar Tun"]
highlights: ["Flutter"]
date: "2023-08-01"
---

[![style: very good analysis][very_good_analysis_badge]][very_good_analysis_link]
[![Powered by Mason](https://img.shields.io/endpoint?url=https%3A%2F%2Ftinyurl.com%2Fmason-badge)](https://github.com/felangel/mason)
[![License: MIT][license_badge]][license_link]
![Pub Version (including pre-releases)](https://img.shields.io/pub/v/tivy?style=flat-square&color=3297D1&link=https%3A%2F%2Fpub.dev%2Fpackages%2Ftivy)

Utility package for getting video quality urls for vimeo and youtube.

## Installation 💻

**❗ In order to start using Tivy you must have the [Flutter SDK][flutter_install_link] installed on your machine.**

Add `tivy` to your `pubspec.yaml`:

```yaml
dependencies:
  tivy:
```

Install it:

```sh
flutter packages get
```

---

## Usage

- Import package

  ```dart
  import 'package:tivy/tivy.dart';
  ```

- Use with vimeo video url

  ```dart
  final videoQualityUrls = await tivy.getVideoQualityUrls(
    'your_vimeo_video_url',
  );
  ```

- Use with vimeo video id

  ```dart
  final videoQualityUrls = await tivy.getVideoQualityUrls(
    'your_vimeo_video_id',
  );
  ```

- For vimeo private video

  ```dart
  final videoQualityUrls = await tivy.getPrivateVimeoVideoQualityUrls(
    'your_private_vimeo_video_id',
    {
      'key': 'value',
    },
  );
  ```

- For YouTube video url.

  ```dart
  final videoQualityUrls = await tivy.getYouTubeVideoQualityUrls(
    'your_youtube_video_url',
  );
  ```

- For YouTube live streaming video url.

  ```dart
  final videoQualityUrls = await tivy.getYouTubeVideoQualityUrls(
    'your_youtube_video_url',
    live: true,
  );
  ```

[flutter_install_link]: https://docs.flutter.dev/get-started/install
[license_badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license_link]: https://opensource.org/licenses/MIT
[very_good_analysis_badge]: https://img.shields.io/badge/style-very_good_analysis-B22C89.svg
[very_good_analysis_link]: https://pub.dev/packages/very_good_analysis
