import { expect, browser, $ } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import { testData,errorData,expectedData } from '../../data/loginData';
const sql = require('mssql');

async function borracliente(telefono) {
  // Connection configuration
  const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server', // e.g. 'localhost' or '192.168.1.100'
    database: 'ECOMMGZA',
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
    await driver.executeScript('mobile:pressKey', [{ keycode: 3 }]);
    await driver.terminateApp("com.android.chrome");
    await driver.terminateApp("mx.com.zorroabarrotero.zorro_expres_app");
    cerrar pestana
    abirir pestana devex[reso]
  });

it('TC_A_001 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
  try {
    await gotoExprezo();
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
    
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
    await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
    await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
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
    await fijarvariableconPasos('//android.widget.EditText', tes.codigoAlta, 'Codigo de Alta', expec.codigoAlta); //validar CODIGO
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');//clic para habilitar
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');//boton
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });
  
it('TC_A_002 alta usuario cliente red', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
  try {
    await gotoExprezo();
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
    
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[4]', tes.telefono, 'teléfono', expec.telefono);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[5]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[6]', tes.codigopostal, 'Codigo Postal', expec.codigopostal);
    await darClicyFoto('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.view.View[1]', 'Selector de fecha');
    await darClicyFoto('//android.widget.Button[@content-desc="Aceptar"]', 'Botón Aceptar fecha');
    llegaralFinal();
    await insertarContrasena("-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)", tes.numCliente, 'Num Cliente', expec.numCliente);
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
    await fijarvariableconPasos('//android.widget.EditText', tes.codigoAlta, 'Codigo de Alta', expec.codigoAlta); //validar CODIGO
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');//clic para habilitar
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');//boton
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

it('TC_A_003 telefono registrado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '5563175580';
  expec.telefono = '5563175580';
  err.codigoAlta = 'La direccion de correo o número de teléfono ingresado ya existe.';
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
    await validarMensajedeError('//android.widget.Button[@content-desc="La direccion de correo o número de teléfono ingresado ya existe."]', err.codigoAlta, 'Ya existe');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_004 correo registrado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'ing.saulsolisg@gmail.com';
  expec.correo = 'ing.saulsolisg@gmail.com';
  err.codigoAlta = 'La direccion de correo o número de teléfono ingresado ya existe';
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
    await validarMensajedeError('//android.widget.Button[@content-desc="La direccion de correo o número de teléfono ingresado ya existe"]', err.codigoAlta, 'Ya existe');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_005 codigo postal invalido', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.codigopostal = '00000';
  expec.codigopostal = '00000';
  err.codigopostal = 'Por el momento no estamos en tu localidad';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Por el momento no estamos en tu localidad"]',err.codigopostal,'Nombre');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_006 imagen membresia premium', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.codigoAlta = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]';
  expec.codigoAlta = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.widget.ImageView[2]';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Regístrate Aquí"]', 'Botón Regístrate Aquí');
await validarMensajedeError(tes.codigoAlta,expec.codigoAlta,'Membresia Premnium')
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_007 volver al home', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = '';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Regístrate Aquí"]', 'Botón Regístrate Aquí');
    await driver.executeScript('mobile:pressKey', [{ keycode: 4 }]);
    await driver.executeScript('mobile:pressKey', [{ keycode: 4 }]);
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_008 volver a pantalla prueba', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  try {
      await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Regístrate Aquí"]', 'Botón Regístrate Aquí');
await darClicyFoto('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.widget.Button', 'Volver');
allure.startStep(`Volver a Inicio`);    

      allure.addStep(`Validación exitosa:`);
      allure.addLabel('input-field', 'Volver al home');
      allure.endStep();
  const screenshot = await browser.takeScreenshot();
  allure.addAttachment(`Volver al Home`, Buffer.from(screenshot, 'base64'), 'image/png');
  allure.endStep();  
} catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_009 nombre vacio', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.nombre,'Nombre');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_010 nombre datos numericos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '1234567890';
  expec.nombre = '1234567890';
  err.nombre = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"]',err.nombre,'Nombre');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_011 nombre vacio', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su nombre"]',err.nombre,'Nombre');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_012 nombre caracteres especiales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '@%&nombredsadsa';
  expec.nombre = '@%&nombredsadsa';
  err.nombre = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"]',err.nombre,'Nombre');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_013 nombre con 30 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  expec.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  err.nombre = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[1]',err.nombre,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_014 nombre con 29 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  expec.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  err.nombre = '29/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 1 caracteres"])[1]',err.nombre,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_015 nombre con 31 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  expec.nombre = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  err.nombre = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[1]',err.nombre,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_016 apellido paterno numerico', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = '12345678';
  expec.apellidoPaterno = '12345678';
  err.apellidoPaterno = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"])[1]',err.apellidoPaterno,'Solo se permiten letras');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_017 apellido paterno Solo se permiten letras', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = '';
  expec.apellidoPaterno = '';
  err.apellidoPaterno = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"])[1]',err.apellidoPaterno,'Solo se permiten letras');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_018 apellido paterno campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = '';
  expec.apellidoPaterno = '';
  err.apellidoPaterno = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"])[1]',err.apellidoPaterno,'Apellido Paterno');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_019 apellido paterno Ingrese su Apellido', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = '';
  expec.apellidoPaterno = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su Apellido"])[1]',err.apellidoPaterno,'Ingrese su Apellido');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_020 apellido paterno Solo se premiten letras', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = '@#%$asdf';
  expec.apellidoPaterno = '@#%$asdf';
  err.apellidoPaterno = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"])[1]',err.apellidoPaterno,'Solo se permiten letras');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_021 apellido paterno a 30 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbcccccccccc';
  expec.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbcccccccccc';
  err.apellidoPaterno = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[2]',err.apellidoPaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_022 apellido paterno a 29 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbccccccccc';
  expec.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbccccccccc';
  err.apellidoPaterno = '29/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 1 caracteres"])[2]',err.apellidoPaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_023 apellido paterno a 31 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbccccccccccd';
  expec.apellidoPaterno = 'aaaaaaaaaabbbbbbbbbbccccccccccd';
  err.apellidoPaterno = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[2]',err.apellidoPaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_024 apellido materno campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = '';
  expec.apellidoMaterno = '';
  err.apellidoMaterno = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"])[2]',err.apellidoMaterno,'Campos requeridos');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_025 apellido materno numerico', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = '12345678';
  expec.apellidoMaterno = '2345678';
  err.apellidoMaterno = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Solo se permiten letras"])[2]',err.apellidoMaterno,'Solo se permiten letras');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_026 apellido materno vacio', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = '';
  expec.apellidoMaterno = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su Apellido"])[2]',err.apellidoMaterno,'Apellido Materno');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_027 apellido materno caracteres especiales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = '$#@$#@!#@!';
  expec.apellidoMaterno = '$#@$#@!#@!';
  err.apellidoMaterno = 'Solo se permiten letras';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="ISolo se permiten letras"])[2]',err.apellidoMaterno,'Solo se permiten letras');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_028 apellido materno a 30 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbcccccccccc';
  expec.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbcccccccccc';
  err.apellidoMaterno = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[3]',err.apellidoMaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_029 apellido materno a 29 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbccccccccc';
  expec.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbccccccccc';
  err.apellidoMaterno = '29/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 1 caracteres"])[3]',err.apellidoMaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_030 apellido materno a 31 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbccccccccccd';
  expec.apellidoMaterno = 'aaaaaaaaaabbbbbbbbbbccccccccccd';
  err.apellidoMaterno = '30/30';
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
    await llegaralPrincipio();
    await validarMensajedeError('(//android.view.View[@content-desc="Quedan 0 caracteres"])[3]',err.apellidoMaterno,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_031 fecha nacimiento vacia', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  try {
    await gotoExprezo();
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[1]', tes.nombre, 'nombre', expec.nombre);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[2]', tes.apellidoPaterno, 'apellido paterno', expec.apellidoPaterno);
    await fijarvariableconPasos('//android.view.View[@content-desc="Ingrese sus datos para continuar"]/android.widget.EditText[3]', tes.apellidoMaterno, 'apellido materno', expec.apellidoMaterno);
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
    await llegaralPrincipio();
    //validar fecha
    await validarMensajedeError('//android.view.View[@content-desc="Es requerido"]',err.fecha,'Codigo Postal');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_032 telefono a 9 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '123456789';
  expec.telefono = '123456789';
  err.telefono = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.telefono,'Campos requeridos');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_033 telefono mensaje Deben ser 10 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '123456789';
  expec.telefono = '123456789';
  err.telefono = 'Deben ser 10 digitos';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Deben ser 10 digitos"]',err.telefono,'Deben ser 10 digitos');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_034 telefono a 9 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '12345678901';
  expec.telefono = '12345678901';
  err.telefono = '10/10';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.telefono,'Telefono');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_035 telefono a 10 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '1234567890';
  expec.telefono = '1234567890';
  err.telefono = '10/10';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.telefono,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_036 telefono a 9 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '123456789';
  expec.telefono = '123456789';
  err.telefono = '9/10';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 1 caracteres"]',err.telefono,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_037 telefono a 11 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '12345678901';
  expec.telefono = '12345678901';
  err.telefono = '10/10';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.telefono,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_038 telefono con caracteres especiales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = '$@#%#!@#!%';
  expec.telefono = '$@#%#!@#!%';
  err.telefono = 'Deben ser 10 digitos';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Deben ser 10 digitos"]',err.telefono,'Deben ser 10 digitos');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_039 correo mensaje campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '';
  expec.correo = '';
  err.correo = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.correo,'Longitud Correo');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_040 correo sin @', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'saulsolisggmail.com';
  expec.correo = 'saulsolisggmail.com';
  err.correo = 'ingrese un correo válido';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="ingrese un correo válido"]',err.correo,'ingrese un correo válido');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_041 correo con caracteres especiales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '%$#%@$#(*&';
  expec.correo = '%$#%@$#(*&';
  err.correo = 'ingrese un correo válido';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="ingrese un correo válido"]',err.correo,'ingrese un correo válido');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_042 correo de 63 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaacccccccccccccccccc@outlook.com';
  expec.correo = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaacccccccccccccccccc@outlook.com';
  err.correo = '63/64';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 1 caracteres"]',err.correo,'Longitud de Caracter');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_043 correo de 64 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaaccccccccccccccccccc@outlook.com';
  expec.nombre = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaaccccccccccccccccccc@outlook.com';
  err.nombre = '64/64';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.correo,'Longitud de Caracter');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_044 correo de 65 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaaccccccccccccccccccc@outlook.comd';
  expec.correo = 'aaaaaaaaaaabbbbbbbbbbbaaaaaaaaaaaccccccccccccccccccc@outlook.comd';
  err.correo = '64/64';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.correo,'Longitud de Caracter');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_045 telefono con letras', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.telefono = 'abcdefg';
  expec.telefono = 'abcdefg';
  err.telefono = 'Deben ser 10 digitos';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su teléfono"]',err.telefono,'Telefono');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_046 codigo postal invalido', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '00000';
  expec.correo = '00000';
  err.correo = 'Por el momento no estamos en tu localidad';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Por el momento no estamos en tu localidad"]',err.correo,'Correo Invalido');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_047 codigo posta mensaje campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '';
  expec.correo = '';
  err.correo = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.correo,'Campos requeridos');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_048 codigo postal vacio', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '';
  expec.correo = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Requerido"]',err.correo,'Correo');
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_049 correo a 4 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = '1234';
  expec.correo = '1234';
  err.correo = 'es muy corto, 5 numeros';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="es muy corto, 5 numeros"]',err.correo,'Longitud');
    await llegaralFinal();
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
  tes.correo = '54180';
  expec.correo = '54180';
  err.correo = '';
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
    await llegaralPrincipio();
    await validarMensajedeError('//android.view.View[@content-desc="Requerido"]',err.correo,'Correo');
    await llegaralFinal();
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
  tes.correo = '54180';
  expec.correo = '54180';
  err.nombre = '';
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
    await llegaralPrincipio();
    await llegaralFinal();
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
  tes.correo = '54180';
  expec.correo = '54180';
  err.nombre = '';
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
    await llegaralPrincipio();
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_053 Numero de cliente ingresar texto', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.numCliente = 'asdfghjkl';
  expec.numCliente = 'asdfghjkl';
  err.numCliente = '0/9';
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
    await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', tes.numCliente, 'Num Cliente', expec.numCliente);
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
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 9 caracteres"]',err.numCliente,'Num Cliente');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_054 Num Cliente a 9 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.numCliente = '123456789';
  expec.numCliente = '123456789';
  err.numCliente = '9/9';
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
    await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', tes.numCliente, 'Num Cliente', expec.numCliente);
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
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.numCliente,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_055 Num Cliente a 8 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.numCliente = '12345678';
  expec.numCliente = '12345678';
  err.numCliente = '8/9';
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
    await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', tes.numCliente, 'Num Cliente', expec.numCliente);
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
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 1 caracteres"]',err.numCliente,'Num Cliente');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_056 Num Cliente a 10 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.numCliente = '123456789';
  expec.numCliente = '123456789';
  err.numCliente = '9/9';
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
    await fijarvariableconPasos('-android uiautomator:new UiSelector().className(\"android.widget.EditText\").instance(3)', tes.numCliente, 'Num Cliente', expec.numCliente);
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
    await validarMensajedeError('//android.view.View[@content-desc="Quedan 0 caracteres"]',err.numCliente,'Longitud de Caracter');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_057 contraseña mensaje ingresar contraseña', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '';
  expec.contraseña1 = '';
  err.contraseña1 = 'Ingrese su contraseña';
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
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su contraseña"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_058 contraseña menor a 8 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = 'clave12';
  expec.contraseña1 = 'clave12';
  err.contraseña1 = 'su contraseña debe ser almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser almenos 8 caracteres"]',err.contraseña1,'Min 8 caracteres');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_059 contraseña menor a 8 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = 'asdf123';
  expec.contraseña1 = 'asdf123';
  err.contraseña1 = 'Su contraseña debe ser de almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser de almenos 8 caracteres"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_060 contrasena mensaje campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '';
  expec.contraseña1 = '';
  err.contraseña1 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_061 contrasena al menos 8 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '1234567';
  expec.contraseña1 = '1234567';
  err.contraseña1 = 'Su contraseña debe ser de almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser de almenos 8 caracteres"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_062 contrasena campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = ' ';
  expec.contraseña1 = ' ';
  err.contraseña1 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_063 contrasena al menos 8 caracteres', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = ' ';
  expec.contraseña1 = ' ';
  err.contraseña1 = 'Su contraseña debe ser de almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser de almenos 8 caracteres"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_064 confirmar contraseña caracteres especiales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = 'Cl@ve.123';
  expec.contraseña1 = 'Cl@ve.123';
  tes.contraseña2 = 'Cl@ve.123';
  expec.contraseña2 = 'Cl@ve.123';
  err.contraseña2 = 'Verificar mi cuenta';
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
    await validarMensajedeError('///android.widget.Button[@content-desc="Verificar mi cuenta"]',err.contraseña1,'Contrasena');
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
  tes.contraseña2 = '';
  expec.contraseña2 = '';
  err.contraseña2 = '';
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
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su contraseña"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_066 confirmar contrasena campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '';
  expec.contraseña1 = '';
  err.contraseña1 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="Ingrese su contraseña"]',err.contraseña1,'Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_067 confirmar contrasena vacia', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '';
  expec.contraseña1 = '';
  err.contraseña1 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.contraseña1,'Confirmar Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_068 contrasena menor de 8 digitos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña2 = '1234567';
  expec.contraseña2 = '1234567';
  err.contraseña2 = 'Su contraseña debe ser de almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser de almenos 8 caracteres"]',err.contraseña1,'Confirmar Contrasena');
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
  tes.contraseña2 = ' ';
  expec.contraseña2 = ' ';
  err.contraseña2 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.contraseña2,'Campos requeridos');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_070 cambiar contrasena espacio blanco', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña2 = ' ';
  expec.contraseña2 = ' ';
  err.contraseña2 = 'Su contraseña debe ser de almenos 8 caracteres';
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
    await validarMensajedeError('//android.view.View[@content-desc="Su contraseña debe ser de almenos 8 caracteres"]',err.contraseña2,'Confirmar Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_071 No coinciden contraseñas', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña2 = 'Papas123';
  expec.contraseña2 = 'Papas123';
  err.contraseña2 = 'No coinciden contraseñas';
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
    await validarMensajedeError('//android.view.View[@content-desc="Valida que los campos requeridos cumplan con la información solicitada"]',err.contraseña2,'Confirmar Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_072 confirmar contraseña campos requeridos', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña2 = 'Pass1234';
  expec.contraseña2 = 'Pass1234';
  err.contraseña2 = 'Valida que los campos requeridos cumplan con la información solicitada';
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
    await validarMensajedeError('//android.view.View[@content-desc="No coinciden contraseñas"]',err.contraseña2,'Confirmar Contrasena');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_073 no aceptar los terminos y condiciones', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta = 'Es necesario aceptar los terminos y condiciones';
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
    const termsCheckbox2 = await driver.$('android=new UiSelector().descriptionContains("políticas de privacidad.")');
    await termsCheckbox2.click();
    const isChecked2 = await termsCheckbox2.getAttribute("checked");
    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
    await validarMensajedeError('//android.widget.Button[@content-desc="Es necesario aceptar los terminos y condiciones"]',err.codigoAlta,'Aceptar los terminos y condiciones');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_074 no aceptar politicas', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta = 'Es necesario aceptar los terminos y condiciones';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
    await validarMensajedeError('//android.widget.Button[@content-desc="Es necesario aceptar los terminos y condiciones"]',err.codigoAlta,'Aceptar los terminos y condiciones');
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
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = 'Verificar cuenta';
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
    await llegaralPrincipio();
    await llegaralFinal();
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_076 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='Verificar cuenta';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="Verificar cuenta"]',err.codigoAlta,'Verificar cuenta');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_077 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='Hemos enviado un código de verificación  a tu whats app';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_078 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='Hemos enviadoun código de verificación  a tu whats app';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="Hemos enviadoun código de verificación  a tu whats app"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_079 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_080 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_081 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_082 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_083 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_084 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_085 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_086 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_087 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_088 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_089 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_090 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_091 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_092 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

  it('TC_A_093 alta cliente invitado', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  err.codigoAlta='¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios';
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
    await darClicyFoto('//android.widget.Button[@content-desc="Solicitar código por SMS"]', 'Solicitar SMS');
    await darClicyFoto('//android.widget.Button[@content-desc="Verificar mi cuenta"]', 'Verificar');
    await validarMensajedeError('//android.view.View[@content-desc="¡Bienvenido a Exprezo!, ya puedes iniciar sesión y empezar a disfrutar de nuestros servicios"]',err.codigoAlta,'Bienvenido');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });

it('TC_A_094 boton contactar soporte', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.codigoAlta = '¡Hola! Me gustaria recibir ayuda.';
  expec.codigoAlta = '¡Hola! Me gustaria recibir ayuda.';
  err.codigoAlta = '¡Hola! Me gustaria recibir ayuda.';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.View// /android.view.View/android.view.View/android.view.View/android.widget.ImageView', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.widget.EditText[@resource-id="com.whatsapp:id/entry"]',tes.codigoAlta,'Whatsapp',err.codigoAlta)
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_095 validar lista de sucursales', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Lista Sucursales');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_096 pantalla de registro 30 dias', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.codigoAlta = '//android.view.View[@content-desc="Inicia tu prueba GRATIS de';
  expec.codigoAlta = '//android.view.View[@content-desc="Inicia tu prueba GRATIS de';
  err.codigoAlta = '';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Regístrate Aquí"]', 'Botón Regístrate Aquí');
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia tu prueba GRATIS de nuestra membresía por 30 DÍAS"]',tes.codigoAlta,'Membresia 30 dias',err.codigoAlta);
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_097 cuenta de correo inexistente', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'pepe@gmail.com';
  expec.correo = 'pepe@gmail.com';
  err.correo = 'Usuario no registrado';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Usuario no registrado');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_098 contrasena incorrecta', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = '0987654321';
  expec.contraseña1 = '0987654321';
  err.contraseña1 = 'Usuario o contraseña incorrecta.';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Usuario o contraseña incorrecta.');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_099 url recuperar contrasena', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = '';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Usuario no registrado');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_100 recuperar clave vacia', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = '';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Usuario no registrado');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_101 formato de correo invalido', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = '';
  expec.nombre = '';
  err.nombre = '';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[1]', tes.correo, 'correo', expec.correo);
    await fijarvariableconPasos('//android.view.View[@content-desc="Inicia sesión ¿No tienes una cuenta? "]/android.widget.EditText[2]', tes.contraseña1, 'contraseña', expec.contraseña1);
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]', 'Usuario no registrado');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_102 recuperar cuenta existente', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.nombre = 'saulsolisg@outlook.com';
  expec.nombre = 'saulsolisg@outlook.com';
  err.nombre = 'Se ha enviado un correo';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Recuperar contraseña"]', 'Botón Recuperar cuenta');
    await darClicyFoto('//android.widget.Button[@content-desc="Enviar"]', 'Enviar');
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_103 correo inexistente', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.contraseña1 = 'ing.saulsolisg@gmail.com';
  expec.contraseña1 = 'ing.saulsolisg@gmail.com';
  err.contraseña1 = 'Por favor verifica el corro ingresado';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await fijarvariableconPasos('//android.widget.Button[@content-desc="Entrar"]"]', tes.contraseña1,'', expec.correo);
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
});

it('TC_A_104 doble clic en enviar', async () => {
  const tes = { ...testData };
  const expec = { ...expectedData };
  const err = { ...errorData };
  tes.correo = 'ing.saulsolisg@gmail.com';
  expec.correo = 'ing.saulsolisg@gmail.com';
  err.correo = 'Ya has envíado una solicitud para restaurar tu contraseña, por favor tus mensajes o correo electrónico ; o espera 30 minutos para volver a enviar la solicitud';
  try {
    await darClicyFoto('//android.widget.TextView[@content-desc=" Exprezo"]', 'App Exprezzo'); //abre la app
    await darClicyFoto('//android.widget.Button[@content-desc="Entrar"]"]', 'Botón Enviar 1');
    await fijarvariableconPasos('//android.widget.Button[@content-desc="Entrar"]', tes.correo,'Botón Enviar 2',expec.correo);  
  } catch (error) {
    const errorShot = await browser.takeScreenshot();
    allure.addAttachment('Error screenshot', Buffer.from(errorShot, 'base64'), 'image/png');
    throw error;
  }
  });
  
});