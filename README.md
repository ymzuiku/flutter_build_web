# flutter_build_web

## Feature

1. Build main.dart.js -> main\_[hash].dart.js
2. Change index.html main.dart.js -> main\_[hash].dart.js

## Use

In flutter project root dir, run this:

```sh
# only rename main.dart.js
npx flutter_build_web
# flutter build web and rename main.dart.js
npx flutter_build_web build
```
