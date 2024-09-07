---
num: 10
category: flutter package
title: Native ID
description: Flutter unique identifier plugin for android and ios.
image: /assets/work/dart.png
github: https://github.com/mixin27/flutter_native_id
playstore:
appstore:
live: https://pub.dev/packages/native_id
stacks: [{ name: "Flutter" }, { name: "Dart" }]
developers: ["Kyaw Zayar Tun"]
highlights: ["Flutter", "Kotlin", "Swift"]
date: "2023-01-01"
---

![Pub Version](https://img.shields.io/pub/v/native_id?style=flat-square&color=3297D1&link=https://pub.dev/packages/native_id)
[![License: MIT][license_badge]][license_link]

Get current device unique id from within the flutter application.

> **Warning:** In `android`, this plugin use the `ANDROID_ID` that can be change by user for the rooted device.

## Installation 💻

**❗ In order to start using `native_id` you must have the [Flutter SDK][flutter_install_link] installed on your machine.**

Add `native_id` to your `pubspec.yaml`:

```yaml
dependencies:
  native_id:
```

Install it:

```sh
flutter packages get
```

---

## Usage

Import `import 'package:native_id/native_id.dart';`, instantiate `NativeId` and use the `getId()` or `getUUID()` methods.

Example:

```dart
Future<String> getNativeId() async {
    final nativeIdPlugin = NativeId();
    try {
      final nativeId = await nativeIdPlugin.getId();
      return nativeId ?? 'Unknown native id';
    } on PlatformException {
      return 'Failed to get nativeId';
    }
}
```

[flutter_install_link]: https://docs.flutter.dev/get-started/install
[license_badge]: https://img.shields.io/badge/license-MIT-blue.svg
[license_link]: https://opensource.org/licenses/MIT
