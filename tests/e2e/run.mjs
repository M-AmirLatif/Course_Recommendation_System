import { run } from './auth-flow.test.mjs'

try {
  await run()
  console.log('E2E smoke runner completed')
} catch (error) {
  console.error('E2E smoke runner failed')
  console.error(error)
  process.exitCode = 1
}
