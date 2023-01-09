#!/bin/bash -e

npm run test -- --coverage
npm run test:e2e -- --coverage

npx ts-node ./scripts/merge-coverage.ts --report ./coverage/e2e/coverage-final.json --report ./coverage/unit/coverage-final.json


