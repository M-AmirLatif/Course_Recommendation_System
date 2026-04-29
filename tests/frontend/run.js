const path = require('node:path')

const testFiles = [
  'auth-client.test.js',
  'config.test.js',
]

const run = async () => {
  let failures = 0

  for (const file of testFiles) {
    const testModule = require(path.join(__dirname, file))

    try {
      await testModule.run()
      console.log(`PASS ${file}`)
    } catch (error) {
      failures += 1
      console.error(`FAIL ${file}`)
      console.error(error)
    }
  }

  if (failures > 0) {
    process.exitCode = 1
    return
  }

  console.log(`Frontend tests passed: ${testFiles.length}`)
}

run()
