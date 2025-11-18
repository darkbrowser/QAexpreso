# QAexpreso
# 1 instalar dependencias
npm install
npm install -g appium
npm install -g appium-doctor
# 2 ejecutar pruebas
npx wdio run wdio.conf.js
# 3 generar reporte
allure generate allure-results --clean -o allure-report
# 4 abrir reportes
allure serve -p 8080 allure-results
