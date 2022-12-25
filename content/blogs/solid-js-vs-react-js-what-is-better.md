---
title: Solid JS vs React JS. What is Better?
description: The practical comparison of Solid JS and React JS. Learn about the differences between these two excellent libraries.
author: Filip Jerga
authorImage: https://cdn.sanity.io/images/55mm68d3/production/9db58be7d6d8ec2962b8754c8e89316afc190733-460x460.png
coverImage: https://cdn.sanity.io/images/55mm68d3/production/6cf1a9cdd8aeeceab7b39db14d8d62deac899a96-1280x720.jpg?h=600&fm=jpg&q=70
date: "2022-12-22"
originalPostLink: https://eincode.com/blogs/solid-js-vs-react-js-what-is-better
---

## Resources

Do you want to learn more about Solid JS and React JS?

Check: [https://academy.eincode.com/](https://academy.eincode.com/)

## Compare the code

The best way to learn is to see the code and practical examples. Please check the two following apps. The first is created in React JS, and the second is in Solid JS. Notice subtle differences. After you are done checking, continue reading.

![](https://cdn.sanity.io/images/55mm68d3/production/dc0b57d6e33f0e3f162d8caa352661cf010b5e5d-600x338.gif?h=800&q=90&fit=max)

Simple Counter App — code for this is shown below

```javascript
// React JS
const CounterApp = () => {
  console.log("Hello Counter App");
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component Init!");
    return () => {
      console.log("Component Cleaned Up!");
    };
  }, []);

  useEffect(() => {
    console.log("Value Changed: " + count);
  }, [count]);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={increment}>Inc</button>
      <div>{count}</div>
    </div>
  );
};
```

![](https://cdn.sanity.io/images/55mm68d3/production/17ae99ddc1055adda2809b051c905bd9a896978e-600x338.gif?h=800&q=90&fit=max)

React JS — Application Output

```javascript
// Solid JS
const CounterApp = () => {
  console.log("Hello Counter App");
  const [count, setCount] = createSignal(0);

  onMount(() => {
    console.log("Component Init!");
  });

  onCleanup(() => {
    console.log("Component Cleaned Up!");
  });

  createEffect(() => {
    console.log("Value Changed: " + count());
  });

  const increment = () => {
    setCount(count() + 1);
  };

  return (
    <div>
      <button onClick={increment}>Inc</button>
      <div>{count()}</div>
    </div>
  );
};
```

![](https://cdn.sanity.io/images/55mm68d3/production/48a204f6c6b8d6f9adda43a5622c605608a2e867-600x338.gif?h=800&q=90&fit=max)

Solid JS — Application Output

## Main Differences

Both codes look very similar, but their concepts are very different. In React JS, a component is re-rendered(re-executed) as often as the state changes.

Solid JS component is called only once.

In React JS, we can use **useEffect** function for init call, cleanup, and reaction to data changes.

In Solid JS, we have **onMount** for init, **onCleanup** for cleanup, and **createEffect** to react to data changes.

React JS reactive data are raw values. In Solid JS, you have functions. That's why you need to call them to get the value — more about this in the **reactivity** section.

These are some of the differences. Now let's look at them more closely.

## Reactivity

In React JS, in the image above. Every time value is incremented,

```javascript
setCount(count + 1);
```

the whole function is re-rendered — the entire **CounterApp** is called again. You can see this on the "React JS — Application Output" GIF in the section above.

A message "**Hello Counter App**" is displayed in the console.

```javascript
// function re-executed on state change
const CounterApp = () => {
  console.log("Hello Counter App");
  const [count, setCount] = useState(0);
  ...
```

**useState** will return a new value, a previously mutated one, and the new view is returned.

In Solid JS, a component is executed only once. You can think of a component as a constructor function.

How is the view updated when the component is NOT called again with the new values?

Well, in Solid JS, when you want to display the value, you need to call it.

```javascript
// Solid JS
{
  count();
}
```

Opposite to React JS

```javascript
{
  count;
}
```

In Solid JS, the reactive value is a getter function.

Well, it's more complex than that…

```javascript
const [count, setCount] = createSignal(0);
```

Signals are event emitters that hold a list of subscriptions. They notify their subscribers whenever their value changes.

```javascript
// subscribe to value changes
{
  count();
}
```

```javascript
// notify and update subscribers
setCount(count() + 1);
```

A more technical explanation can be found here: [https://www.solidjs.com/guides/reactivity](https://www.solidjs.com/guides/reactivity)

## Lifecycle Functions

In React JS, as the init and cleanup function, we can use

```javascript
useEffect(() => {
  console.log("Component Init!");

  return () => {
    console.log("Component Cleaned Up!");
  };
}, []);
```

The callback function inside of **useEffect** is called once because as second value (dependency array) is provided an empty array -> **[]**

The function returned from the callback is called whenever the component is unmounted.

In Solid JS, the lifecycle functions are pretty self-explanatory:

```javascript
onMount(() => {
  console.log("Component Init!");
});

onCleanup(() => {
  console.log("Component Cleaned Up!");
});
```

## Effect Functions

In React JS, to react to data changes, we can use **useEffect** function.

```javascript
useEffect(() => {
  console.log("Value Changed: " + count);

  return () => {
    console.log("Clean Up!");
  };
}, [count]);
```

The callback inside **useEffect** is called as many times as the count value changes. This happens because this time in the dependency array is provided -> **[count]**

Also, interestingly, before each render, the cleanup function is called as well.

```javascript
return () => {
  console.log("Clean Up!");
};
```

This is very useful if you want to clean up previous subscriptions before subscribing to new ones.

In Solid JS, again, this is more straightforward.

```javascript
createEffect(() => {
  console.log("Value Changed: " + count());
});
```

The callback function inside **createEffect** is called as many times as the count value changes.

Solid JS doesn't have a dependency array. Instead, dependencies are detected automatically when the signal values are used.

You can see that simply calling **count()** in console.log will let **createEffect** know to call the callback when the value changes.

This version of **createEffect** would be called only once.

```javascript
createEffect(() => {
  console.log("Value Changed: ");
});
```

## Architecture — Virtual DOM

React JS utilizes a technique called reconciliation, which involves maintaining a "virtual" representation of the user interface (UI) in memory known as the Virtual DOM.

This "virtual" DOM is then compared to the "real" DOM, and any necessary updates are made to keep the two in sync.

By using the Virtual DOM, React can efficiently update the actual DOM, reducing the number of costly DOM manipulation operations and improving the application's overall performance.

Learn more: [https://reactjs.org/docs/faq-internals.html](https://reactjs.org/docs/faq-internals.html)

Solid JS utilizes a unique approach to updating the UI. Instead of using a Virtual DOM, Solid JS compiles templates into actual DOM nodes, which are then updated with specific reactions when the application's state changes.

This allows Solid JS to eliminate the need for reconciliation and directly manipulate the DOM, resulting in faster updates.

In Solid JS, a state can be declared and used throughout the application, and only the code that depends on it will be rerun when the state value is modified. This helps minimize state change's impact on the UI, further improving the speed and efficiency of the application.

## Conclusion

Here you have it — the fundamental differences between Solid JS and React JS. Now, which one is better?

Well, that's up to you and your preferences. I suggested creating small projects, getting around documentation, and checking out examples.

You will be able to decide for yourself.

Check official websites or Eincode courses linked in the top section to learn more.

Cheers (:  
Filip
