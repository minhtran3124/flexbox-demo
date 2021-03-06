'use strict';
var path = require('path');
var modRewrite = require('connect-modrewrite');
var pngquant = require('imagemin-pngquant');

// Default paths
var app = 'app';
var tmp = '.tmp';
var dist = 'dist';
var bowerDir = 'bower_components';


// Default paths in app folder
var data = 'data';
var fonts = 'fonts';
var icons = 'icons';
var images = 'images';
var scripts = 'scripts';
var styles = 'styles';
var views = 'views';

var languages = {
  list: ['en'],
  primary: 'en'
};

// Rewrite rules enables removing .html extensions in development.
// This are possible routes for same test.html file:
// http://localhost:3000/test.html
// http://localhost:3000/test
var rewriteRules = [
  '^/$ - [L]', // default site root handling (index.html)
  '.html$ - [L]', // ignore routes ends with '.html'
  '(.*)/$ $1/index.html [L]', // routes with trailing slash are directories -> rewrite to directory index.html
  '\\/\[a-zA-Z0-9_\\-.]+\\.\[a-zA-Z0-9]+$ - [L]', // ignore files with extension (eg. .css, .js, ...)
  '(.*)$ $1.html [L]' // redirect routes ends with string without trailing slash to original html
];

// Default settings
module.exports.uglifyJs = true; // to remove .min sufix edit template manually
module.exports.minifyCss = true; // to remove .min sufix edit template manually
module.exports.cacheBust = true;
module.exports.optimizeImages = true;
module.exports.lintJs = true;

// Browser sync task config
module.exports.browserSync = {
  dev: {
    server: {
      baseDir: [tmp, app],
      routes: {
        '/bower_components': bowerDir
      }
    },
    notify: false,
    debugInfo: false,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  },
  dist: {
    server: {
      baseDir: dist
    },
    notify: false,
    debugInfo: false,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  }
};

// Build size task config
module.exports.buildSize = {
  srcAll: dist + '/**/*',
  cfgAll: {
    title: 'build',
    gzip: true
  },
  srcCss: path.join(dist, styles, '/**/*'),
  cfgCss: {
    title: 'CSS',
    gzip: true
  },
  srcJs: path.join(dist, scripts, '/**/*'),
  cfgJs: {
    title: 'JS',
    gzip: true
  },
  srcImages: path.join(dist, images, '/**/*'),
  cfgImages: {
    title: 'Images',
    gzip: false
  }
};

// Clean task config
// Be carefull what you cleaning!
module.exports.clean = [tmp, dist];

// Copy fonts task config
module.exports.copyFonts = {
  src: path.join(app, fonts, '**/*'),
  dest: dist + '/fonts'
};

// Copy fonts task config
module.exports.copyIcons = {
  src: path.join(app, icons, '**/*'),
  dest: dist + '/icons'
};

// Copy extras task config
module.exports.copyExtras = {
  src: [
    app + '/*.*',
    '!' + app + '/*.html'
  ],
  dest: dist,
  cfg: {
    dot: true
  }
};

// JSHint task config
module.exports.jshint = {
  src: [
    path.join(app, scripts,'**/*.js'),
    path.join('!' + app, scripts,'plugins/**/*.js') // do not lint external plugins
  ],
  reporter: require('jshint-stylish')
};

// Modernizr task config
module.exports.modernizr = {
  src: [
    path.join(app, scripts,'**/*.js'),
    path.join(tmp, styles,'*.css')
  ],
  dest: path.join(tmp, scripts, 'plugins'),
  cfg: {
    silent: true,
    options: [
      'setClasses',
      'addTest',
      'html5printshiv',
      'testProp',
      'fnBind'
    ]
  }
};

// User scripts task
module.exports.scripts = {
  src: path.join(app, scripts, '**/*.js'),
  dest: path.join(tmp, scripts)
};

// Styles task config
module.exports.styles = {
  src: path.join(app, styles, 'main.scss'),
  dest: path.join(tmp,styles),
  sassCfg: {
    sourcemap: true,
    style: 'expanded',
    lineNumbers: true,
    container: 'jasmine',
    compass: true
  },
  autoprefixerCfg: {browsers: ['last 2 version']}
};

// Templates task config
module.exports.templates = {
  languages: languages,
  src: path.join(app, views, '*.jade'),
  srcBuild: path.join(tmp, 'jade/*.jade'),
  dest: tmp,
  destBuild: path.join(dist),
  cfg: {
    pretty: true,
    compileDebug: true
  }
};

module.exports.useref = {
  src: path.join(app, views, '/**/*.jade'),
  dest: dist,
  destJade: path.join(tmp, 'jade'),
  assetsCfg: {
    searchPath : app
  },
  revManifestCfg: {merge: true}
};

// Watch task config
module.exports.watch = {
  styles: path.join(app, styles, '/**/*.scss'),
  jade: [
    path.join(app, views, '/**/*.jade')
    // path.join(app, views, data, '/**/*.json')
  ],
  scripts: path.join(app, scripts, '/**/*.js'),
  wiredep: 'bower.json'
};

// Wiredep task config
module.exports.wiredep = {
  sass: {
    src: path.join(app, styles, '/*.scss'),
    dest: path.join(app, styles),
    cfg: {
      ignorePath: '',
      overides: {}
    }
  },
  jade: {
    src: path.join(app, views, '/layouts/*.jade'),
    dest: path.join(app, views, '/layouts'),
    cfg: {
      exclude: ['modernizr'],
      ignorePath: '../../',
      overides: {}
    }
  }
}
