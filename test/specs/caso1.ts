import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData } from '../../data/loginData';
const sql = require('mssql');
//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]
async function borracliente(telefono) {
  // Connection configuration
  const config = {
    user: '',
    password: '',
    server: '',
    database: '',
    options: {
      encrypt: true, // Use true if connecting to Azure SQL
      trustServerCertificate: true // For local dev
    }
  };

  try {
    let pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    const request = new sql.Request(transaction);
    await request.query(`
      DECLARE @telefono VARCHAR(10) = '${telefono}';
      DECLARE @cli_id INT;
      SELECT @cli_id = cli_id 
      FROM ECOMMGZA.ECOMM.te_cliente 
      WHERE cli_tel = @telefono;

      DELETE FROM ECOMMGZA.ECOMM.te_2fa_phone_verification 
      WHERE phone_number = @telefono;

      DELETE FROM ECOMM.td_operaciones
      WHERE oped_opem_id IN (
          SELECT opem_id 
          FROM ECOMM.tp_operaciones 
          WHERE opem_cli_id = @cli_id
      );

      DELETE FROM ECOMM.tp_operaciones 
      WHERE opem_cli_id = @cli_id;

      DELETE FROM ECOMM.mail_token 
      WHERE tok_cli_id = @cli_id;

      DELETE FROM ECOMMGZA.ECOMM.te_cliente 
      WHERE cli_id = @cli_id;
    `);

    // Commit transaction
    await transaction.commit();
    console.log(`Cliente con tel ${telefono} borrado exitoso.`);
  } catch (err) {
    console.error('Error con el query:', err);

    // Rollback if error
    if (transaction) {
      await transaction.rollback();
    }
  } finally {
    sql.close();
  }
}

async function llegaralFinal() {

await driver.action('pointer')
  .move({ duration: 0, x: 336, y: 1214 })
  .down({ button: 0 })
  .move({ duration: 1000, x: 360, y: 232 })
  .up({ button: 0 })
  .perform();
}

async function llegaralPrincipio() {
    await driver.action('pointer')
  .move({ duration: 0, x: 369, y: 149 })
  .down({ button: 0 })
  .move({ duration: 1000, x: 356, y: 1188 })
  .up({ button: 0 })
  .perform();
}

async function selectSucursal(){

//const el2 = await driver.$("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(2)");
//await el2.addValue("54180");
await driver.action('pointer').move({ duration: 0, x: 140, y: 483 }).down({ button: 0 }).pause(50).move({ duration: 1000, x: 140, y: 483 }).({ button: 0 }).perform();
//await driver.action('pointer').move({ duration: 0, x: 215, y: 703 }).down({ button: 0 }).move({ duration: 1000, x: 260, y: 715 }).up({ button: 0 }).perform();

await driver.action('pointer').move({ duration: 0, x: 212, y: 568 }).down({ button: 0 }).move({ duration: 1000, x: 212, y: 568 }).up({ button: 0 }).perform();
//await driver.action('pointer').move({ duration: 0, x: 233, y: 802 }).down({ button: 0 }).move({ duration: 1000, x: 233, y: 802 }).up({ button: 0 }).perform();
}

async function linkterminos() {
  await driver.action('pointer').move({ duration: 0, x: 279, y: 1264 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
  allure.addStep(`Validación exitosa:"`);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`link click`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
}

async function linkpoliticas() {
await driver.action('pointer').move({ duration: 0, x: 293, y: 1357 }).down({ button: 0 }).pause(50).up({ button: 0 }).perform();
allure.addStep(`Validación exitosa:"`);
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`link click`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
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
      await el.setValue(valor);
      expect(valor).toBe(esperado);
      allure.addStep(`Validación exitosa: ${nombre} = "${valor}"`);
      allure.addLabel('input-field', valor);
      allure.addArgument('expected value', esperado);
  //const screenshot = await browser.takeScreenshot();
  //allure.addAttachment(`${nombre} ingresado`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();
  if(nombre!='Codigo Postal')
  {
    await driver.back();
  }else{ await driver.hideKeyboard()}
  
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
    //await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await driver.pause(6000); // 16 seconds
    //await darClicyFoto('//android.widget.Button[@content-desc="Ignorar"]', 'sin update');
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
    await borracliente('4427152965');
    await driver.activateApp("mx.com.zorroabarrotero.zorro_expres_app");
  });

  afterEach(async () => {
     await driver.terminateApp("mx.com.zorroabarrotero.zorro_expres_app");
  });



it('TC_A_037 telefono a 11 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '12345678901';
  expec.telefono = '12345678901';
  err.telefono = 'Quedan 0 caracteres';
  try {
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
    await insertarContrasena("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(4)", tes.contraseña1, 'Password', expec.contraseña1);
    await insertarContrasena("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(5)", tes.contraseña2, 'Password', expec.contraseña2);
    await selectSucursal();
    llegaralFinal();
    const termsCheckbox1 = await driver.$('android=new UiSelector().descriptionContains("términos y condiciones")');
    await termsCheckbox1.click();
    const isChecked1 = await termsCheckbox1.getAttribute("checked");
    const termsCheckbox2 = await driver.$('android=new UiSelector().descriptionContains("políticas de privacidad.")');
    await termsCheckbox2.click();
    const isChecked2 = await termsCheckbox2.getAttribute("checked");
    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
    llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[1]',err.telefono,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});
  });