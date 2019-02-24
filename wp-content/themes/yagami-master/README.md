# Yagami Starter Theme

## Make it work
### Cloning the starter theme
```
$ git clone https://gitlab.com/kaitaniriku/yagami.git && cd yagami && rm -rf .git && rm .gitignore 
```

### Install dependencies
```
$ cd web
$ npm install
```

### Run webpack
```
$ cd web
$ npm run start
```

## Update MKX

### Files to add / edit manually

- ./web/webpack.yaml (edit carefully: browserSync, debugTool, aliases)
- ./web/src/debug-tool/ (add)
- ./web/src/js/app.js (edit carefully)
- ./web/src/js/pages/home.js (add for ajax sample)
- ./web/src/js/pages/main.js (edit --> clean file)
