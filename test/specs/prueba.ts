import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData } from '../../data/loginData';

async function llegaralFinal() {
    await driver.action('pointer').move({ duration: 0, x: 357, y: 1406 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 231 }).up({ button: 0 }).perform();
}

async function llegaralPrincipio() {
    await driver.action('pointer').move({ duration: 0, x: 346, y: 349 }).down({ button: 0 }).move({ duration: 1000, x: 338, y: 1553 }).up({ button: 0 }).perform();
}

async function selectSucursal(){
    await driver.action('pointer').move({ duration: 0, x: 215, y: 703 }).down({ button: 0 }).move({ duration: 1000, x: 260, y: 715 }).up({ button: 0 }).perform();
    await driver.action('pointer').move({ duration: 0, x: 233, y: 802 }).down({ button: 0 }).move({ duration: 1000, x: 233, y: 802 }).up({ button: 0 }).perform();
}

async function validarMensajedeError(clase, esperado, sello) {
  const el = await driver.$(clase);
  const actual = await el.getAttribute('contentDescription');
  allure.startStep(`Validar ${sello}: se esperaba "${esperado}", se obtuvo "${actual}"`);
  expect(actual).toBe(esperado);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${sello} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function fijarvariableconPasos(clase, valor, nombre, esperado) {
      const el = await driver.$(clase);
      allure.startStep(`Ingresar ${nombre}: ${valor}`);    
      await el.click();
      // await driver.pause(500);
      await driver.hideKeyboard();
      await el.setValue(valor);
      expect(valor).toBe(esperado);
      allure.addStep(`Validación exitosa: ${nombre} = "${valor}"`);
      allure.addLabel('input-field', valor);
      allure.addArgument('expected value', esperado);
      allure.endStep();
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${nombre} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function insertarContrasena(clase, valor, nombre, esperado) {
      const el = await driver.$(clase);
      allure.startStep(`Ingresar ${nombre}: ${valor}`);    
      await el.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await el.setValue(valor);
      expect(valor).toBe(esperado);
      allure.addStep(`Validación exitosa: ${nombre} = "${valor}"`);
      allure.addLabel('input-field', valor);
      allure.addArgument('expected value', esperado);
      allure.endStep();
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${nombre} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function darClicyFoto(selector, label, expectedSelector = null, expectedLabel = null) {
  const el = await driver.$(selector);
  allure.startStep(`Click en ${label}`);
  await el.click();
  if (expectedSelector) {
    const expectedEl = await driver.$(expectedSelector);
    await expect(expectedEl).toBeDisplayed();
    allure.addStep(`Validación: ${expectedLabel} está visible`);
  }
  allure.addLabel('click-action', label);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`Click en ${label}`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function gotoExprezo() {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Regístrate Aquí"]', 'Botón Regístrate Aquí');
    await darClicyFoto('//android.widget.Button[@content-desc="Iniciar periodo de prueba"]', 'Botón Iniciar periodo de prueba');
}



describe('Exprezzo App', () => {
  before(async () => {
    allure.addEnvironment('Plataforma', 'Android');
    allure.addEnvironment('Sistema operativo', 'macOS');
    allure.addEnvironment('Tester', 'Saul Solis');
    allure.addAttachment('Datos de prueba', JSON.stringify(testData, null, 2), 'application/json');
  });

  beforeEach(async () => {
    //minimiza y cierra apps antes de abrir la de exprezo
    await driver.executeScript('mobile:pressKey', [{ keycode: 3 }]);
    await driver.terminateApp("com.android.chrome");
    await driver.terminateApp("mx.com.zorroabarrotero.zorro_expres_app");
  });

  
});

