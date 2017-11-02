---
layout: post
title: Web Frameworks:Foundational Technologies
date: 2017-07-31
categories: coding
tags: javascript vue
---

> 转自[Web Frameworks: Foundational Technologies](https://www.sitepen.com/blog/2017/07/06/web-frameworksfoundational-technologies/)


![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/blog-7.jpg)

We have previously discussed the [look](https://www.sitepen.com/blog/2017/06/16/web-frameworks-user-interface-development/) and [feel](https://www.sitepen.com/blog/2017/06/27/web-frameworks-user-experience-design/) of web frameworks. While we often become interested in a framework based on the stylishness of the widgets and applications it can create, this may lead to a similar approach to how we have historically selected music. Traditionally, you would go out, buy an album, maybe from a band you knew, with a great album cover and a list of interesting tracks.

Perhaps the album was currently #1 in its popularity on the Billboard charts? Maybe you even sample a few tracks while in the music shop. However, once you got home with your CD and played it over your kick-butt, valve amplified, highly optimized sound system, you find out that it was mixed by someone who thought that no one listening on an MP3 player through cheap headphones would ever notice the low sample rate and removal of the bass! Instead of feeling like you are in the middle of a concert, you feel like you are listening to a band playing in a toilet over a phone. So the album was optimized for its look and feel while ignoring the foundational architecture needed to create an album that scales under the demands of a highly optimized stereo system!

> Web frameworks are not just nice Christmas gifts. Using the first one we unwrap will affect our applications for a long time.

In this post we’ll look at how the different web frameworks deal with the fundamentals. We’ll look at what environments are supported, how well aligned they are to the current standards, how they future proof their code, and how they go above and beyond the current standards. This analysis will give us an indication of what sort of foundations we are building on when leveraging a particular framework. Especially in the enterprise, web frameworks are not just nice Christmas gifts. Using the first one we unwrap will affect our applications for a long time.

This is part of a series on web frameworks. If you’ve missed our previous posts, you may want to start with [If we chose our JavaScript framework like we choose our music…](https://www.sitepen.com/blog/2017/06/13/if-we-chose-our-javascript-framework-like-we-chose-our-music/)

## Supported environments

Depending on our needs, we will obviously have a minimum set of requirements. However, even if a framework supports these requirements, how and why they support the different environments currently can tell us a lot about how they will support our future needs as well. If the framework is only supporting the “latest and greatest” then the framework is likely to continue to do that in future. If the framework tries to support too far back, then it raises questions about how efficient and performant it will be on newer browsers. Or does the framework try to find a sweet spot? Focusing on supporting a specific set of technologies and browsers that support those features? Does the framework focus on mobile, or is it more geared towards the desktop? Does the framework effectively support both client-side and and server-side? Is the framework focused on solving a small set of problems extremely well, or does it strive to solve all problems, but with perhaps a bit less rigor in some areas?

## Alignment to modern standards

The web platform has advanced greatly over the past few years and is likely to continue at a rapid rate of change. Trying to determine how aligned a web framework is to current standards can give us an indication of how that is going to work in the future. This is not just about supporting recent ECMAScript standards and current CSS standards, but moreover how the framework deals with the myriad of living standards that comprise the modern web platform.

There is also a double-edged sword with this. Some frameworks adopt technology early, before it has progressed through the standards process. In this, be wary of a framework that depends on technology that may never officially land in the framework. This can cause issues for your application in the future if they need to break compatibility to re-align and/or could create performance concerns if there are more performant alternatives implemented.

<div class="pull-right">![](http://www.sitepen.com/blog/wp-content/uploads/2017/06/laptop-1024x683.jpg)</div>

## Functional enhancements

Conversely, if a framework waits to only support fully standardized features, it may not provide the full set of features needed to build modern applications. Even with quickly evolving standards, it is likely that the web platform does not provide the total foundation of functionality that is needed. While this was the main focus of frameworks of _yore_ because the web platform didn’t offer enough high-order functionality for developers to be productive, that has largely changed over the past few years. This doesn’t mean that there aren’t still things that should (and will) be improved, so the approach to dealing with these types of enhancements can have an impact on us as users of the framework.

## Forward compatibility

Does the framework give any consideration to helping the framework maintain forward compatibility, as well as providing us, as users of their framework, with anything that helps us from having to rewrite our code every 6 months when the latest and greatest feature becomes part of the web platform?

## i18n and l10n

Internationalization (_<abbr title="internationalization">i18n</abbr>_) and localization (_<abbr title="localization">l10n</abbr>_) are important in many use cases for a web framework. Many organizations often _think_ that they do not need these features, but with the internet being global, organizations can often find themselves having to rewrite significant amounts of their applications because they are expanding into a new territory.

I18n is the concept of taking a resource, usually text, from one language, and providing it in another language. L10n expands upon that and starts to deal with the higher order concepts that are above just translating words. Some cultures have different ways of expressing plurals, or how they group numbers. For example, 10 million in US English is 1 _crore_ in India, and having the tools that can help support this sort of localization can be critical to having an application that meets the needs of a particular market.

#### Jump to:

*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/angular-logo.png)](#angular)
*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/react-logo.png)](#react)
*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/vue-logo.png)](#vue)
*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/dojo-logo.png)](#dojo)
*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/ember-logo.png)](#ember)
*   [![logo](https://www.sitepen.com/blog/wp-content/uploads/2017/06/aurelia-logo.png)](#aurelia)
<div id="angular" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/angular-logo.png)</div>

## Angular 2+

### Supported environments

Angular 2+ targets support for Internet Explorer 9 – 11, current versions of Firefox, Chrome, Edge, Safari, iOS and Android. It also supports IE Mobile 11. It achieves this support by expecting the implementer to ensure that [polyfills are available in the environment](https://angular.io/guide/browser-support). These can be flowed into the build process by a bespoke build pipeline. Historically Angular is quick to drop old browser support.

Animations are not supported in Internet Explorer 9.

All supported platforms are included in the Angular 2+ self-test suites.

### Alignment to modern standards

The internals of Angular 2+ are written in TypeScript and tend to embrace the ES6 syntax where appropriate. Angular 2+ also relies heavily on some future standards, like [_decorators_](https://tc39.github.io/proposal-decorators/) and [_ES observables_](https://github.com/tc39/proposal-observable) (via RxJS). Angular 2+ embraces the ES6 module syntax, but does rely upon additional significant modifications and metadata to make the modules and classes work as part of the ecosystem. This additional metadata, while added in a manner that is likely forwards-compatible, means that there is a bit of _lock-in_ to the Angular 2+ ecosystem. These modules are referred to as _NgModules_. While Angular 2+ adopts _decorators_ and _ES observables_, it internally has not yet adopted [`async`/`await`](https://github.com/tc39/ecmascript-asyncawait) pattern for asynchronous code.

As far as taking advantage of TypeScript features, most of the effort with Angular 2+ feels focused on the authoring of the framework. For example, TypeScript types and other benefits do not flow through to the developer experience. The use of TypeScript does allow developers to adopt ES6+ syntax and other functionality with polyfills.

### Functional enhancements

Most of the functional enhancements lie in the API surrounding the templating functionality of Angular 2+. While this is potentially a development strength, this does not necessarily flow through to the development experience. One of the advantages of using something like TypeScript is to provide intellisense/auto-complete and design time validation. Angular 2+ achieves this for templates via a language services extension that is available at least in [Visual Studio Code](https://github.com/angular/vscode-ng-language-service).

Angular 2+ uses [core-js](https://github.com/zloirock/core-js) to provide ES6 functional polyfills. It uses [RxJS](http://reactivex.io/rxjs/) to provide a syntax that is very similar to the proposed ES Observables and higher order functionality on top of observables. Angular 2+ also uses _zones_ to provide an execution context across asynchronous code.

### Forward compatibility

Because Angular 2+ is written in TypeScript it provides a level of syntactical future proofing. It also relies upon a set of standards-aligned polyfills. Both of these will likely help code you write today be forward compatible. Angular 2+ does rely heavily upon its frameworks APIs. The long term compatibility of those APIs are tied to the roadmap of Angular 2+. The Angular 2+ team does state though that they do not plan to have further compatibility breaks, like they had with Angular 1 to Angular 2.

Angular 2+ embraces ES Modules and a component architecture. This helps by separating the code that could be more easily refactored and tested without impacts on the entire code base. Because Angular 2+ relies on dependency injection, which does not rely upon concrete interfaces or types at design time, this could cause regressions when upgrading an application and that would not be identifiable at code design time.

### i18n and l10n

Angular 2+ provides an i18n API as part of its overall framework. This is accomplished by adding an `i18n` attribute to a template, along with an optional description of the intent. The Angular 2+ CLI tool will extract these translation bundles during the build process and _stub_ these out so various translations for different locales can be provided. There is no specific API to localize things like date, currency, plurals and other language constructs. Using i18n requires what is typically the optional use of [SystemJS](https://github.com/systemjs/systemjs) which allows support for loader plugins which can then dynamically load the translations. Translation files are heavily dependent on the build process. Therefore extending the translations will often cause you to rebuild your application. Many Angular 2+ users have turned to third-party solutions for better i18n and l10n such as [Globalize](https://github.com/jquery/globalize/) or [i18next](https://www.i18next.com/)

<div id="react" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/react-logo.png)</div>

## React + Redux

### Supported environments

Definitive browser support for React + Redux is complicated, as they are both libraries that would likely form part of a larger application stack, which may or may not have the same support matrix. [ReactDOM](https://facebook.github.io/react/docs/react-dom.html), the core of the DOM interactions with React is designed to support Internet Explorer 9 and beyond, which would include current versions of Edge, Safari, Firefox, Chrome, iOS, and Android. Redux _should_ work with any browsers that support ES5+, which is the same support matrix as ReactDOM.

React also has mature concepts around server-side rendering and appears to support Node.js 0.10.0+, though it is difficult to find an exact Node.js support matrix.

### Alignment to modern standards

React + Redux both embrace modern standards. They both generally assume the end developer will author source code in ES6+ and use a transpilation tool to down emit if required. Traditionally [Babel](https://babeljs.io/) has been used as the transpiler, though [TypeScript](https://typescriptlang.org) plus [core-js](https://github.com/zloirock/core-js) provide a similar set of functionality. There are guides on how to use React without [ES6](https://facebook.github.io/react/docs/react-without-es6.html) support, but you will quickly realize this becomes increasingly challenging.

React + Redux often promote future standards as well, with Facebook adopting these into their code and then championing them within the standards groups. For example, React adopted the [spread/rest operators for objects](https://github.com/tc39/proposal-object-rest-spread), while that functionality is still working its way through the [TC39 standards process](https://www.sitepen.com/blog/2017/04/06/tc39-open-and-incremental-approach-improves-standards-process/).

### Functional enhancements

React relies heavily upon [JSX](https://facebook.github.io/react/docs/introducing-jsx.html). JSX is a preprocessor step that adds XML syntax to JavaScript. While React can be used without [JSX](https://facebook.github.io/react/docs/react-without-jsx.html) it is likely challenging as the larger community has embraced it and most examples use JSX.

There are a collection of other libraries that add what Facebook tends to consider important functionality or patterns. For example [Immutable.js](https://facebook.github.io/immutable-js/) (a library that provides immutable objects to promote uni-directional data flow patterns) and [Flow](https://flow.org/) (static typing for JavaScript to promote build time type enforcement) both provide functionality beyond the standards. Also, React + Redux includes dependencies that help provide a stable set of APIs they can build on.

React has run-time dependencies on some lower level libraries, mostly to ensure some standards compliance, but also some lower level environment detection. Redux uses [Lodash](http://lodash.com/) to provide non-standard higher-order functionality.

### Forward compatibility

Because React + Redux promotes ES6+ syntax, they should be largely forward compatible. They also encourage the usage of ES modules to promote maintainability of code, and React has a component architecture. Because it is unlikely though that React + Redux would provide the entire set of libraries required to create a whole application, it increases the risk of forward compatibility issues due to churn within any additional libraries used, likely leading to an increase in code that refactoring to stay current with community-driven best practices.

### i18n and l10n

There is no direct support for i18n or l10n within React or Redux.

The most common way of dealing with i18n and l10n though is via the Yahoo! project [format.js](https://formatjs.io/) (a derivative of [messageformat.js](https://messageformat.github.io/) which provides integrations for React, Ember and Handlebars, the templating engine used by Ember). _format.js_ provides a robust set of APIs to not only deal with translations but also the localization challenges faced by many applications.

<div id="vue" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/vue-logo.png)</div>

## Vue.js

### Supported environments

Vue.js targets support of Internet Explorer 9 – 11, current version of Firefox, Chrome, Edge, Safari, iOS and Android. Some of the functionality requires polyfills/shims to be loaded.

The published full build of Vue.js will not work in <abbr title="Content Security Protocol">CSP</abbr> environments due to the use of dynamic JavaScript functions in its template compiler, but _runtime-only_ builds that pre-compile templates into JavaScript functions can be used in CSP environments.

Vue.js can also run in a pure Node.js environment to allow for server-side rendering (<abbr title="server side rendering">SSR</abbr>). Vue.js SSR should work with Node.js 0.10.0+.

### Alignment to modern standards

Vue.js 2 is written using standard ES Modules and is authored in ES6+. Vue.js achieves legacy browser compatibility via Babel and focuses on webpack to provide build-time bundling of the ES Modules.

Vue.js 2 is written using [Flow](https://flow.org/) to provide static type checking of code, though Vue.js makes it easy for downstream developers to leverage Flow, TypeScript or just _plain old JavaScript/ES6_.

Vue.js’s structure and syntax is inspired by Web Components, but it does not use Web Components directly or use Web Component technologies like the shadow DOM or CSS scoping. Vue.js does provide similar functionality through _single file components_, which are, as the name suggests, Vue.js components defined entirely in a single file. A component file will contain an HTML template, JavaScript, and CSS. Components must be built using WebPack with a plugin that understands the `.vue` component syntax. The CSS can be scoped and extracted as part of the build process.

### Functional enhancements

Vue.js’s API is fairly minimal and does not provide utility functions beyond those required to render and manage components.

Vue.js does not have any direct external run-time dependencies, though [Weex](https://weex.apache.org/), lodash, Babel polyfills, and various low level APIs are incorporated during the build cycle.

### Forward compatibility

Vue.js is built to run in any browser supporting ES5, which is likely to be most browsers for the foreseeable future. Components in scripts or HTML pages can be written using whatever version of JavaScript is supported by the base environment. Single file components will be built by properly configured WebPack, and support ES6+ features by default by integrating Babel into the build tool chain.

Vue.js made significant efforts to align to the Web Components standards, though found them lacking and slow to be implemented in browsers. It is hard to predict if Web Components will eventually become a stable enough set of standards to build upon. If that is the case, then Vue.js is likely to adopt it. That may require refactoring components, _but_ Vue.js has done a good job of giving users an upgrade path where possible from previous versions.

### i18n and l10n

Vue.js has no built-in i18n or l10n support, but a number of third-party libraries supply this, with specifically [Awesome Vue](https://github.com/vuejs/awesome-vue#i18n) being the most widely adopted.

<div id="dojo" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/dojo-logo.png)</div>

## Dojo 2

### Supported environments

Dojo 2 targets and tests against Internet Explorer 11, Android 4.4+, iOS 9.1+, and current versions of Chrome, Safari, Edge, and Firefox.

Server-side rendering in Node.js 6+ is on the current road-map, with limited capabilities already present.

### Alignment to modern standards

Dojo 2 is authored in TypeScript, using full ES6+ syntax throughout. Instead of using global polyfills for ES6+ functionality, Dojo 2 leverages _shim_ modules that generally do not touch the global scope and offload to native capabilities if the environment supports it. All of the provided shims are parts of published standards, except for ES Observables, which are still being considered as an ECMAScript standard.

Dojo 2 embraces class and method decorators as supported by TypeScript, though non-decorator ways of achieving the functionality are also provided. CSS is authored as CSS Modules in CSS 3+ syntax, which is transpiled during the build process to namespaced, down-emitted CSS.

Dojo 2 tends to embrace standards early that align to its design goals. It has adopted PointerEvents, CustomElements, Intersection Observers, Web Animations, `async`/`await`, dynamic `import()`, and rest/spread operators on objects.

Dojo 2 widgets can be exported to Web Components that then can be used _standalone_ in other frameworks, only exposing an external API which is aligned to the Web Components standard.

### Functional enhancements

Functional enhancements, above standards, are located in [`@dojo/core`](https://github.com/dojo/core) which provide some higher-order functionality which Dojo 2 considers generally useful. This includes some abstractions for cancelable promises, requesting resources, etc.

Dojo 2 has external run-time dependencies on [Globalize](https://github.com/globalizejs/globalize) and [Maquette](http://maquettejs.org/) as well as polyfills for standards ([pep.js](https://github.com/jquery/PEP) and [Intersection Observers](https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill)).

### Forward compatibility

Dojo 2 being authored in TypeScript a level of syntactical forward compatibility. Dojo 2 strongly encourages that downstream applications be authored in TypeScript as well, which will provide this same forward compatibility. TypeScript is how Dojo 2 achieves backwards compatibility as well, in addition to polyfills and shims.

While Dojo 2 can be used in an AMD environment, it is strongly encouraged to use Webpack 2 via the `dojo build` CLI command to build your applications, as this will help ensure any transition to future packaging and module loading does not impact your code and structure.

By embracing ES Modules as well as CSS Modules, Dojo 2 promotes patterns that help ensure that widgets express all their dependencies. By leveraging type enforcement across the code and CSS, Dojo 2 strives to provide a system which identifies issues at development/build time, before they are found at run-time. Changes upstream that are breaking downstream should be easily identifiable.

Dojo 2 fully breaks compatibility with Dojo 1 after more than 10 years of forwards compatibility. It is expected that future versions of Dojo will not be a complete breaks, and instead have smaller iterations over time.

### i18n and l10n

Support for i18n and l10n is built into the widgeting system. By leveraging Globalize.js and the official [Unicode CLDR](http://cldr.unicode.org/) data, Dojo 2 applications can detect and change locales, and developers can express translations and other localization information to be used with widgets.

The Dojo 2 build CLI is able to build locale translations directly into bundles or leave them to be dynamically loaded at run-time.

<div id="ember" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/ember-logo.png)</div>

## Ember

### Supported environments

Ember targets support of Internet Explorer 9 – 11, and the current version of Firefox, Chrome, Edge, Safari, iOS and Android.

Ember also has a mode called _FastBoot_ which provides a path to server-side rendering. It supports Node.js 4+. Caution needs to be taken when introducing Ember addons with downstream dependencies that may not conform to the FastBoot environment, potentially breaking SSR.

### Alignment to modern standards

Ember is geared towards supporting ES5 although Glimmer though is authored in TypeScript and embraces ES6+ syntax. Many users of Ember are starting to adopt modern syntax and use some sort of transpiler to provide backwards compatibility.

### Functional enhancements

With Ember 2, Ember stopped directly depending on jQuery internally for functional enhancements. It is still included by default and Ember provides a _delegate_ to the jQuery APIs, but it can be wholly removed if desired. Ember has embraced Babel to provide standards-based polyfills as part of the build process.

### Forward compatibility

Ember gives a lot of consideration for future compatibility, even providing a very viable upgrade path from 1.13 to 2.0.

Ember has stated that they are on a path to separate out their platform and make it more modular, breaking down functionality into separate packages, as the Ember team feels they have been accused of being too _monolithic_.

### i18n and l10n

Ember does not provide an out of the box i18n solution. There are third-party solutions though, one called [ember-i18n](https://github.com/jamesarosen/ember-i18n) and the Yahoo! [ember-intl](https://github.com/ember-intl/ember-intl) which is part of [Format.js](https://formatjs.io/).

<div id="aurelia" class="rule"></div>
<div class="feature-icon">![](https://www.sitepen.com/blog/wp-content/uploads/2017/06/aurelia-logo.png)</div>

## Aurelia

### Supported environments

Aurelia focuses on current versions of modern browsers: Microsoft Edge, Chrome, Firefox and Safari. While Aurelia wants to support browsers like Internet Explorer 11, issues affecting these platforms do not seem to be a priority to fix.

Aurelia UX has the concepts of supporting the web as well as Cordova and Electron, though both Cordova and Electron appear to be works in progress at this time. Aurelia has server-side rendering as a goal, but is also a work in progress.

### Alignment to modern standards

Aurelia is authored in ES6+ and designed to use Babel to transpile source code as needed. Aurelia has their own package of [polyfills](https://github.com/aurelia/polyfills) to provide backwards compatibility as well as provide some future standards functionality. Out of the box, Aurelia does not directly deal with CSS3+, but allows preprocessors or postprocessors like [postcss](http://postcss.org/) to be easily integrated.

Aurelia UX is authored in TypeScript and Aurelia provides a complete set of typings for their framework to support downstream development in TypeScript.

### Functional enhancements

Aurelia has no external dependencies, though is dependent upon Babel for some functional polyfills when running in older browsers. Aurelia has its foundational enhancements separated into packages that are part of the Aurelia umbrella including: [data binding](https://github.com/aurelia/binding), [templating and custom elements](https://github.com/aurelia/templating), [dependency injection](https://github.com/aurelia/dependency-injection), [routing](https://github.com/aurelia/router), [scoped styles, theming, and platform/host detection](https://github.com/aurelia/ux/). Some of these features are included in the default framework package, and others can be included separately.

### Forward compatibility

Aurelia’s aim is to be forward compatible with the [web platform for two to three years in the future](https://github.com/aurelia/framework/blob/master/doc/article/en-US/technical-benefits.md#modern-javascript). Because it also supports downstream development in TypeScript, that is likely going to make it easier for downstream projects to achieve that goal. Aurelia uses Babel to transpile its ES6+ source code. Modern DOM APIs are used and polyfilled to work back to Internet Explorer 9, although IE9 is not officially supported. Aurelia leverages the Web Components standards internally, and aims to support exporting UX components as standalone Web Components, though this is not yet implemented.

### i18n and l10n

Aurelia provides an [i18n library](https://github.com/aurelia/i18n) that leverages [i18next](https://www.i18next.com/) under the hood. i18next provides both the ability to deal with translations and deals with some other l10n features, like dealing with plurals and provides a robust enough of an API to build some higher-order localizations like number formatting.

<div class="rule"></div>

## Summary

### Angular 2+

Angular 2+ builds on a fairly decent foundation, though it has dependencies on a few larger projects that it doesn’t directly control. Using transpiling gives some forward compatibility safety and given its extensive use of metadata will cause a level of _lock-in_ and required alignment to their architecture.

### React + Redux

React and Redux are flexible tools and libraries. On their own, React + Redux does not provide a total application development solution. It is quite easy to collect additional libraries and add functionality and then wonder why your application has become bloated and problematic. In the right hands, you can provide an efficient and effective foundation to build on, but this requires real experience and skill. Both React and Redux already depend on external libraries to get to their foundation and it is quite easy to collect more _junk_. If you are sure you want to _roll your own_ then React and Redux are both excellent libraries. They are not an out of the box framework.

### Vue.js

If you are sold on the MVVM application model, it would be hard to not consider Vue.js. It provides a solid foundation of modern APIs while incorporating upstream dependencies into a coherent set of end developer APIs.

### Dojo 2

Dojo 2 strives to provide a decent foundation and tries to minimize the dependencies it includes. Being focused on embracing TypeScript and modern syntax and functionality should give it a decent amount of growth room without having to be rearchitected. Dojo 2 still being in beta may hold some instability for the foundations. Also, Dojo 2 really is only effective if you are willing to develop further with TypeScript.

### Ember.js

Ember has a robust ecosystem and Ember.js really focuses on maintaining the ecosystem, making it easy for people to build on top of the foundations, creating a larger ecosystem. Ember does not provide as wide of a foundation as some other frameworks, so there is some risk that the functionality you need or want is provided via an add-on, of which the quality may very, though the ecosystem seems large and fairly self-regulating.

### Aurelia

If you like the concepts of dependency injection and a templating led framework, but something that is very much aligned to current and future standards, then Aurelia may be the right framework for you. While the foundations are mostly there, there are still parts of Aurelia that are a work in progress, though the direction and design goals seem to be coherent and an overall architecture that is sustainable.

## Up next

We have looked at the album covers, read the liner notes, understood how the music is produced, but we really have not yet done what you would typically do with an album: actually sit back and listen to it. That is what is up next! We use web frameworks to build web applications, and in the next post we will explore how the different frameworks deal with the concept of an _application_.


### Other posts in the series

1.  [If we chose our JavaScript Framework like we chose our music…](https://www.sitepen.com/blog/2017/06/13/if-we-chose-our-javascript-framework-like-we-chose-our-music/ "If we chose our JavaScript Framework like we chose our music…")
2.  [Web Frameworks: User Interface Development](https://www.sitepen.com/blog/2017/06/16/web-frameworks-user-interface-development/ "Web Frameworks: User Interface Development")
3.  [Web Frameworks:User Experience Design](https://www.sitepen.com/blog/2017/06/27/web-frameworks-user-experience-design/ "Web Frameworks:User Experience Design")
4.  Web Frameworks: Foundational Technologies
