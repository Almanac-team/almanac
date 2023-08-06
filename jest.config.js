// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

/** @type {import('jest').Config} */
const customJestConfig = {
    // your stuff goes here
}

const jestConfigWithOverrides = async (...args) => {
    const fn = createJestConfig(customJestConfig)
    const res = await fn(...args)

    res.transformIgnorePatterns = res.transformIgnorePatterns.map((pattern) => {
        if (pattern === '/node_modules/') {
            return '/node_modules(?!/hastscript)/'
        }
        return pattern
    })

    return res
}

module.exports = jestConfigWithOverrides