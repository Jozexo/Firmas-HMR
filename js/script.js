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
// Función para generar la firma (con spinner)
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
    
    // Mostrar spinner y deshabilitar botón
    const btnGenerar = e.target.querySelector('button[type="submit"]');
    const textoOriginal = btnGenerar.innerHTML;
    btnGenerar.innerHTML = '<span class="spinner"></span> Generando...';
    btnGenerar.disabled = true;
    
    // Función para simular proceso asíncrono
    const generarFirmaAsync = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const firmaHTML = `
                    <div class="firma-logo-container">
                        <img src="img/logo-main-white-r.png" alt="Logo Hotel Margarita Real" class="firma-logo">
                    </div>
                    <div class="firma-contenido">
                        <div class="firma-nombre">${nombre} <span class="barra-nombrecargo">|</span> <span class="firma-cargo">${cargo}</span></div>
                        <div class="firma-email">${correo}</div>
                        <div class="firma-telefono">TELEF: +58 0295-5001300 | Ext: ${extension}</div>
                        <div class="firma-web"><a href="https://www.hotelmargaritareal.com">www.hotelmargaritareal.com</a></div>
                        <div class="firma-direccion">Av. Aldonza Manrique, Final Calle Camarón, Hotel Margarita Real.Ofic. Admin. 
                Pampatar, Edo. Nueva Esparta. Venezuela 6316</div>
                    </div>
                `;
                resolve(firmaHTML);
            }, 800);
        });
    };
    
    // Ejecutar la generación
    generarFirmaAsync()
        .then(firmaHTML => {
            // Actualizar vista previa
            previewContainer.innerHTML = firmaHTML;
            
            // Habilitar botones de descarga
            btnDescargarPng.disabled = false;
            btnDescargarJpg.disabled = false;
            btnDescargarHtml.disabled = false;
            
            // Marcar que ya se generó una firma
            firmaGenerada = true;
            
            // Restaurar botón original
            btnGenerar.innerHTML = textoOriginal;
            btnGenerar.disabled = false;
            
            // Scroll hacia la vista previa
            document.querySelector('.preview-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        })
        .catch(error => {
            console.error('Error al generar la firma:', error);
            btnGenerar.innerHTML = textoOriginal;
            btnGenerar.disabled = false;
            alert('Error al generar la firma. Por favor, intente nuevamente.');
        });
}

// Función para descargar la firma como imagen (con spinner)
function descargarImagen(formato) {
    if (!firmaGenerada) return;
    
    // Mostrar indicador de carga
    const boton = formato === 'png' ? btnDescargarPng : btnDescargarJpg;
    const textoOriginal = boton.innerHTML;
    boton.innerHTML = '<span class="spinner"></span> Generando...';
    boton.disabled = true;
    
    // Función asíncrona para generar imagen
    const generarImagenAsync = () => {
        return new Promise((resolve, reject) => {
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
                    const clonedElement = clonedDoc.querySelector('.signature-export');
                    clonedElement.style.width = '567px';
                    clonedElement.style.height = '128px';
                }
            })
            .then(canvas => {
                document.body.removeChild(exportContainer);
                resolve(canvas);
            })
            .catch(error => {
                document.body.removeChild(exportContainer);
                reject(error);
            });
        });
    };
    
    // Ejecutar generación de imagen
    generarImagenAsync()
        .then(canvas => {
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
                
                // Limpiar y restaurar botón
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    boton.innerHTML = textoOriginal;
                    boton.disabled = false;
                }, 100);
            }, `image/${formato}`, 1.0);
        })
        .catch(error => {
            console.error('Error al generar la imagen:', error);
            boton.innerHTML = textoOriginal;
            boton.disabled = false;
            alert('Error al generar la imagen. Por favor, intente nuevamente.');
        });
}

// Función para descargar la firma como HTML (con spinner)
function descargarFirmaHtml() {
    if (!firmaGenerada) return;
    
    // Mostrar indicador de carga
    const textoOriginal = btnDescargarHtml.innerHTML;
    btnDescargarHtml.innerHTML = '<span class="spinner"></span> Generando...';
    btnDescargarHtml.disabled = true;
    
    const nombre = nombreInput.value.trim().replace(/\s+/g, '_');
    
    // Función asíncrona para generar HTML
    const generarHtmlAsync = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const firmaHTML = previewContainer.innerHTML;
                
                // Crear contenido del archivo
                const contenido = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Tus estilos CSS aquí */
    </style>
</head>
<body>
    <div style="width: 567px; height: 128px;">
        ${firmaHTML}
    </div>
</body>
</html>`;
                resolve(contenido);
            }, 500);
        });
    };
    
    // Ejecutar generación de HTML
    generarHtmlAsync()
        .then(contenido => {
            // Crear blob y enlace de descarga
            const blob = new Blob([contenido], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            
            a.href = url;
            a.download = `firma_${nombre}.html`;
            document.body.appendChild(a);
            a.click();
            
            // Limpiar y restaurar botón
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                btnDescargarHtml.innerHTML = textoOriginal;
                btnDescargarHtml.disabled = false;
            }, 100);
        })
        .catch(error => {
            console.error('Error al generar el HTML:', error);
            btnDescargarHtml.innerHTML = textoOriginal;
            btnDescargarHtml.disabled = false;
            alert('Error al generar el HTML. Por favor, intente nuevamente.');
        });
}