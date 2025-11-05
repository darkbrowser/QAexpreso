# QAexpreso
npx wdio run wdio.conf.js
allure generate allure-results --clean -o allure-report
allure serve -p 8080 allure-results