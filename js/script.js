// Año actual para el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Variables globales
let firmaGenerada = false;

// Elementos del DOM
const form = document.getElementById('signature-form');
const nombreInput = document.getElementById('nombre');
const cargoInput = document.getElementById('cargo');
const correoInput = document.getElementById('correo');
const extensionInput = document.getElementById('extension');
const previewContainer = document.getElementById('signature-preview');
const btnDescargarPng = document.getElementById('btn-descargar-png');
const btnDescargarJpg = document.getElementById('btn-descargar-jpg');
const btnDescargarHtml = document.getElementById('btn-descargar-html');

// Event Listeners
form.addEventListener('submit', generarFirma);
btnDescargarPng.addEventListener('click', () => descargarImagen('png'));
btnDescargarJpg.addEventListener('click', () => descargarImagen('jpg'));
btnDescargarHtml.addEventListener('click', descargarFirmaHtml);

// Función para generar la firma
function generarFirma(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = nombreInput.value.trim();
    const cargo = cargoInput.value.trim();
    const correo = correoInput.value.trim();
    const extension = extensionInput.value.trim();
    
    // Validar que todos los campos estén llenos
    if (!nombre || !cargo || !correo || !extension) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Generar HTML de la firma
    const firmaHTML = `
        <div class="firma-logo-container">
            <img src="img/logo-main-white-r.png" alt="Logo Hotel Margarita Real" class="firma-logo">
        </div>
        <div class="firma-contenido">
            <div class="firma-nombre">${nombre} | <span class="firma-cargo">${cargo}</span></div>
            <div class="firma-email">${correo}</div>
            <div class="firma-telefono">TELEF: +58 0295-5001300 | Ext: ${extension}</div>
            <div class="firma-web"><a href="https://www.hotelmargaritareal.com">www.hotelmargaritareal.com</a></div>
            <div class="firma-direccion">Av. Aldonza Manrique, Final Calle Camarón, Hotel Margarita Real.Ofic. Admin. 
Pampatar, Edo. Nueva Esparta. Venezuela 6316</div>
        </div>
    `;
    
    // Actualizar vista previa
    previewContainer.innerHTML = firmaHTML;
    
    // Habilitar botones
    btnDescargarPng.disabled = false;
    btnDescargarJpg.disabled = false;
    btnDescargarHtml.disabled = false;
    
    // Marcar que ya se generó una firma
    firmaGenerada = true;
    
    // Scroll hacia la vista previa
    document.querySelector('.preview-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Función para descargar la firma como imagen
function descargarImagen(formato) {
    if (!firmaGenerada) return;
    
    // Mostrar indicador de carga
    const textoOriginal = formato === 'png' 
        ? btnDescargarPng.innerHTML 
        : btnDescargarJpg.innerHTML;
        
    if (formato === 'png') {
        btnDescargarPng.innerHTML = '<span class="spinner"></span> Generando PNG...';
        btnDescargarPng.disabled = true;
    } else {
        btnDescargarJpg.innerHTML = '<span class="spinner"></span> Generando JPG...';
        btnDescargarJpg.disabled = true;
    }
    
    // Crear un clon del elemento para exportación
    const clone = previewContainer.cloneNode(true);
    clone.classList.add('signature-export');
    
    // Eliminar cualquier borde o efecto visual del clon
    clone.style.border = 'none';
    clone.style.boxShadow = 'none';
    clone.style.outline = 'none';
    
    // Ajustar el contenido para que se vea bien en el nuevo tamaño
    const contenido = clone.querySelector('.firma-contenido');
    if (contenido) {
        contenido.style.padding = '10px';
        contenido.style.fontSize = '10px';
    }
    
    // Ajustar el contenedor del logo
    const logoContainer = clone.querySelector('.firma-logo-container');
    if (logoContainer) {
        logoContainer.style.width = '200px';
        logoContainer.style.height = '100%';
    }
    
    // Añadir el clon a un contenedor de exportación
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-container';
    exportContainer.appendChild(clone);
    document.body.appendChild(exportContainer);
    
    // Usar html2canvas para convertir a imagen con tamaño fijo
    html2canvas(clone, {
        width: 567,
        height: 128,
        scale: 1,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        onclone: function(clonedDoc, element) {
            // Asegurarse de que todos los estilos se apliquen correctamente
            const clonedElement = clonedDoc.querySelector('.signature-export');
            clonedElement.style.width = '567px';
            clonedElement.style.height = '128px';
        }
    }).then(canvas => {
        // Limpiar el contenedor de exportación
        document.body.removeChild(exportContainer);
        
        // Convertir canvas a blob
        canvas.toBlob(blob => {
            // Crear enlace de descarga
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const nombre = nombreInput.value.trim().replace(/\s+/g, '_');
            
            a.href = url;
            a.download = `firma_${nombre}.${formato}`;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Restaurar botón
                if (formato === 'png') {
                    btnDescargarPng.innerHTML = textoOriginal;
                    btnDescargarPng.disabled = false;
                } else {
                    btnDescargarJpg.innerHTML = textoOriginal;
                    btnDescargarJpg.disabled = false;
                }
            }, 100);
        }, `image/${formato}`, 1.0);
    }).catch(error => {
        console.error('Error al generar la imagen:', error);
        alert('Error al generar la imagen. Por favor, intente nuevamente.');
        
        // Asegurarse de limpiar el contenedor de exportación en caso de error
        if (document.body.contains(exportContainer)) {
            document.body.removeChild(exportContainer);
        }
        
        // Restaurar botón en caso de error
        if (formato === 'png') {
            btnDescargarPng.innerHTML = textoOriginal;
            btnDescargarPng.disabled = false;
        } else {
            btnDescargarJpg.innerHTML = textoOriginal;
            btnDescargarJpg.disabled = false;
        }
    });
}

// Función para descargar la firma como HTML
/* function descargarFirmaHtml() {
    if (!firmaGenerada) return;
    
    // Mostrar indicador de carga
    const textoOriginal = btnDescargarHtml.innerHTML;
    btnDescargarHtml.innerHTML = '<span class="spinner"></span> Generando HTML...';
    btnDescargarHtml.disabled = true;
    
    const nombre = nombreInput.value.trim().replace(/\s+/g, '_');
    
    // Convertir la imagen a Base64
    convertImageToBase64('img/logo-main-white-r.png')
        .then(base64Image => {
            const firmaHTML = previewContainer.innerHTML;
            
            // Reemplazar la src de la imagen con el Base64
            const firmaConBase64 = firmaHTML.replace(
                'img/logo-main-white-r.png', 
                base64Image
            );
            
            // Crear contenido del archivo
            const contenido = crearContenidoHTML(firmaConBase64);
            
            // Crear blob y enlace de descarga
            const blob = new Blob([contenido], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `firma_${nombre}.html`;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                btnDescargarHtml.innerHTML = textoOriginal;
                btnDescargarHtml.disabled = false;
            }, 100);
        })
        .catch(error => {
            console.error('Error al convertir la imagen:', error);
            alert('Error al generar el HTML. Por favor, intente nuevamente.');
            btnDescargarHtml.innerHTML = textoOriginal;
            btnDescargarHtml.disabled = false;
        });
}

// Función para convertir imagen a Base64
function convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (e) {
                reject(e);
            }
        };
        
        img.onerror = function() {
            reject(new Error('Error al cargar la imagen'));
        };
    });
}

// Función para crear el contenido HTML
function crearContenidoHTML(firmaHTML) {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
        }
        .firma-container {
            display: flex;
            width: 567px;
            height: 128px;
            font-family: Arial, sans-serif;
            border: 1px dashed #ccc;
        }
        .firma-logo-container {
            width: 200px;
            height: 128px;
            background-color: #008e96;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .firma-logo {
            max-width: 95%;
            max-height: 90%;
        }
        .firma-contenido {
            padding: 10px 15px;
            line-height: 1.4;
            flex: 1;
        }
        .firma-nombre {
            font-weight: bold;
            font-size: 14px;
            color: #008e96;
            text-transform: uppercase;
            margin-bottom: 3px;
        }
        .firma-cargo {
            font-size: 12px;
            color: #777777;
            text-transform: uppercase;
        }
        .firma-email {
            color: #00b5ba;
            font-weight: bold;
            margin-bottom: 3px;
            font-size: 12px;
        }
        .firma-telefono {
            font-size: 11px;
            color: #333;
            margin-bottom: 3px;
        }
        .firma-web {
            font-size: 11px;
            color: #00b5ba;
            font-weight: bold;
            margin-bottom: 3px;
        }
        .firma-web a {
            color: #00b5ba;
            text-decoration: none;
            font-weight: bold;
        }
        .firma-direccion {
            font-size: 11px;
            color: #333;
            line-height: 1.3;
        }
    </style>
</head>
<body>
    <div class="firma-container">
        ${firmaHTML}
    </div>
</body>
</html>`;
} */

// Función para descargar firma HTML con enlaces funcionales
function descargarFirmaHtml() {
    if (!firmaGenerada) return;
    
    const nombre = nombreInput.value.trim();
    const cargo = cargoInput.value.trim();
    const correo = correoInput.value.trim();
    const extension = extensionInput.value.trim();
    
    // Usar tabla para mejor compatibilidad con clientes de email
    const contenido = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Firma Corporativa</title>
</head>
<body style="margin: 0; padding: 0;">
    <!--[if mso]>
    <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" width="567" style="border-collapse: collapse;">
        <tr>
            <td width="200" bgcolor="#008e96" style="padding: 0; text-align: center; vertical-align: middle;">
                <!--[if mso]>
                <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:200px;height:128px;">
                <v:fill type="tile" color="#008e96" />
                <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
                <![endif]-->
                <div style="display: inline-block; max-width: 95%; max-height: 90%;">
                    <img src="https://ejemplo.com/logo.png" alt="Hotel Margarita Real" width="160" style="display: block; border: 0; max-width: 100%; height: auto;">
                </div>
                <!--[if mso]>
                </v:textbox>
                </v:rect>
                <![endif]-->
            </td>
            <td width="367" style="padding: 10px 15px; vertical-align: top; font-family: Arial, sans-serif;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="padding-bottom: 4px;">
                            <span style="font-size: 14px; font-weight: bold; color: #008e96; text-transform: uppercase;">${nombre.toUpperCase()}</span>
                            <span style="font-size: 12px; color: #777777; text-transform: uppercase;"> | ${cargo.toUpperCase()}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 4px;">
                            <a href="mailto:${correo}" style="font-size: 12px; color: #00b5ba; font-weight: bold; text-decoration: none;">${correo}</a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 4px;">
                            <span style="font-size: 11px; color: #333;">TELEF: +58 0295-5001300 | Ext: ${extension}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 4px;">
                            <a href="https://www.hotelmargaritareal.com" style="font-size: 11px; color: #00b5ba; font-weight: bold; text-decoration: none;">www.hotelmargaritareal.com</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span style="font-size: 11px; color: #333; line-height: 1.3;">Av. Aldonza Manrique, Final Calle Camarón, Hotel Margarita Real. Ofic. Admin. Pampatar, Edo. Nueva Esparta. Venezuela 6316</span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

    // Crear blob y enlace de descarga
    const blob = new Blob([contenido], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `firma_${nombre.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}