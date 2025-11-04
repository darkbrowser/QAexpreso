import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData, testData } from '../../data/loginData';

async function validarMensajedeError(selector, expected, label) {
  const el = await driver.$(selector);
  const actual = await el.getText();
  allure.startStep(`Validar ${label}: se esperaba "${expected}", se obtuvo "${actual}"`);
  expect(actual).toBe(expected);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${label} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function fijarvariableconPasos(selector, value, label,expected) {
  const el = await driver.$(selector);    
  await el.click();
  allure.startStep(`Ingresar ${label}: ${value}`);
  await el.setValue(value);
  expect(value).toBe(expected);
  allure.addStep(`Validación exitosa: ${label} = "${value}"`);
  allure.addLabel('input-field', label);
  allure.addArgument('expected value', value);

  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`${label} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
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



async function fillRegistrationFormpart1(datatest,dataexpected) {
  await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', datatest.nombre, 'nombre',dataexpected.nombre);
  await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', datatest.apellidoPaterno, 'apellido paterno',dataexpected.apellidoPaterno);
  await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', datatest.apellidoMaterno, 'apellido materno',dataexpected.apellidoMaterno);
  await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', datatest.telefono, 'teléfono',dataexpected.telefono);
  await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', datatest.correo, 'correo',dataexpected.correo);
}

async function fechadefault(){
  await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
      await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
}

async function fillRegistrationFormpart2(datatest,dataexpected) {
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

async function passwords(data,expecte){

      
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
    await darClicyFoto('//android.widget.TextView[@content-desc="Predicted app: Exprezo"]', 'App Exprezzo');
  });

  

  it('TC_A_01', async () => {
    const tes = { testData };
    const expec = { expectedData };
    //const errorData = { ...Dataerror };
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectedData.codigopostal);
      await fillRegistrationFormpart1(tes,expec);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await setValueWithStep('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectedData.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña2);
      allure.addArgument('expected value', expectedData.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });
 

  it('TC_A_02', async () => {
    const testData = { ...Datatest };
    const expectData = { ...Dataexpect };
    const errorData = { ...Dataerror };
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal', expectData.codigopostal);
      await fillRegistrationFormpart1(testData,expectData);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectData.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.constraseña2);
      allure.addArgument('expected value', expectData.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //despues del capcha
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });


  it('TC_A_03', async () => {
    const testData = { ...Datatest };
    const expectData = { ...Dataexpect };
    const errorData = { ...Dataerror };
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal', expectData.codigopostal);
      await fillRegistrationFormpart1(testData,expectData);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente',expectData.numCliente);
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectData.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.constraseña2);
      allure.addArgument('expected value', expectData.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      //validarerrores1(errorData);
      errorData.telefono = 'La direccion de correo o número de teléfono ingresado ya existe'
      validarMensajedeError('//android.view.View[@content-desc="La direccion de correo o número de teléfono ingresado ya existe"]',errorData.telefono,'Telefono');
      llegaralFinal();
      //validarerrores2(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });

  it('TC_A_04', async () => {
    const testData = { ...Datatest };
    const expectData = { ...Dataexpect };
    const errorData = { ...Dataerror };
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectData.codigopostal);
      await fillRegistrationFormpart1(testData,expectData);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente', expect.);
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', testData.contraseña1);
      allure.addArgument('expected value', expectData.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', testData.constraseña2);
      allure.addArgument('expected value', expectData.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      errorData.correo = 'La direccion de correo o número de teléfono ingresado ya existe'
      validarMensajedeError('//android.view.View[@content-desc="La direccion de correo o número de teléfono ingresado ya existe"]',errorData.correo,'Telefono');
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });

   it('TC_A_10', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const errs = { ...errorData }
    tes.nombre = '1234567890';
    expec.nombre = '1234567890';
    errs.nombre = 'Solo se permiten letras'
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectData.codigopostal);
      await fillRegistrationFormpart1(tes,expec);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await setValueWithStep('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña1);
      allure.addArgument('expected value', expec.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña2);
      allure.addArgument('expected value', expec.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',errs.nombre,'Nombre');
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });
 
  it('TC_A_11', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const errs = { ...errorData }
    tes.nombre = '';
    expec.nombre = '';
    //const errorData = { ...Dataerror };
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectData.codigopostal);
      await fillRegistrationFormpart1(tes,expec);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await setValueWithStep('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña1);
      allure.addArgument('expected value', expec.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña2);
      allure.addArgument('expected value', expec.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar 
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"]',errs.nombre,'Nombre');
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });

  it('TC_A_13', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const errs = { ...errorData }
    tes.nombre = 'zxcvbnmasdfghjklqwertyuiopmnbv'
    expec.nombre = 'zxcvbnmasdfghjklqwertyuiopmnbv';
    errs.nombre = '30/30'
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectData.codigopostal);
      await fillRegistrationFormpart1(tes,expec);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await setValueWithStep('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña1);
      allure.addArgument('expected value', expec.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña2);
      allure.addArgument('expected value', expec.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      validarMensajedeError('//android.view.View[@content-desc="29/30"]',errs.nombre,'Nombre');
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });

  it('TC_A_15', async () => {
    const tes = { ...testData };
    const expec = { ...expectedData };
    const errs = { ...errorData }
    tes.nombre = 'zxcvbnmasdfghjklqwertyuiopmnbgs'
    expec.nombre = 'zxcvbnmasdfghjklqwertyuiopmnbgs';
    errs.nombre = '30/30'
    try {
      await gotoExprezo();
      
      await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', testData.codigopostal, 'Codigo Postal',expectData.codigopostal);
      await fillRegistrationFormpart1(tes,expec);
        //selec fechad default
      await driver.action('pointer').move({ duration: 0, x: 311, y: 1274 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
await driver.action('pointer').move({ duration: 0, x: 557, y: 1458 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]
  //const suc = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(8)");
      //suc.click();

      llegaralFinal();
  //await setValueWithStep('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', testData.numCliente, 'Num Cliente');
    //sucursal
      await driver.action('pointer').move({ duration: 0, x: 261, y: 964 }).down({ button: 0 }).move({ duration: 1000, x: 321, y: 970 }).up({ button: 0 }).perform();

    await driver.action('pointer').move({ duration: 0, x: 285, y: 1159 }).down({ button: 0 }).move({ duration: 1000, x: 384, y: 1159 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 384, y: 1159 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 360, y: 1171 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

  //passwords 
const pass1 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)");
      await pass1.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass1.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña1);
      allure.addArgument('expected value', expec.contraseña1);
      allure.endStep();
await driver.hideKeyboard();
      const pass2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)");
      await pass2.click();
      await driver.pause(500);
      await driver.hideKeyboard();
      await pass2.setValue("Password1234");
      allure.addLabel('input-field', tes.contraseña2);
      allure.addArgument('expected value', expec.contraseña2);
      allure.endStep();
await driver.hideKeyboard();

      //clic en aceptar
      await driver.action('pointer').move({ duration: 0, x: 176, y: 1806 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 180, y: 1945 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
      await driver.action('pointer').move({ duration: 0, x: 479, y: 2113 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();

      llegaralPrincipio();
      validarMensajedeError('//android.view.View[@content-desc="30/30"]',errs.nombre,'Nombre');
      //validarerrores1(errorData);
      llegaralFinal();
      //validarerrores2(errorData);
      //validarerrores3(errorData);
    } catch (error) {
      const errorShot = await browser.takeScreenshot();
      allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
      throw error;
    }
  });




});