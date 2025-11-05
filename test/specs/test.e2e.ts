import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData } from '../../data/loginData';

async function validarMensajedeError(selector, expected, label) {
  const el = await driver.$(selector);
  const actual = await el.getText();
  allure.startStep(`Validar ${label}: se esperaba "${expected}", se obtuvo "${actual}"`);
  expect(actual).toBe(expected);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${label} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
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

async function llegaralFinal() {
await driver.action('pointer')
  .move({ duration: 0, x: 537, y: 1937 }).down({ button: 0 }).move({ duration: 1000, x: 528, y: 467 }).up({ button: 0 }).perform();
}

async function llegaralPrincipio() {
await driver.action('pointer').move({ duration: 0, x: 582, y: 459 }).down({ button: 0 }).move({ duration: 1000, x: 516, y: 2023 }).up({ button: 0 }).perform();
}

async function selectSucursal(){
  await driver.action('pointer').move({ duration: 0, x: 295, y: 1036 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
  await driver.action('pointer').move({ duration: 0, x: 381, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
  await driver.action('pointer').move({ duration: 0, x: 545, y: 1876 }).down({ button: 0 }).move({ duration: 1000, x: 520, y: 1184 }).up({ button: 0 }).perform();
}

async function validarerrores1(data) {
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',data.nombre,'Nombre');
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su Apellido"])[1]',data.apellidoMaterno,'Apellido Materno');
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su Apellido"])[2]',data.apellidoMaterno,'Apellido Materno');
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su teléfono"]',data.telefono,'Telefono');
  validarMensajedeError('//android.view.View[@content-desc="Requerido"]',data.correo,'Telefono');
}

async function validarerrores2(data) {
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su código postal"]',data.codigopostal,'Codigo Postal');
  validarMensajedeError('//android.view.View[@content-desc="Ingrese su contraseña"]',data.contraseña1,'Contrasena');
  validarMensajedeError('//android.view.View[@content-desc="Ingrese de nuevo su contraseña"]',data.contraseña1,'Confirmar Contrasena');
}

async function gotoExprezo() {
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

  it('TC_A_01', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_02', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_03', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_04', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_05', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_06', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_07', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_08', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_09', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_10', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_11', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_12', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_13', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_14', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_15', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_16', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_17', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_18', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_19', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_20', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_21', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_22', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_23', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_24', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_25', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_26', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_27', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_28', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_29', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_30', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_31', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_32', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_33', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_34', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_35', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_36', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_37', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_38', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_39', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_40', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_41', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_42', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_43', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_44', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_45', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_46', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_47', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_48', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_49', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_50', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_51', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_52', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_53', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_54', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_55', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_56', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_57', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_58', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_59', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_60', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_61', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_62', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_63', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_64', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_65', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_66', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_67', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_68', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_69', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_70', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_71', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_72', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_73', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_74', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_75', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_76', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_77', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_78', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_79', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_80', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_81', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_82', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_83', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_84', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_85', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_86', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_87', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_88', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_89', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_90', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_91', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_92', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_93', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_94', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_95', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_96', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_97', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_98', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_99', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_100', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_101', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_102', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_103', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_104', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    err.nombre='';
    
    try {
      await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
      await gotoExprezo();
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
      await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
      
      llegaralFinal();

      const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
      await driver.hideKeyboard();

      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      
      llegaralFinal();

      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();
      
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      llegaralFinal();
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

});