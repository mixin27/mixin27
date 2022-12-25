---
title: What is Solid JS?
description: A short introduction to Solid JS. Learn about Solid JS and its features, and build modern web applications.
author: Filip Jerga
authorImage: https://cdn.sanity.io/images/55mm68d3/production/9db58be7d6d8ec2962b8754c8e89316afc190733-460x460.png
coverImage: https://cdn.sanity.io/images/55mm68d3/production/885967b5cf6fbb9e763351ed2e08eebb61c8cdf1-1300x731.jpg?h=600&fm=jpg&q=70
date: "2022-12-24"
originalPostLink: https://eincode.com/blogs/what-is-solid-js
---

## Resources

Complete Solid JS Course (Twitter Like App): [https://academy.eincode.com/courses/solid-js-firebase-the-complete-guide-twitter-clone-app](https://academy.eincode.com/courses/solid-js-firebase-the-complete-guide-twitter-clone-app)

## What is Solid JS?

Solid JS is a modern Javascript library for building user interfaces that primarily rely on components. Does it ring the bell? Yes, it sounds similar to React JS, and there is a reason for it.

Solid JS uses JSX, Component architecture, and unidirectional data flow.

## Core Features

Before you dive into the reading, let's show where Solid JS shines, and that's the speed.

Here are the metrics published on Solid JS's official website.

![](https://cdn.sanity.io/images/55mm68d3/production/1e13e68dc445b47540e33f68cbcbb2804442489c-1294x746.webp?h=800&q=90&fit=max)

The JS Framework Benchmark compares browser performance across a wide range of tests. Lower is better — https://www.solidjs.com/.

## Components

Code in Solid JS is organized in a component-like structure. A component should usually represent one part of the UI.

A component returns JSX (view to render). It can also contain code to register lifecycle and effect functions and can contain reactive data. A component is called only once (unlike React JS, where components are re-executed as many times as state changes).

You can think of it as a constructor function.

In the example below, you can see a simple Solid JS app.

![](https://cdn.sanity.io/images/55mm68d3/production/0579ed8aa2e77af50d931e07da632cf20b504798-600x338.gif?h=800&q=90&fit=max)

A simple Counter Component

```javascript
// A Simple Component
const CounterComponent = () => {
  // creates a reactive value, which is updated on UI
  // returns getter/setter pair
  const [count, setCount] = createSignal(0);

  onMount(() => {
    // Runs once when component is init
  });

  onCleanup(() => {
    // Runs once when component is destroyed
  });

  createEffect(() => {
    // called when count value is changed
    console.log(count());
  });

  // mutates count + 1
  const increase = () => setCount(count() + 1);
  // mutates count -1
  const decrease = () => setCount(count() - 1);

  return (
    <div>
      {/* Displays count value */}
      <div>Counter: {count()}</div>
      {/* Calls increase on button click */}
      <Button onClick={increase}>Increase</Button>
      {/* Calls decrease on button click */}
      <Button onClick={decrease}>Decrease</Button>
    </div>
  );
};
```

## JSX

In Solid JS, we can write the following syntax:

```javascript
const element = <h1>Hello, world!</h1>;
```

Can you write such a code in regular JS? Of course, not.

This is called JSX, allowing us to write JS code rendered as HTML in the browser.

Please read more about JSX here: [https://reactjs.org/docs/introducing-jsx.html](https://reactjs.org/docs/introducing-jsx.html).

## Lifecycle Functions

At the time of writing, Solid JS has three lifecycle functions. They are very self-explanatory.

```javascript
onMount(() => {
  // Run once when component is initialized. After the view is mounted.
});

onCleanup(() => {
  // Run once when component is destroyed/recalculated
});

onError(() => {
  // Run when children scope errors
});
```

## Signals, Stores — Reactive Data

## createSignal

A primary way to create reactive data is to use **createSignal** function.

```javascript
const [count, setCount] = createSignal(0);
```

In the example above, **createSignal(0)** returns an array of two items. The first item is the **getter** function which returns the value — it's more complex than the getter, but you can think of it like this for now.

If we call **count**, yes, you have to call because it's a function.

```javascript
// gets the value 0
count();
```

You get the value 0, which we provided as the default value.

The second item in the array is the **setter** function. To change the value, you call:

```javascript
// sets the count to 100
setCount(100);
// returns 100
count();
```

If the value is changed, all of the references of the value are updated in UI immediately.

```javascript
<div>Current Count: {count()}</div>
```

## createStore

An alternative to **createSignal** is **createStore,** which is more suitable for handling objects and nested data.

An example of this could be:

```javascript
const [count, setCount] = createStore({ value: 0, lastAction: "none" });
// count holds object -> {value: 0, lastAction: "none"}
```

This time you get back the **value** and **a setter** function pair.

To get the value

```javascript
// gets the value 0
count.value;
// gets the value 'none'
count.lastAction;
```

to change the count, provide as the first parameter a "key" of the object you want to change. The second param is the actual value.

```javascript
// sets the count value to 100
setCount("value", 100);
// returns 100
count.value;

// sets the count lastAction to 'increment'
setCount("lastAction", "increment");
// returns 'increment'
count.lastAction;
```

Similarly, the UI is updated immediately.

```javascript
<div>
  Current Count: {count.value}
  Last Action: {count.lastAction}
</div>
```

## How to start learning Solid JS?

Solid JS's official website is the best source of information to learn. Start browsing and trying different things, and you will improve quickly.

[https://www.solidjs.com/](https://www.solidjs.com/)

The website contains basic to advance tutorials with practical examples. It also lists full API docs to get information about all features of Solid JS.

If you want to learn by creating a real app (Twitter Clone), the Eincode course is listed in the resources.

## Conclusion

Solid JS is a great library. I would put it on the same level as React JS — in terms of programming experience. It's easy to use, intuitive and offers lots of developer freedom.

If you like more structured fully-feature frameworks like Angular JS, then this lib is different from what you are looking for.

Also, the community is not that big, so it can be harder to find information about Solid JS on the internet, but everything takes time…

If you like JSX with the combination of something new, give it a try. You will not regret it.

Cheers,

Filip
