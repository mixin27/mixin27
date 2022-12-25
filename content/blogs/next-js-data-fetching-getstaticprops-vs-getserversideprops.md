---
title: What is Solid JS?
description: A short introduction to Solid JS. Learn about Solid JS and its features, and build modern web applications.
author: Filip Jerga
authorImage: https://cdn.sanity.io/images/55mm68d3/production/9db58be7d6d8ec2962b8754c8e89316afc190733-460x460.png
coverImage: https://cdn.sanity.io/images/55mm68d3/production/1ff41f3a60c18b834752dfe0c4c259ddca4d0bb0-1280x720.jpg?h=600&fm=jpg&q=70
date: "2021-09-23"
originalPostLink: https://eincode.com/blogs/next-js-data-fetching-getstaticprops-vs-getserversideprops
---

Next.JS is a tool employed primarily to build server-side rendered websites that generate the HTML dynamically through a server during every instance of receiving a new request. Usually, Next comes into the picture when you’ve to build websites that offer multiple users the scope of creating their accounts along with allowing them to comment on the content present on the page.

In the course of building an application that is powered by Next.js, you’ll notice that you’ll often require fetching data either from an internal API route, a file, or even an external API. Aiming to clarify the confusion that arises in this process, this new [**Eincode video**](https://www.youtube.com/watch?v=J1E2-hJZUVg) discusses the utilities of and differences between the data fetching functions of GetStaticProps and GetServerSideProps in Next.js.

## Resources

[https://academy.eincode.com/courses/complete-next-js-with-react-node-beautiful-portfolio-app](https://academy.eincode.com/courses/complete-next-js-with-react-node-beautiful-portfolio-app)

## Getting Started

Subjects like these are best understood if you code alongside the tutorial so that you can implement the demonstrated topics. So, let’s get started!

You first need to set up Next.js in your system. Ensure that you’ve already installed the latest LTS version of Node.js 10 or later before you proceed with this. The setting-up process has been detailed in [[0:41] of the video](https://youtu.be/J1E2-hJZUVg?t=41).

**You need to carry out the following steps -**

1.  Go to terminal (Powershell, in case of Windows) and search for the folder wherein you want to initialize your project. If the folder doesn’t exist already then create a new one.
2.  Type in the command **_npx create-next-app_** followed by the name of the application. Press Enter
3.  This will generate our application and install all the necessary dependencies. Once these are installed, we can start with our projects.
4.  The next course of action will take place inside a coding editor. For this video, the coding editor of our choice is Visual Studio Code.
5.  Navigate to the projects section of Visual Studio Code. Refer to [[2:56] of the video](https://youtu.be/J1E2-hJZUVg?t=176) to understand how to access the scripts that you need to execute.
6.  In this video, our application will be running on the server localhost 3000. [[3:59] of the video](https://youtu.be/J1E2-hJZUVg?t=239) demonstrates this.

## Understanding the difference between server-side render and client-side render applications

The following points highlight some of the key differences between server-side render and client-side render applications. This has been discussed in detail in [[5:43] of the video](https://youtu.be/J1E2-hJZUVg?t=343).

- In the case of server-side rendering, when a user issues a request to a webpage, the server creates an HTML page by fetching user-specific data and then sends it over to the user’s system. However, in the case of client-side rendering, one makes use of JavaScript to render the content in the browser. Hence, the content, in this case, isn’t all fetched from an HTML document. What’s present instead is a very basic HTML document with a JavaScript file in initial loading.
- This is best understood by viewing the page source of the web application and studying it subsequently in an HTML formatter for greater clarity. To understand how to do this, refer to [[6:00] of the video](https://youtu.be/J1E2-hJZUVg?t=360).
- While server-side rendering allows for an improved SEO, client-side rendering lets users implement rich site interactions.
- Server-side rendered applications enjoy a fast initial page load. In the case of client-side rendered web applications, once the initial load is complete, the subsequent website rendering is fast.
- Generally, server-side rendering is preferred for static sites. On the contrary, client-side rendering is the go-to option when web applications are involved. Moreover, client-side rendering allows you to access a robust selection of JavaScript libraries as well. Client-side rendered applications have been discussed in detail in [[7:23] of the video](https://youtu.be/J1E2-hJZUVg?t=443).

**Both the techniques have their downsides as well.**

- While server-side rendered applications are notorious for encountering frequent server requests, client-side rendered applications are frowned upon for their low SEO performance.
- The overall page rendering in server-side rendering is rather slow. In the case of client-side rendering, one has to resort to using an external library in most cases.

## GetStaticProps

Now that we’ve discussed the differences and functionalities of client-side and server-side rendering, let’s proceed with diving deep into our data fetching functions. We’ll start with GetStaticProps. [[15:06] of the video](https://youtu.be/J1E2-hJZUVg?t=906) covers the explanation regarding this function.

The salient points are listed below -

- This method is primarily used inside a page to fetch data at build time.
- Once the app is built, it will refuse to refresh the data till the time another build has been run.
- The advantage of using GetStaticProps is that it lets the page be statically generated. As a result, out of all the available data fetching methods, GetStaticProps generates the fastest load times.
- As the data is rendered before it reaches the client, the SEO of the page improves by leaps and bounds.

## GetServerSideProps

To understand GetServerSideProps in detail, refer to [[24:08] of the video](https://youtu.be/J1E2-hJZUVg?t=1448).

The salient points are listed below -

- This method is primarily used to fetch data for every instance that a user issues a request to the page.
- It fetches the data first before sending the page to the client. Should the client happen to issue a subsequent request, the data is fetched again.
- Using GetServerSideProps allows you to improve your SEO as in this method the data is rendered before it reaches the client.
- As the data is refreshed every time the user loads the page, they can view the updated information at all times.

This concludes our discussion of the GetStaticProps and GetServerSideProps data fetching methods in Next.js. To acquire a more in-depth understanding of these concepts, refer to [[27:13] of the video](https://youtu.be/J1E2-hJZUVg?t=1633) wherein a real-time example involving these methods has been demonstrated in detail.

## Conclusion

To exercise a solid command over the various Next.js functions out there, opt for [Complete Next.JS With React & Node- Beautiful Portfolio App by Eincode](https://academy.eincode.com/courses/complete-next-js-with-react-node-beautiful-portfolio-app). Curated by experienced software engineer and freelance developer _Filip Jerga_, this course by **Eincode** certainly features among the choicest Next.Js resources on the internet.

Designed to cater to beginners, this course is perfect for anyone who’s planning to start their career as a developer or for someone who’s simply planning to hone their programming skills.
