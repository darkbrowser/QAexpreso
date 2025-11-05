import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData } from '../../data/loginData';

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

  it('TC_A_001', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_002', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_003', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_004', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_005', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_006', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_007', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_008', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_009', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_010', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_011', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_012', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_013', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_014', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_015', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_016', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_017', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_018', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_019', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_020', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_021', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_022', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_023', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_024', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_025', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_026', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_027', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_028', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_029', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_030', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_031', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_032', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_033', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_034', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_035', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_036', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_037', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_038', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_039', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_040', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_041', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_042', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_043', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_044', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_045', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_046', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_047', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_048', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_049', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_050', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_051', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_052', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_053', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_054', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_055', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_056', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_057', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_058', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_059', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_060', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_061', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_062', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_063', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_064', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_065', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_066', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_067', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_068', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_069', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_070', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_071', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_072', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_073', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_074', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_075', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_076', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_077', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_078', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_079', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_080', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_081', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_082', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_083', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_084', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_085', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_086', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_087', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_088', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_089', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_090', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_091', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_092', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_093', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_094', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_095', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_096', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_097', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_098', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

it('TC_A_099', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const err = { ...errorData };
    tes.nombre='';
    expec.nombre='';
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
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
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
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
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
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
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
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
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
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
    //err.nombre='';
    
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

      const pass1 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
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

      const pass2 = driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
      await driver.hideKeyboard();

      const termsCheckbox = await driver.$(
      'android=new UiSelector().descriptionContains("términos y condiciones")');
      await termsCheckbox.click();
      const isChecked1 = await termsCheckbox.getAttribute("checked");

      const termsCheckbox2 = await driver.$(
      'android=new UiSelector().descriptionContains("políticas de privacidad.")');
      await termsCheckbox2.click();
      const isChecked2 = await termsCheckbox.getAttribute("checked");

    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
     await llegaralPrincipio();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
      await llegaralFinal();
      //await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }

});

});