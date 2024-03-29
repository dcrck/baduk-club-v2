import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import { terser } from 'rollup-plugin-terser'
import rootImport from 'rollup-plugin-root-import'
import dotenv from 'dotenv'
import config from 'sapper/config/rollup.js'
import alias from 'rollup-plugin-alias'
import pkg from './package.json'

import getPreprocessor from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'
import PurgeSvelte from 'purgecss-from-svelte'
import path from 'path'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = !!process.env.SAPPER_LEGACY_BUILD

const onwarn = (warning, onwarn) =>
  (warning.code === 'CIRCULAR_DEPENDENCY' &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning)
const dedupe = importee =>
  importee === 'svelte' || importee.startsWith('svelte/')

// Environment variables from .env file
const env = dotenv.config({
  path: path.resolve(__dirname, `.${mode}.env`),
}).parsed

const envKeys = Object.keys(env).reduce(
  (obj, key) => ({ ...obj, [`process.env.${key}`]: JSON.stringify(env[key]) }),
  {}
)

const imports = {
  root: path.resolve(__dirname, 'src'),
  useEntry: 'prepend',
  extensions: ['.svelte', '.js'],
}

const clientAliases = {
  resolve: ['.svelte', '.js'],
}

const serverAliases = {
  ...clientAliases,
}

const postcssPlugins = (purgecss = false) => {
  return [
    require('postcss-import')(),
    require('postcss-url')(),
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer')(),
    // Do not purge the CSS in dev mode to be able to play with classes in the browser dev-tools.
    purgecss &&
      require('@fullhuman/postcss-purgecss')({
        content: ['./**/*.svelte', './src/template.html'],
        extractors: [
          {
            extractor: PurgeSvelte,

            // Specify the file extensions to include when scanning for
            // class names.
            extensions: ['svelte', 'html'],
          },
        ],
        // Whitelist selectors to stop Purgecss from removing them from your CSS.
        whitelist: [],
      }),
    !dev && require('cssnano'),
  ].filter(Boolean)
}

const preprocess = getPreprocessor({
  transformers: {
    postcss: {
      plugins: postcssPlugins(), // Don't need purgecss because Svelte handles unused css for you.
    },
  },
})

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      // Make process variables available for use in code
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        ...envKeys,
      }),
      alias(clientAliases),
      json(),
      rootImport(imports),
      svelte({
        dev,
        hydratable: true,
        emitCss: true,
        preprocess,
      }),
      resolve({
        browser: true,
        dedupe,
      }),
      commonjs(),

      legacy &&
        babel({
          extensions: ['.js', '.mjs', '.html', '.svelte'],
          runtimeHelpers: true,
          exclude: ['node_modules/@babel/**'],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 0.25%, not dead',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
        ...envKeys,
      }),
      alias(serverAliases),
      json(),
      rootImport(imports),
      svelte({
        generate: 'ssr',
        dev,
        preprocess,
      }),
      resolve({
        dedupe,
      }),
      commonjs(),
      postcss({
        plugins: postcssPlugins(!dev),
        extract: path.resolve(__dirname, './static/global.css'),
      }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules ||
        Object.keys(process.binding('natives'))
    ),

    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      commonjs(),
      !dev && terser(),
    ],

    onwarn,
  },
}
