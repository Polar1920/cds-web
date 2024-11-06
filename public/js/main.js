let currentSectionIndex = 1;
let totalSections = 0;
let modules = 4;

const container = document.getElementById('sections-container');
const splashScreen = document.getElementById('splash-screen');

// Cargar todos los módulos y secciones al inicio
loadModules();

function loadModules() {
    let sectionID = 1;
    const modulePromises = [];

    for (let m = 1; m <= modules; m++) {
        const modulePath = `app`;

        modulePromises.push(
            fetch(`${modulePath}/modulo${m}.html`)
                .then(response => {
                    if (!response.ok) throw new Error('No se encontró el módulo');
                    return response.text();
                })
                .then(data => {
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = data.trim();
                    const sections = tempContainer.querySelectorAll('.section');
                    sections.forEach(section => {
                        section.id = `s${sectionID++}`;
                        container.appendChild(section);
                    });
                    totalSections += sections.length;
                })
        );
    }

    Promise.all(modulePromises)
        .then(() => {
            //initializeInteractiveElements();
            showCurrentSection();
            // Ocultar el splash screen y mostrar el contenido
            splashScreen.style.display = 'none';
            container.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching module:', error);
            splashScreen.innerText = 'Error al cargar el contenido';
        });

    fetch('app/scripts.html')
        .then(response => {
            if (!response.ok) throw new Error('No se encontraron los scripts');
            return response.text();
        })
        .then(data => {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = data.trim();

            // Buscar el script dentro del contenido
            const scriptContent = tempContainer.querySelector('script');

            if (scriptContent) {
                // Crear un nuevo script
                const newScript = document.createElement('script');
                newScript.type = 'text/javascript';
                newScript.innerHTML = scriptContent.innerHTML;  // Agregar el contenido del script a este nuevo elemento

                // Agregar el script al body o donde sea necesario
                document.body.appendChild(newScript);
            }

            // Llamar a cualquier inicialización de interactividad después de cargar los scripts
            //initializeInteractiveElements();
        })
        .catch(error => {
            console.error('Error al cargar los scripts:', error);
        });

}

function navigate(direction) {
    currentSectionIndex += direction;

    if (currentSectionIndex < 1) currentSectionIndex = totalSections;
    if (currentSectionIndex > totalSections) currentSectionIndex = 1;

    showCurrentSection();
}

function showCurrentSection() {
    document.querySelectorAll('.section').forEach((section, index) => {
        section.classList.remove('active');
        if (index + 1 === currentSectionIndex) {
            section.classList.add('active');
        }
    });
}
