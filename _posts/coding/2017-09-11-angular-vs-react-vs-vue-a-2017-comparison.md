---
layout: post
title:  Angular vs. React vs. Vue：A 2017 comparison
date:   2017-09-11
categories: coding
tags: Javascript
translate: true
---

Deciding on a JavaScript framework for your web application can be overwhelming. Angular and React are very popular these days, and there is an upstart which has been getting a lot of traction lately: VueJS. What’s more, these are just a few of the new kids on the block.

So, how are we supposed to decide? A pros-and-cons list never hurts. We’ll do this in the style of my previous article, “9 Steps: Choosing a tech stack for your web application”.


### Before we start — SPA or not?

You should first make a clear decision as to whether you need a single-page-application (SPA) or if you’d rather take a multi-page approach. Read more on this in my blog post, “Single-page-application (SPA) vs. Multi-page web applications (MPA)” (coming soon, follow me on Twitter for updates).

### The starters today: Angular, React and Vue

First, I’d like to discuss lifecycle & strategic considerations. Then, we’ll move to the features & concepts of the three javascript frameworks. Finally, we’ll come to a conclusion.

Here are the questions we’ll address today:

- How mature are the frameworks / libraries?
- Are the frameworks likely to be around for a while?
- How extensive and helpful are their corresponding communities?
- How easy is it to find developers for each of the frameworks?
- What are the basic programming concepts of the frameworks?
- How easy is it to use the frameworks for small or large applications?
- What does the learning curve look like for each framework?
- What kind of performance can you expect from the frameworks?
- Where can you have a closer look under the hood?
- How can you start developing with the chosen framework?

Ready, set, GO!

### 1. Lifecycle & strategic considerations

#### 1.1 Some history

Angular is a TypeScript-based Javascript framework. Developed and maintained by Google, it’s described as a “Superheroic JavaScript MVW Framework”. Angular (also “Angular 2+”, “Angular 2” or “ng2”) is the rewritten, mostly incompatible successor to AngularJS (also “Angular.js” or “AngularJS 1.x”). While AngularJS (the old one) was initially released in October 2010, it is still getting bug-fixes, etc. — the new Angular (sans JS) was introduced in September 2016 as version 2. The newest major release is version 4, as version 3 was skipped. Angular is used by Google, Wix, weather.com, healthcare.gov and Forbes (according to madewithangular, stackshare and libscore.com).
React is described as “a JavaScript library for building user interfaces”. Initially released in March 2013, React was developed and is maintained by Facebook, which uses React components on several pages (not as a single-page application, however). According to this article by Chris Cordle, React is used far more at Facebook than Angular is at Google. React is also used by Airbnb, Uber, Netflix, Twitter, Pinterest, Reddit, Udemy, Wix, Paypal, Imgur, Feedly, Stripe, Tumblr, Walmart and others (according to Facebook, stackshare and libscore.com).

Facebook is working on the release of React Fiber. It will change React under the hood — rendering is supposed to be much faster as a result — but things will be backward-compatible after the changes. Facebook talked about the changes at its developer conference in April 2017, and an unofficial article about the new architecture was released. React Fiber will be probably be released with React 16.

Vue is one of the most rapidly growing JS frameworks in 2016. Vue describes itself as a “Intuitive, Fast and Composable MVVM for building interactive interfaces.” It was first released in February 2014 by ex-Google-employee Evan You (BTW: Evan wrote an interesting blog post about the marketing activities and numbers in the first week back then). It’s been quite a success, especially given that Vue is getting so much traction as a one-man show without the backing of a big company. Evan currently has a team of dozen core developers. In 2016, version 2 was released. Vue is used by Alibaba, Baidu, Expedia, Nintendo, GitLab — a list of smaller projects can be found on madewithvuejs.com.

Angular and Vue are both available under the MIT license, while React comes with the BSD3-license. There are a lot of discussions on the patent file. James Ide (Ex-Facebook engineer) explains the reasons and the history behind the file: Facebook’s patent grant is about sharing its code while preserving its ability to defend itself against patent lawsuits. The patent file was updated once and some people claim, that it is okay to use React, if your company is not going to sue Facebook. You can check the discussion in this Github issue. I am not a lawyer, so you should decide yourself, if the React license is problematic for you or your company. There are still a lot of articles on this topic: Dennis Walsh writes, why you should not be scared. Raúl Kripalani is warning against the use for startups, he is also having an brain dump overview. Also there is an lately original statement from Facebook on this topic: Explaining React’s license.

#### 1.2 Core development

As already noted, Angular and React are supported and used by big companies. Facebook, Instagram and Whatsapp are using it for their pages. Google uses it in a lot of projects: for example, the new Adwords UI was implemented using Angular & Dart. Again, Vue is realized by a group of individuals whose work is supported via Patreon and other means of sponsorship. You can decide for yourself whether this is a positive or negative. Matthias Götzke thinks that Vue’s small team is a benefit because it leads to cleaner and less over-engineered code / API.

Let’s have a look at some statistics: Angular lists 36 people on their team page, Vue lists 16 people, and React doesn’t have a team page. On Github, Angular has > 25,000 stars and 463 contributors, React has > 70,000 stars and > 1,000 contributors, and Vue has almost 60,000 stars and only 120 contributors. You can also check the Github Stars History for Angular, React and Vue. Once again, Vue seems to be trending very well. According to bestof.js, over the last three months Angular 2 has been getting an average of 31 stars per day, React 74 stars, and Vue.JS 107 stars.

Update: Thanks to Paul Henschel for pointing out the npm trends. They show the number of downloads for the given npm packages and are even more helpful as a pure look at the Github stars:





为您的web应用选择一个JavaScript框架是至关重要的。最近，Angular和React非常受大家欢迎，现在又多了一个强劲的对手：Vue.js。更为重要的是，这些只不是JavaScript框架中的几个而已。

那么，我们应该如何去做这个决定呢？一个利弊表是必要的。按照我之前的文章[9 Steps: Choosing a tech stack for your web application](https://medium.com/unicorn-supplies/9-steps-how-to-choose-a-technology-stack-for-your-web-application-a6e302398e55)