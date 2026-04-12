// === DOCUMENTACIÓN TÉCNICA — Sidebar navigation + Column toggles ===
(function () {
  'use strict';

  // === SIDEBAR NAVIGATION ===
  const sidebarItems = document.querySelectorAll('.sidebar-item:not([disabled])');
  const panels = document.querySelectorAll('.dt-panel');

  if (!sidebarItems.length) return;

  function switchDoc(docId) {
    panels.forEach(function (p) { p.classList.add('dt-panel--hidden'); });
    const target = document.getElementById('doc-' + docId);
    if (target) target.classList.remove('dt-panel--hidden');

    sidebarItems.forEach(function (s) { s.classList.remove('sidebar-item--active'); });
    const btn = document.querySelector('.sidebar-item[data-doc="' + docId + '"]');
    if (btn) btn.classList.add('sidebar-item--active');
  }

  sidebarItems.forEach(function (item) {
    item.addEventListener('click', function () {
      switchDoc(item.dataset.doc);
    });
  });

  // === M365 COLUMN TOGGLES ===
  const M365_PLANS = [
    { key: 'F1', label: 'F1', color: '#38bdf8' },
    { key: 'F3', label: 'F3', color: '#34d399' },
    { key: 'BB', label: 'Business Basic', color: '#94a3b8' },
    { key: 'BS', label: 'Business Standard', color: '#60a5fa' },
    { key: 'BP', label: 'Business Premium', color: '#c084fc' },
    { key: 'E3', label: 'E3', color: '#fb923c' },
    { key: 'E5', label: 'E5', color: '#f472b6' }
  ];

  const toggleContainer = document.getElementById('m365tToggles');
  const m365Panel = document.getElementById('doc-m365-guide');

  if (toggleContainer && m365Panel) {
    M365_PLANS.forEach(function (plan) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tbl-col-toggle tbl-col-toggle--active';
      btn.dataset.plan = plan.key;
      btn.innerHTML = '<span class="tbl-col-toggle__dot" style="background:' + plan.color + '"></span>' + plan.label;

      btn.addEventListener('click', function () {
        var isActive = this.classList.toggle('tbl-col-toggle--active');
        if (isActive) {
          m365Panel.classList.remove('m365t-hide-' + plan.key);
        } else {
          m365Panel.classList.add('m365t-hide-' + plan.key);
        }
        updateSubheaderColspans();
      });

      toggleContainer.appendChild(btn);
    });

    function updateSubheaderColspans() {
      var visibleCount = 1 + toggleContainer.querySelectorAll('.tbl-col-toggle--active').length;
      m365Panel.querySelectorAll('.m365t-subheader td[colspan]').forEach(function (td) {
        td.setAttribute('colspan', visibleCount);
      });
    }
  }

  // === FEATURE DESCRIPTIONS (info accordion) ===
  var FEATURE_DESC = {
    // — Aplicaciones y Límites —
    'Office web (Word, Excel, PowerPoint, OneNote)': 'Versiones de navegador de las apps de Office. Permiten crear y editar documentos sin instalar software. Útil para empresas con trabajadores frontline o BYOD que necesitan acceso básico a documentos desde cualquier navegador sin gestionar instalaciones.',
    'Office desktop (Word, Excel, PowerPoint, Outlook)': 'Aplicaciones de escritorio completas con funcionalidad offline y características avanzadas. Esencial para empleados de oficina que trabajan con documentos complejos, macros de Excel, complementos de Outlook o necesitan productividad sin conexión a Internet.',
    'Access y Publisher (solo PC)': 'Access: base de datos relacional de escritorio. Publisher: diseño de publicaciones. Una empresa las usaría para crear bases de datos departamentales rápidas (inventarios, seguimiento) o material de marketing impreso sin herramientas de diseño externas.',
    'Instalaciones por usuario': 'Cantidad de dispositivos donde cada usuario puede instalar las apps de Office desktop. Importante para empresas cuyos empleados usan múltiples dispositivos (PC de oficina, laptop, tablet) y necesitan Office en todos.',
    'Exchange Online': 'Servicio de correo y calendario en la nube. Kiosk: buzón de 2 GB sin Outlook desktop. Plan 1: 50 GB. Plan 2: 100 GB + archivo ilimitado. Es el correo corporativo estándar; una empresa lo usa para email profesional con dominio propio, calendarios compartidos y salas de reuniones.',
    'Microsoft Teams': 'Plataforma de comunicación y colaboración: chat, videollamadas, canales y apps integradas. Una empresa la implementa como hub central de trabajo para reemplazar múltiples herramientas (Slack, Zoom, etc.) y centralizar la comunicación de equipos.',
    'SharePoint Online': 'Plataforma de sitios, intranets y gestión documental en la nube. Las empresas la usan para crear intranets corporativas, portales departamentales, bibliotecas de documentos con versionado y flujos de aprobación.',
    'OneDrive for Business': 'Almacenamiento personal en la nube con sincronización automática y acceso desde cualquier dispositivo. Las empresas lo usan para que cada empleado tenga su espacio de archivos con backup automático, compartición controlada y acceso offline — reemplaza los file servers personales y las unidades USB.',
    'Microsoft Stream': 'Plataforma de video corporativo integrada en SharePoint y Teams para grabar, compartir y gestionar videos internos. Las empresas lo usan para almacenar grabaciones de reuniones, crear videos de capacitación, onboarding de nuevos empleados y comunicaciones ejecutivas — con transcripción automática y búsqueda por contenido hablado.',
    'Power BI Pro': 'Herramienta de Business Intelligence para crear dashboards interactivos, reportes y análisis de datos. Solo incluida en E5 — en otros planes requiere licencia standalone. Las empresas lo usan para visualizar KPIs, crear reportes financieros, analizar ventas y compartir insights de datos entre equipos con gobernanza centralizada.',
    'Microsoft Planner': 'Herramienta de gestión de tareas y proyectos integrada en Teams con tableros Kanban, listas y diagramas. Las empresas lo usan para coordinar trabajo en equipo: asignar tareas, establecer fechas límite, seguir progreso de proyectos y organizar sprints — sin necesidad de herramientas externas como Trello o Asana.',
    'Microsoft Forms': 'Creador de formularios, encuestas y cuestionarios con análisis de respuestas en tiempo real. Las empresas lo usan para encuestas de satisfacción del cliente, evaluaciones internas, registros de eventos, quizzes de capacitación y recopilación de datos que alimentan flujos de Power Automate.',
    'Microsoft Lists': 'Aplicación de listas estructuradas basada en SharePoint para rastrear información con vistas personalizadas, reglas y alertas. Las empresas lo usan para gestionar inventarios, seguimiento de incidentes, onboarding de empleados, solicitudes de compra — como una base de datos ligera sin necesidad de Access o Dataverse.',
    'Microsoft Loop': 'Herramienta de colaboración en tiempo real con componentes portátiles que se sincronizan entre Teams, Outlook, Word y OneNote. Las empresas lo usan para co-crear contenido que se mantiene actualizado en todas las apps — como tablas de estado de proyecto, listas de tareas o notas de reunión compartidas que viven en múltiples contextos.',
    'Microsoft Bookings': 'Sistema de agendamiento de citas online con página de reservas personalizable. Las empresas lo usan para que clientes o empleados agenden reuniones, consultas o servicios directamente — con confirmaciones automáticas, recordatorios por email y sincronización con calendarios de Outlook.',
    'Sway': 'Herramienta para crear presentaciones web interactivas, newsletters y reportes visuales sin necesidad de diseño gráfico. Las empresas lo usan para comunicaciones internas atractivas, informes de proyecto, portfolios y material de onboarding que se visualiza como una página web responsive.',
    'Clipchamp': 'Editor de video integrado en M365 con plantillas, texto, transiciones y grabación de pantalla. Las empresas lo usan para crear videos de capacitación, demos de producto, comunicaciones internas y contenido para redes sociales — sin necesidad de software de edición profesional.',
    'Viva Insights': 'Analítica de productividad y bienestar laboral. Personal: cada usuario ve sus propios hábitos (tiempo en reuniones, focus time). Premium (E5): los líderes ven tendencias organizacionales. Las empresas lo usan para identificar burnout, optimizar reuniones y mejorar el balance trabajo-vida a nivel organizacional.',
    'Microsoft Copilot': 'Asistente de IA generativa integrado en Word, Excel, PowerPoint, Outlook, Teams y más. Requiere licencia add-on en todos los planes. Las empresas lo implementan para acelerar la creación de documentos, resumir reuniones, analizar datos en Excel, redactar correos y automatizar tareas repetitivas con IA.',
    'Máximo de usuarios': 'Límite de licencias que se pueden adquirir en el tenant. Business: 300 máx. Enterprise/Frontline: ilimitado. Determina si la empresa puede escalar con esa licencia o necesita migrar a Enterprise al crecer.',
    'Windows Enterprise': 'Licencia de upgrade a Windows Enterprise con políticas avanzadas de seguridad y gestión. Una empresa la necesita para Credential Guard, AppLocker, DirectAccess y gestión avanzada con GPOs de Enterprise.',
    'Enterprise Mobility + Security': 'Suite que incluye Entra ID P1/P2, Intune, AIP y Defender for Cloud Apps. Las empresas la usan como base de seguridad y gestión de dispositivos; es el paquete que habilita la mayoría de features de identidad y endpoints.',
    'Cloud flows + conectores estándar': 'Automatización de flujos de trabajo con Power Automate usando conectores de M365. Las empresas lo usan para automatizar aprobaciones, notificaciones, sincronización de datos entre SharePoint, Outlook, Teams y Forms sin código.',
    'Canvas apps con datos M365': 'Creación de apps personalizadas con Power Apps usando datos de SharePoint, Excel y otros servicios M365. Permite a las empresas construir apps internas (formularios de solicitud, inventarios, check-ins) sin desarrolladores.',
    'Conectores premium / Dataverse / RPA': 'Conectores a sistemas externos (SAP, Salesforce), base de datos Dataverse y automatización robótica de procesos. Necesarios cuando la empresa quiere integrar M365 con su ERP, CRM u otros sistemas externos, o automatizar tareas repetitivas en apps legacy.',
    'Participantes por reunión Teams': 'Número máximo de participantes simultáneos en una reunión de Teams. Importante para empresas grandes que realizan all-hands, capacitaciones masivas o reuniones con clientes de múltiples sedes.',
    'Webinars': 'Eventos virtuales con registro, seguimiento de asistencia y herramientas de engagement. Las empresas los usan para capacitaciones externas, lanzamientos de producto, eventos de marketing o sesiones de onboarding a gran escala.',
    'Town Halls': 'Eventos a gran escala (hasta 10.000 asistentes) con producción profesional y Q&A moderado. Ideales para comunicaciones de CEO, town halls corporativos trimestrales o anuncios estratégicos a toda la organización.',
    'Teams Phone (PSTN)': 'Sistema telefónico en la nube que reemplaza la PBX tradicional. Las empresas lo implementan para eliminar la telefonía legacy, unificar comunicaciones en Teams y reducir costos de infraestructura telefónica.',

    // — Entra ID —
    'Entra ID incluido': 'Nivel de Entra ID incluido con la licencia. Free: SSO y MFA básico. P1: Conditional Access y grupos dinámicos. P2: Identity Protection y PIM. Define qué capacidades de identidad y seguridad tiene la empresa sin comprar licencias adicionales.',
    'MFA (Multi-Factor Authentication)': 'Verificación de identidad en dos pasos. Security Defaults: MFA básico forzado. P1+: MFA con Conditional Access granular. Toda empresa debería activarlo como primera línea de defensa contra robo de credenciales y ataques de phishing.',
    'Conditional Access': 'Políticas que controlan el acceso según condiciones como ubicación, dispositivo, riesgo o app destino. Las empresas lo usan para bloquear acceso desde países no autorizados, exigir dispositivos gestionados para apps sensibles o forzar MFA fuera de la red corporativa.',
    'Self-Service Password Reset': 'Permite a los usuarios restablecer su contraseña sin intervención del helpdesk. Cloud only: sin writeback a AD on-prem. Reduce significativamente las llamadas al helpdesk (entre 20-40% del volumen típico) y mejora la productividad.',
    'Dynamic Groups': 'Grupos cuya membresía se actualiza automáticamente según atributos del usuario (departamento, cargo, ubicación). Las empresas los usan para automatizar asignación de licencias, políticas y acceso a recursos sin intervención manual de IT.',
    'Application Proxy (apps on-prem)': 'Publica aplicaciones on-premises de forma segura sin VPN ni abrir puertos. Ideal para empresas que tienen apps internas (ERP, intranet legacy) y necesitan que los empleados remotos accedan sin configurar VPN en cada dispositivo.',
    'Identity Protection (risk-based)': 'Detección y remediación automática de riesgos de identidad usando ML de Microsoft. Una empresa lo activa para que el sistema bloquee automáticamente cuentas comprometidas o fuerce MFA cuando detecta comportamiento anómalo (ej: viaje imposible).',
    'Privileged Identity Management (PIM)': 'Acceso just-in-time a roles privilegiados con flujos de aprobación y auditoría. Las empresas lo implementan para que nadie tenga acceso admin permanente — los admins lo solicitan cuando lo necesitan, con registro completo para auditoría.',
    'Access Reviews': 'Revisiones periódicas automatizadas del acceso de usuarios a recursos, grupos y roles. Las empresas lo usan para cumplir con regulaciones (ISO 27001, SOC 2) que exigen revisión periódica de quién tiene acceso a qué.',
    'Entitlement Management': 'Paquetes de acceso con flujos de aprobación, expiración automática y políticas de ciclo de vida. Útil cuando una empresa necesita dar acceso temporal a proyectos: el empleado solicita un paquete, se aprueba, y se revoca automáticamente al vencer.',
    'SSO (Single Sign-On)': 'Inicio de sesión único para acceder a todas las apps corporativas con una sola autenticación. Las empresas lo implementan para que los empleados no tengan múltiples contraseñas y para centralizar el control de acceso a apps SaaS y on-prem.',
    'Group-based Licensing': 'Asignación automática de licencias M365 basada en membresía de grupos. Las empresas lo usan para que al agregar un usuario a un grupo (ej: "Departamento Ventas") se le asignen automáticamente las licencias correctas.',
    'Terms of Use': 'Requiere aceptación de términos y condiciones antes de acceder a recursos corporativos. Las empresas lo usan para cumplimiento legal: política de uso aceptable, GDPR consent, o acuerdos de confidencialidad antes de acceder al tenant.',
    'Named Locations (IP/País)': 'Define ubicaciones de red confiables por rango IP o país para políticas de Conditional Access. Las empresas las configuran para permitir acceso sin MFA desde la oficina pero exigirlo desde fuera, o bloquear acceso desde países donde no operan.',
    'Sign-in Risk Policies': 'Políticas que responden automáticamente a inicios de sesión riesgosos (ej: forzar MFA o bloquear). Una empresa las activa para que si alguien intenta iniciar sesión desde una IP anónima o ubicación inusual, el sistema reaccione automáticamente.',
    'User Risk Policies': 'Políticas que responden cuando un usuario tiene nivel de riesgo elevado (ej: exigir cambio de contraseña). Si Microsoft detecta que las credenciales de un empleado aparecen en una filtración, el sistema fuerza el cambio de contraseña automáticamente.',
    'Password Protection (banned passwords)': 'Lista personalizada de contraseñas prohibidas + agente on-prem que bloquea contraseñas débiles. Las empresas la usan para prohibir contraseñas como "NombreEmpresa2024" o variaciones comunes que los atacantes prueban primero.',
    'B2B Collaboration / Guest Access': 'Invitación y gestión de usuarios externos (guests) con acceso controlado a recursos del tenant. Las empresas lo usan para colaborar con proveedores, consultores o clientes dándoles acceso limitado a Teams, SharePoint o apps específicas.',
    'Entra Connect / Hybrid Identity': 'Sincronización de directorio on-premises con Entra ID. Soporta Password Hash Sync, Pass-through Auth y Federation. Esencial para empresas con Active Directory on-prem que necesitan que sus usuarios usen las mismas credenciales en la nube.',
    'Device Registration (Entra Join / Hybrid Join)': 'Registro de dispositivos en Entra ID: Azure AD Join (cloud), Hybrid Join (on-prem + cloud) o Registered (BYOD). Permite a la empresa identificar los dispositivos que acceden a sus recursos y aplicar políticas de Conditional Access basadas en el estado del dispositivo.',
    'Certificate-Based Authentication (CBA)': 'Autenticación mediante certificados X.509 y smart cards, sin necesidad de contraseña. Usada por empresas en sectores regulados (gobierno, defensa, finanzas) que requieren autenticación con smart card o tarjetas PIV/CAC.',
    'Continuous Access Evaluation (CAE)': 'Evaluación continua que revoca sesiones en tiempo real ante cambios de condiciones. Si una empresa desactiva una cuenta o cambia la ubicación de red, CAE revoca la sesión inmediatamente en lugar de esperar a que expire el token (1 hora por defecto).',
    'Authentication Context (step-up)': 'Requiere autenticación adicional para acciones sensibles dentro de una app. Una empresa lo usa para que acceder a SharePoint sea con SSO normal, pero descargar documentos confidenciales requiera MFA adicional o dispositivo compliant.',
    'Token Protection': 'Vincula tokens de sesión al dispositivo específico para prevenir robo y replay de tokens. Protege a la empresa contra ataques de adversary-in-the-middle donde un atacante roba el token de sesión y lo usa desde otro dispositivo.',
    'Admin Consent Workflows': 'Flujo donde usuarios solicitan acceso a apps que requieren permisos admin, y los admins aprueban o deniegan. Evita que los usuarios otorguen permisos excesivos a apps de terceros (un vector común de ataque) sin supervisión de IT.',
    'Workload Identities Premium': 'Conditional Access y protección avanzada para service principals, managed identities y apps registradas. Las empresas lo necesitan cuando tienen automatizaciones y apps que acceden a datos sensibles y quieren aplicar las mismas políticas de seguridad que a los usuarios.',
    'Audit Logs y Sign-in Reports': 'Registro de actividad de autenticación y cambios en el directorio. Retención: 7 días (Free) o 30 días (P1/P2). Esencial para investigar incidentes de seguridad, cumplir con auditorías y entender patrones de acceso en la organización.',
    'Passwordless Auth (Authenticator, FIDO2, WHfB)': 'Autenticación sin contraseña vía Microsoft Authenticator, llaves FIDO2 o Windows Hello for Business. Las empresas lo implementan para eliminar contraseñas (el vector de ataque #1), mejorar la experiencia del usuario y reducir costos de helpdesk.',
    'Temporary Access Pass (TAP)': 'Código temporal de un solo uso para configurar métodos de autenticación passwordless o recuperar acceso. Las empresas lo usan durante el onboarding: el nuevo empleado recibe un TAP para registrar su primer método de autenticación sin necesitar una contraseña.',
    'Cross-tenant Synchronization': 'Sincronización automática de usuarios entre múltiples tenants de una misma organización. Útil para empresas con subsidiarias o adquisiciones que tienen tenants separados pero necesitan que los empleados colaboren como si fueran uno solo.',
    'Lifecycle Workflows (Governance)': 'Automatización de tareas de onboarding, cambios de rol y offboarding de usuarios (requiere Entra ID Governance). Las empresas lo usan para que al contratar un empleado se creen automáticamente sus cuentas, se asignen licencias y se envíe el email de bienvenida.',
    'Custom Security Attributes': 'Atributos personalizados en Entra ID para clasificar usuarios/apps y usarlos en políticas de acceso. Una empresa los usa para etiquetar usuarios por proyecto, nivel de clearance o unidad de negocio y luego crear políticas de acceso basadas en esos atributos.',

    // — Intune —
    'MDM — Enrolamiento y gestión de dispositivos': 'Inscripción y gestión completa de dispositivos (Windows, iOS, Android, macOS). Las empresas lo implementan para tener control centralizado de todos los dispositivos corporativos: aplicar políticas, instalar apps, y garantizar que cumplen con los estándares de seguridad.',
    'MAM — Protección de apps sin enrolar': 'Protección de datos corporativos en apps móviles sin inscribir el dispositivo personal. Ideal para empresas con política BYOD: protege los datos de Outlook, Teams y OneDrive en el móvil personal del empleado sin controlar el dispositivo completo.',
    'Compliance Policies (device health)': 'Reglas que verifican el estado de salud del dispositivo: versión de OS, cifrado, jailbreak, antivirus. Las empresas las usan combinadas con Conditional Access para que solo dispositivos que cumplen los requisitos de seguridad accedan a datos corporativos.',
    'App deployment (Win32, LOB, Store)': 'Distribución e instalación de aplicaciones Win32, LOB y Microsoft Store en dispositivos. Las empresas lo usan para desplegar software corporativo (ERP, herramientas internas, agentes de seguridad) a todos los dispositivos sin intervención del usuario.',
    'Windows Autopilot': 'Aprovisionamiento zero-touch de dispositivos Windows nuevos directamente desde fábrica. La empresa envía el laptop directamente al domicilio del empleado y al encenderlo se configura solo con las apps, políticas y perfil corporativo.',
    'Windows Autopatch': 'Servicio gestionado por Microsoft que automatiza actualizaciones de Windows, Edge, Office y drivers. Libera al equipo de IT de gestionar parches manualmente y garantiza que los dispositivos estén siempre actualizados en anillos controlados.',
    'Endpoint Analytics': 'Métricas de rendimiento, tiempos de arranque y experiencia del usuario. Las empresas lo usan para identificar dispositivos lentos, apps que causan crashes, y priorizar hardware upgrades basándose en datos reales de experiencia del usuario.',
    'Configuration Profiles (Wi-Fi, VPN, email)': 'Configuración centralizada de Wi-Fi, VPN, cuentas de email, restricciones y certificados. Las empresas lo usan para que al inscribir un dispositivo se configure automáticamente el Wi-Fi corporativo, VPN, cuenta de correo y restricciones de seguridad.',
    'Remote Wipe / Remote Lock': 'Borrado remoto completo o bloqueo del dispositivo en caso de pérdida, robo o baja del empleado. Es el control de emergencia que toda empresa necesita: si un empleado pierde su laptop con datos sensibles, IT puede borrarlo remotamente en minutos.',
    'LAPS (Local Admin Password Solution)': 'Gestión automática de contraseñas del administrador local en dispositivos Windows, almacenadas en Entra ID. Elimina el riesgo de tener la misma contraseña de admin local en todos los dispositivos, que es un vector de movimiento lateral para atacantes.',
    'Endpoint Privilege Management': 'Elevación de privilegios controlada para tareas específicas sin dar admin permanente al usuario. Las empresas lo usan para que un usuario pueda instalar una impresora o ejecutar un instalador aprobado sin ser admin, reduciendo la superficie de ataque.',
    'Security Baselines (Windows, Edge, Office)': 'Configuraciones de seguridad recomendadas por Microsoft preconfiguradas. Las empresas las despliegan como punto de partida de seguridad: cientos de configuraciones óptimas de Windows, Edge y Office aplicadas de una vez.',
    'Windows Update Rings': 'Control granular del despliegue de actualizaciones por grupos con periodos de diferimiento. Las empresas crean anillos (piloto → IT → general) para probar updates en un grupo pequeño antes de desplegarlo a toda la organización.',
    'Enrollment Restrictions y Device Limits': 'Restricciones por plataforma, versión de OS y límite de dispositivos por usuario. Las empresas las usan para bloquear inscripción de Android si solo soportan iOS, exigir versión mínima de OS, o limitar a 3 dispositivos por empleado.',
    'Selective Wipe (solo datos corporativos)': 'Eliminación solo de datos y apps corporativos sin afectar datos personales del usuario. Clave para BYOD: cuando un empleado deja la empresa, IT borra solo Outlook, Teams y datos corporativos de su móvil personal sin tocar sus fotos o apps personales.',
    'Enrollment Status Page (ESP)': 'Pantalla durante el primer inicio que asegura que apps y políticas se apliquen antes de que el usuario use el dispositivo. Garantiza que cuando el empleado abre su nuevo laptop, todo el software requerido y las políticas de seguridad ya están aplicados.',
    'Microsoft Tunnel (VPN gateway)': 'Gateway VPN ligero para acceso seguro a recursos on-premises desde dispositivos móviles iOS y Android. Las empresas lo usan cuando empleados móviles necesitan acceder a aplicaciones internas o file servers desde el celular sin una solución VPN completa.',
    'Mobile Threat Defense (MTD)': 'Integración con soluciones de defensa contra amenazas móviles como Microsoft Defender, Lookout o Zimperium. Las empresas lo activan para detectar malware, apps maliciosas o redes Wi-Fi comprometidas en los dispositivos móviles de los empleados.',
    'Co-management (SCCM ↔ Intune)': 'Gestión dual entre Configuration Manager e Intune con workloads divididos durante la transición. Las empresas que ya tienen SCCM lo usan como estrategia de migración gradual a la nube: mueven workloads uno a uno sin disrumpir operaciones.',
    'Device Categories y Custom Attributes': 'Clasificación automática de dispositivos por categorías para organización y targeting. Las empresas los usan para separar dispositivos por departamento, ubicación o tipo (kiosk, shared, personal) y aplicar políticas específicas a cada grupo.',
    'WDAC (Application Control)': 'Windows Defender Application Control: políticas de integridad de código que controlan qué apps pueden ejecutarse. Las empresas lo despliegan en endpoints sensibles (finanzas, directivos) para garantizar que solo software aprobado se ejecute.',
    'Kiosk / Dedicated Device Mode': 'Configuración de dispositivos en modo quiosco para una sola app o conjunto limitado. Las empresas lo usan en recepción, punto de venta, piso de producción o dispositivos compartidos donde el usuario solo necesita una app específica.',
    'Remediation Scripts (Proactive Remediations)': 'Scripts PowerShell que detectan problemas en dispositivos y los corrigen automáticamente. Las empresas los usan para detectar y corregir problemas comunes (servicios detenidos, claves de registro incorrectas, caché corrupta) antes de que el usuario llame al helpdesk.',
    'Remote Help': 'Herramienta de asistencia remota integrada en Intune para soporte técnico a usuarios finales. Las empresas lo usan como alternativa a TeamViewer o AnyDesk, con la ventaja de estar integrado en Intune con RBAC y registro de sesiones para auditoría.',
    'Custom Compliance Scripts': 'Scripts personalizados (PowerShell/shell) para validar requisitos de compliance específicos de la organización. Las empresas los crean cuando necesitan verificar condiciones que Intune no evalúa de forma nativa (ej: versión de un agente interno, clave de registro específica).',
    'Scope Tags y RBAC (Intune)': 'Control de acceso basado en roles y etiquetas de ámbito para segmentar la administración. Las empresas con múltiples oficinas o unidades de negocio lo usan para que los admins de cada sede solo vean y gestionen los dispositivos de su ámbito.',
    'Assignment Filters': 'Filtros granulares que permiten incluir o excluir dispositivos de una asignación de política según propiedades como fabricante, modelo, versión de OS o tipo de inscripción. Las empresas los usan para aplicar configuraciones diferentes sin crear grupos adicionales en Entra ID — por ejemplo, asignar una política solo a dispositivos Surface o solo a móviles Android corporativos.',
    'Platform Scripts (PowerShell / Shell)': 'Ejecución de scripts personalizados de PowerShell (Windows) o Shell (macOS/Linux) directamente desde Intune en los dispositivos administrados. Las empresas los usan para automatizar configuraciones avanzadas que no cubren los perfiles nativos de Intune — como mapear impresoras de red, configurar claves de registro específicas o instalar agentes internos.',
    'Certificate Connector (SCEP / PKCS)': 'Infraestructura para desplegar certificados digitales a dispositivos a través de protocolos SCEP o PKCS. Las empresas lo implementan para autenticación basada en certificados en redes Wi-Fi corporativas (802.1X), conexiones VPN y acceso a recursos internos — eliminando la dependencia de contraseñas para la autenticación de dispositivos.',
    'Apple ABM / Android Enterprise': 'Integración con Apple Business Manager y Android Enterprise para el enrolamiento automatizado y gestión completa de dispositivos móviles corporativos. Las empresas lo usan para que los dispositivos nuevos se configuren automáticamente al encenderse (zero-touch enrollment), separar el perfil personal del corporativo (Work Profile) y distribuir apps internas sin pasar por las tiendas públicas.',
    'Firmware Configuration (DFCI)': 'Device Firmware Configuration Interface permite gestionar configuraciones de BIOS/UEFI desde Intune en dispositivos compatibles (Surface, Lenovo, Dell, HP). Las empresas lo usan para deshabilitar puertos USB, cámaras o arranque desde USB a nivel de firmware — una capa de seguridad que no se puede evadir desde el sistema operativo, ideal para dispositivos en entornos de alta seguridad.',
    'Intune Advanced Analytics': 'Reportes avanzados con detección de anomalías, análisis de batería, conectividad de red y rendimiento de apps. Las empresas lo usan para identificar proactivamente dispositivos con problemas de rendimiento o hardware antes de que impacten la productividad del usuario — por ejemplo, detectar baterías degradadas o apps que causan bloqueos frecuentes.',

    // — Microsoft Defender —
    'Plan incluido': 'Nivel del plan de Defender incluido con la licencia. Plan 1: protección básica. Plan 2: investigación avanzada y respuesta automatizada. Determina el nivel de protección que la empresa tiene sin comprar licencias adicionales de seguridad.',
    'Safe Attachments / Safe Links': 'Análisis de adjuntos y URLs en tiempo real en correo, Teams y SharePoint. Las empresas lo activan para proteger a los empleados de adjuntos maliciosos y enlaces de phishing que evaden los filtros de correo tradicionales.',
    'Anti-phishing avanzado': 'Protección contra suplantación de identidad con detección de dominios similares e inteligencia de buzón. Las empresas lo usan para proteger a ejecutivos y empleados de ataques de spear-phishing dirigido con dominios que imitan a proveedores o socios.',
    'Attack Simulation Training': 'Simulaciones de phishing y campañas de concientización para entrenar a usuarios. Las empresas ejecutan campañas periódicas para medir qué porcentaje de empleados cae en phishing simulado e identificar quiénes necesitan capacitación adicional.',
    'Protección de próxima generación': 'Antivirus y antimalware con protección en la nube, análisis de comportamiento y ML. Es la protección base de endpoints que toda empresa necesita: reemplaza o complementa el antivirus tradicional con detección basada en comportamiento.',
    'Attack Surface Reduction': 'Reglas que bloquean vectores de ataque comunes: macros de Office, scripts maliciosos, ejecución desde email. Las empresas las activan para bloquear el 80% de los vectores de ataque más usados por ransomware y malware sin afectar la productividad.',
    'EDR (Endpoint Detection & Response)': 'Detección avanzada de amenazas en endpoints con timeline de actividad, investigación y respuesta. Las empresas lo necesitan para que el equipo de seguridad investigue incidentes: ver exactamente qué procesos se ejecutaron, qué archivos se tocaron y qué conexiones se hicieron.',
    'Threat Hunting': 'Búsqueda proactiva de amenazas usando Kusto Query Language sobre 30 días de telemetría. Las empresas con SOC o equipo de seguridad dedicado lo usan para buscar indicadores de compromiso (IOCs) y amenazas que las detecciones automáticas no capturaron.',
    'Automated Investigation & Response': 'Investigación y remediación automática de alertas usando playbooks de Microsoft. Las empresas lo activan para reducir el tiempo de respuesta ante incidentes: el sistema investiga automáticamente y remedia amenazas comunes sin intervención humana.',
    'Detección de amenazas en Active Directory': 'Monitoreo de señales de AD on-prem para detectar ataques como Pass-the-Hash, Golden Ticket y Kerberoasting. Esencial para empresas con AD on-premises que quieren detectar atacantes moviéndose dentro de su red interna.',
    'Detección de movimiento lateral': 'Identifica intentos de movimiento lateral entre máquinas usando credenciales comprometidas. Protege a la empresa cuando un atacante ya comprometió una máquina y está intentando escalar para alcanzar servidores o cuentas de alto valor.',
    'Monitoreo de credenciales comprometidas': 'Detecta credenciales expuestas en la dark web o usadas en ataques de fuerza bruta contra AD. Alerta a la empresa cuando las credenciales de un empleado aparecen en filtraciones de datos para que fuerce el cambio de contraseña.',
    'Inventario de software y vulnerabilidades': 'Inventario completo de software instalado con CVEs conocidas y su nivel de riesgo. Las empresas lo usan para tener visibilidad de qué software vulnerable tienen en sus endpoints y priorizar qué parchear primero.',
    'Recomendaciones de seguridad priorizadas': 'Recomendaciones accionables priorizadas por impacto para reducir la superficie de ataque. El equipo de seguridad las usa como checklist priorizado: "estas 10 acciones reducirían tu riesgo un X%" con pasos concretos.',
    'Evaluación de configuraciones de seguridad': 'Análisis de configuraciones de OS, navegador y apps comparadas con benchmarks de seguridad. Las empresas lo usan para identificar configuraciones débiles (ej: protocolos legacy habilitados, SMBv1) y corregirlas antes de que un atacante las explote.',
    'Cloud App Discovery': 'Descubrimiento automático de todas las apps SaaS usadas en la organización (shadow IT). Las empresas lo usan para descubrir que los empleados están usando 200+ apps SaaS no autorizadas y evaluar cuáles representan un riesgo de datos.',
    'CASB — Control de apps SaaS': 'Cloud Access Security Broker: políticas de acceso, DLP y detección de amenazas para apps SaaS. Las empresas lo usan para aplicar políticas de seguridad a apps como Dropbox, Salesforce o Box: detectar descargas masivas, comparticiones externas, etc.',
    'Session & Access Policies': 'Control granular de sesiones en apps cloud: bloqueo de descargas, monitoreo en tiempo real, restricción por dispositivo. Las empresas las usan para permitir acceso web a una app SaaS desde dispositivos no gestionados pero bloqueando la descarga de archivos.',
    'Portal unificado de seguridad': 'Consola única en security.microsoft.com que consolida alertas, incidentes e investigación. Las empresas lo usan como "panel único de vidrio" para que el equipo de seguridad no necesite alternar entre 5 consolas diferentes para investigar un incidente.',
    'Correlación de incidentes cross-product': 'Correlación automática de alertas de Endpoint, Office, Identity y Cloud Apps en incidentes unificados (XDR). Permite que la empresa vea un ataque completo (email de phishing → ejecución en endpoint → movimiento lateral → exfiltración) como un solo incidente.',

    // — Cumplimiento (Purview) —
    'Sensitivity Labels manuales': 'Etiquetas que los usuarios aplican manualmente a documentos y emails para clasificar y proteger información. Las empresas las implementan para que los empleados marquen documentos como "Confidencial" o "Solo interno" y se aplique cifrado y restricciones automáticamente.',
    'Sensitivity Labels automáticas (auto-labeling)': 'Aplicación automática de etiquetas basada en tipos de información sensible detectados. Las empresas la activan para que documentos con números de tarjeta de crédito, datos de salud o información PII se clasifiquen automáticamente sin depender del usuario.',
    'DLP — Exchange/SharePoint/OneDrive': 'Prevención de pérdida de datos en correo, sitios de SharePoint y archivos de OneDrive. Las empresas lo configuran para evitar que empleados envíen por email información sensible (números de cuenta, datos de clientes) fuera de la organización.',
    'DLP — Teams y Endpoints': 'Extensión de DLP a mensajes de Teams y dispositivos Windows (copiar, imprimir, USB). Las empresas lo activan para evitar que datos sensibles se compartan por chat de Teams o se copien a USB, complementando la protección del correo.',
    'Message Encryption': 'Cifrado de mensajes de correo para destinatarios internos y externos sin necesidad de certificados. Las empresas lo usan para enviar información sensible (contratos, datos financieros) por email con cifrado que el destinatario externo puede abrir sin software especial.',
    'Advanced Message Encryption': 'Cifrado avanzado con revocación de mensajes, plantillas personalizadas y expiración automática. Las empresas lo usan cuando necesitan revocar un email cifrado ya enviado o hacer que expire después de 7 días para información muy sensible.',
    'Customer Key (encryption at rest)': 'Control de las claves de cifrado en reposo usando claves propias del cliente en Azure Key Vault. Empresas en sectores regulados lo implementan para cumplir requisitos donde deben controlar las claves de cifrado de sus datos en M365.',
    'Retention Policies manuales': 'Políticas de retención que preservan o eliminan contenido después de un periodo definido. Las empresas las configuran para cumplir regulaciones: retener emails 7 años (requisito fiscal), eliminar archivos de proyectos cerrados después de 3 años, etc.',
    'Retention Labels automáticas': 'Etiquetas de retención aplicadas automáticamente según condiciones o tipos de información sensible. Las empresas las usan para clasificar y retener automáticamente contratos, facturas o documentos regulados sin depender de que el usuario los etiquete.',
    'Records Management': 'Gestión de registros con planes de archivos, revisiones de disposición y retención basada en eventos. Las empresas en sectores regulados (finanzas, salud, gobierno) lo usan para gestionar el ciclo de vida completo de registros oficiales con cadena de custodia.',
    'Audit log básico — 90 días': 'Registro de auditoría de actividades de usuarios y admins con retención de 90 días. Las empresas lo consultan para investigar quién accedió o modificó un documento, quién cambió permisos, o qué hizo un empleado antes de irse.',
    'Audit Premium — 1 año': 'Auditoría avanzada con retención de 1 año (extensible a 10 años), eventos cruciales y acceso a API. Las empresas lo necesitan para cumplir regulaciones que exigen retención de logs extendida y para investigaciones forenses que requieren historial largo.',
    'eDiscovery Standard': 'Búsqueda y exportación de contenido en buzones, sitios y Teams para investigaciones legales. Las empresas lo usan cuando el departamento legal necesita buscar y preservar toda la comunicación de un empleado involucrado en un litigio.',
    'eDiscovery Premium': 'eDiscovery avanzado con revisión inteligente, detección de duplicados, análisis de conversaciones y custodios. Las empresas con litigios complejos lo usan para procesar grandes volúmenes de datos con ML que identifica documentos relevantes automáticamente.',
    'Insider Risk Management': 'Detección de actividades de riesgo interno: exfiltración de datos, violaciones de políticas y comportamiento anómalo. Las empresas lo activan para detectar cuando un empleado está descargando masivamente archivos antes de renunciar o compartiendo datos con competidores.',
    'Communication Compliance': 'Monitoreo de comunicaciones (email, Teams, Copilot) para detectar lenguaje inapropiado o violaciones regulatorias. Las empresas en finanzas lo usan para detectar comunicaciones sobre insider trading; en general, para cumplir políticas de conducta.',
    'Information Barriers': 'Muros de contención que impiden la comunicación entre grupos de usuarios específicos. Las empresas de servicios financieros los implementan para separar departamentos (ej: banca de inversión y asesoría) y evitar conflictos de interés regulatorios.',
    'Customer Lockbox': 'Requiere aprobación explícita del cliente antes de que ingenieros de Microsoft accedan a datos del tenant. Las empresas en sectores sensibles lo activan para tener control y registro de cuándo Microsoft necesita acceder a sus datos durante un caso de soporte.',
    'Compliance Manager': 'Panel de cumplimiento con score y evaluaciones contra marcos regulatorios (ISO 27001, GDPR, NIST, etc.). Las empresas lo usan para medir su postura de cumplimiento, identificar gaps y seguir recomendaciones paso a paso para mejorar su score ante auditorías.',
    'Trainable Classifiers': 'Clasificadores de contenido entrenados con ML que identifican tipos de documentos específicos (contratos, CVs, código fuente). Las empresas los crean cuando los tipos de información sensible predefinidos no cubren sus necesidades específicas de clasificación.',
    'Exact Data Match (EDM)': 'Detección DLP basada en datos exactos de la empresa (ej: lista real de números de cuenta de clientes). Las empresas lo usan cuando necesitan que DLP detecte SUS datos específicos, no solo patrones genéricos como "cualquier número de tarjeta".',
    'Adaptive Protection': 'Aplica automáticamente políticas DLP más estrictas a usuarios que Insider Risk Management identifica como riesgosos. Las empresas lo activan para que un empleado detectado descargando archivos inusuales reciba restricciones DLP automáticas sin intervención manual.',
    'Double Key Encryption (DKE)': 'Cifrado de documentos con dos claves: una del cliente y otra de Microsoft. Ni siquiera Microsoft puede descifrar los datos. Las empresas en sectores altamente regulados lo usan para documentos ultra-sensibles donde necesitan control total del cifrado.',
    'Privileged Access Management (PAM)': 'Acceso just-in-time a tareas administrativas de M365 con aprobación por tarea específica. Las empresas lo implementan para que un admin no tenga acceso permanente a buzones de correo o sitios de SharePoint — lo solicita caso por caso.',
    'DLP para Power BI': 'Extensión de políticas DLP a dashboards y datasets de Power BI. Las empresas lo activan para detectar y proteger cuando un reporte de Power BI contiene información sensible (números de cuenta, datos personales) compartido inadecuadamente.',
    'Content Search': 'Herramienta de búsqueda unificada en el portal de Purview que permite buscar contenido en buzones de Exchange, sitios de SharePoint, cuentas de OneDrive y conversaciones de Teams. Las empresas lo usan como primer paso antes de abrir un caso de eDiscovery — por ejemplo, localizar todos los correos y archivos relacionados con un proyecto o incidente específico.',
    'Litigation Hold': 'Retención legal aplicada a buzones de Exchange que preserva todo el contenido (correos, calendario, tareas) incluso si el usuario intenta eliminarlos. Las empresas lo activan cuando reciben una notificación legal o anticipan un litigio — garantiza que la evidencia electrónica no sea destruida durante el proceso judicial.',
    'Data Lifecycle Management (auto-disposition)': 'Revisión de disposición automática que evalúa contenido al final de su período de retención antes de eliminarlo permanentemente. Las empresas en sectores regulados lo usan para que un revisor apruebe la eliminación de documentos — cumpliendo con regulaciones que exigen verificación humana antes de destruir registros corporativos.',
    'Subject Rights Requests': 'Flujo automatizado para gestionar solicitudes de derechos de los interesados bajo GDPR, LGPD, CCPA y otras leyes de privacidad (acceso, rectificación, eliminación de datos personales). Las empresas lo usan para cumplir con los plazos legales de respuesta — Purview identifica automáticamente dónde están los datos del solicitante en Exchange, SharePoint, OneDrive y Teams.',
    'Data Map / Data Catalog': 'Descubrimiento, clasificación y gobernanza de datos en entornos híbridos y multi-cloud (Azure, AWS, on-prem SQL, Power BI). Las empresas lo implementan para tener un inventario centralizado de todos sus activos de datos — saber qué datos sensibles existen, dónde están y quién tiene acceso, especialmente útil para auditorías y cumplimiento regulatorio.',

    // — Almacenamiento —
    'Por usuario': 'Espacio de OneDrive asignado a cada usuario. Varía según licencia: desde 2 GB (F1) hasta 1-5 TB (Enterprise). Es el almacenamiento personal de cada empleado para sus documentos de trabajo, accesible desde cualquier dispositivo.',
    'Base del tenant': 'Almacenamiento base de SharePoint asignado al tenant: 1 TB para toda la organización. Es el pool compartido que la empresa usa para todos los sitios de SharePoint, intranets y bibliotecas de documentos.',
    'Adicional por licencia': 'Almacenamiento adicional de SharePoint que se suma al pool del tenant por cada licencia asignada. Una empresa con 500 licencias E3 tiene 1 TB base + 500 × 10 GB = 6 TB total de SharePoint.',
    'Buzón principal': 'Tamaño del buzón de correo principal de Exchange Online. Kiosk: 2 GB. Plan 1: 50 GB. Plan 2: 100 GB. Determina cuánto correo puede almacenar cada empleado antes de necesitar archivar o eliminar.',
    'Buzón de archivo': 'Buzón secundario para correo antiguo. No disponible en Kiosk. 50 GB en Plan 1. Ilimitado en Plan 2. Las empresas lo habilitan para que empleados con mucho historial de correo muevan emails antiguos sin perderlos.',
    'Auto-expanding archive': 'Expansión automática del buzón de archivo hasta 1,5 TB. Disponible en Plan 2 (E3/E5) vía PowerShell. Las empresas con requisitos de retención largos lo activan para empleados que necesitan conservar años de correo por regulación.',
    'Archivos en canales': 'Los archivos compartidos en canales de Teams se almacenan en SharePoint del equipo (usa pool del tenant). Importante para planificar almacenamiento: cada equipo de Teams crea un sitio de SharePoint que consume del pool.',
    'Archivos en chats': 'Los archivos compartidos en chats 1:1 o grupales se almacenan en el OneDrive del remitente. Las empresas deben saberlo para entender que los archivos de chat consumen la cuota de OneDrive del usuario que los comparte.',
    'Grabaciones de reuniones': 'Las grabaciones de reuniones de Teams se almacenan en OneDrive/SharePoint del organizador. Las empresas deben planificar el almacenamiento considerando que las grabaciones pueden consumir varios GB por reunión.',
    'Dataverse (base por tenant)': 'Base de datos relacional de Microsoft para Power Platform. No viene incluida con ningún plan de M365 — requiere licencia standalone de Power Apps, Power Automate o Dynamics 365. Las empresas que necesitan Dataverse para apps model-driven, flujos con conectores premium o portales de Power Pages deben adquirir capacidad por separado.',
    'Power Apps — almacenamiento de datos': 'Las canvas apps incluidas con M365 solo pueden usar datos de SharePoint, Excel, OneDrive y otros conectores estándar de M365. No tienen acceso a Dataverse ni conectores premium. Las empresas usan este nivel para apps sencillas como formularios de solicitud, aprobaciones y dashboards internos basados en listas de SharePoint.',
    'Power Automate — ejecuciones/mes': 'Cada usuario con licencia M365 (excepto F1) tiene hasta 6.000 ejecuciones mensuales de cloud flows con conectores estándar. Las empresas lo usan para automatizaciones básicas como notificaciones, aprobaciones y sincronización de datos entre apps de M365. Para flujos con conectores premium, RPA o mayor volumen se requiere licencia standalone.',
    'Power Pages — visitas autenticadas/mes': 'Power Pages (antes Power Apps Portals) no está incluido en ningún plan de M365 — requiere licencia standalone con capacidad de visitas autenticadas o anónimas por mes. Las empresas lo adquieren por separado cuando necesitan crear portales web externos para clientes, proveedores o ciudadanos que interactúan con datos de Dataverse.',
    'Tamaño máximo adjunto (correo)': 'Límite de tamaño por adjunto en correo de Exchange Online. Kiosk (F1/F3): 35 MB. Plan 1/2: 150 MB. Las empresas deben tenerlo en cuenta al compartir archivos grandes — para archivos mayores se recomienda usar enlaces de OneDrive/SharePoint en lugar de adjuntos directos.',
    'Tamaño máximo archivo (SharePoint/OneDrive)': 'Límite de 250 GB por archivo individual en SharePoint y OneDrive, igual en todos los planes. Las empresas que trabajan con archivos muy grandes (backups, videos, datasets) deben considerar este límite al elegir dónde almacenar.',
    'Límite por sitio SharePoint': 'Cada sitio de SharePoint individual puede almacenar hasta 25 TB. Es independiente del pool del tenant — un solo sitio no puede exceder este límite aunque haya espacio disponible en el pool. Las empresas con grandes repositorios documentales deben distribuir contenido entre varios sitios.',
    'Instalaciones de Office por usuario': 'Cantidad de dispositivos donde cada usuario puede instalar las apps de Office desktop: 5 PC/Mac + 5 tablets + 5 móviles = 15 total. Las empresas con empleados que usan múltiples dispositivos aprovechan esto para tener Office en todos sin licencias adicionales.'
  };

  // Defender sub-features that share generic names need slide context
  var DEFENDER_INCLUDED = {
    'Defender for Office 365': 'Nivel de protección para correo, Teams y SharePoint incluido con la licencia.',
    'Defender for Endpoint': 'Nivel de protección para dispositivos Windows, macOS, Linux, iOS y Android.',
    'Defender for Identity': 'Protección de identidades on-premises mediante sensores en controladores de dominio.',
    'Defender Vulnerability Management': 'Gestión de vulnerabilidades basada en riesgo para priorizar la remediación.',
    'Defender for Cloud Apps': 'Visibilidad y control sobre aplicaciones SaaS usadas en la organización.',
    'Microsoft 365 Defender XDR': 'Detección y respuesta extendida que correlaciona señales de todos los productos Defender.'
  };

  (function initFeatureDescriptions() {
    var tables = m365Panel ? m365Panel.querySelectorAll('.m365t-table') : [];
    tables.forEach(function (table) {
      var rows = table.querySelectorAll('tbody tr:not(.m365t-subheader)');
      var currentSubheader = '';

      // Walk all rows including subheaders to track context
      var allRows = table.querySelectorAll('tbody tr');
      allRows.forEach(function (row) {
        if (row.classList.contains('m365t-subheader')) {
          currentSubheader = row.textContent.trim();
          return;
        }

        var firstTd = row.querySelector('td:first-child');
        if (!firstTd) return;

        var featureName = firstTd.textContent.trim();
        var desc = FEATURE_DESC[featureName];

        // Handle generic "Plan incluido" / "Incluido" names using subheader context
        if (!desc && (featureName === 'Plan incluido' || featureName === 'Incluido')) {
          desc = DEFENDER_INCLUDED[currentSubheader] || null;
        }

        if (!desc) return;

        // Add info button
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'm365t-info-btn';
        btn.setAttribute('aria-label', 'Ver descripción');
        btn.innerHTML = '<i class="fas fa-info-circle"></i>';

        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var parentRow = this.closest('tr');
          var existing = parentRow.nextElementSibling;

          // Close if already open
          if (existing && existing.classList.contains('m365t-desc-row')) {
            existing.classList.remove('m365t-desc-row--open');
            setTimeout(function () { existing.remove(); }, 250);
            btn.classList.remove('m365t-info-btn--active');
            return;
          }

          // Close any other open description in this table
          var openRows = table.querySelectorAll('.m365t-desc-row');
          openRows.forEach(function (r) {
            r.classList.remove('m365t-desc-row--open');
            setTimeout(function () { r.remove(); }, 250);
          });
          table.querySelectorAll('.m365t-info-btn--active').forEach(function (b) {
            b.classList.remove('m365t-info-btn--active');
          });

          // Create description row
          var colCount = parentRow.querySelectorAll('td').length;
          var descRow = document.createElement('tr');
          descRow.className = 'm365t-desc-row';
          var descTd = document.createElement('td');
          descTd.colSpan = colCount;
          descTd.className = 'm365t-desc-cell';
          descTd.innerHTML = '<i class="fas fa-lightbulb m365t-desc-icon"></i> ' + desc;
          descRow.appendChild(descTd);

          parentRow.after(descRow);
          btn.classList.add('m365t-info-btn--active');

          // Trigger animation
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              descRow.classList.add('m365t-desc-row--open');
            });
          });
        });

        firstTd.appendChild(btn);
      });
    });
  })();

  // === SWIPER — M365 comparison tables ===
  if (typeof Swiper !== 'undefined' && document.querySelector('.m365t-swiper')) {
    new Swiper('.m365t-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      navigation: {
        nextEl: '.m365t-swiper .swiper-button-next',
        prevEl: '.m365t-swiper .swiper-button-prev'
      },
      pagination: {
        el: '.m365t-swiper .swiper-pagination',
        clickable: true
      }
    });
  }

  // === COMPARADOR DE LICENCIAS M365 ===
  (function initComparador() {
    var cmpQuestion = document.getElementById('cmpQuestion');
    if (!cmpQuestion) return;

    var QUESTIONS = [
      {
        id: 'q1_size',
        text: '¿Cuántos usuarios tiene la organización?',
        options: [
          { label: '1 – 10 usuarios',     value: 'micro',  icon: 'fa-user' },
          { label: '11 – 50 usuarios',    value: 'small',  icon: 'fa-user-friends' },
          { label: '51 – 300 usuarios',   value: 'medium', icon: 'fa-users' },
          { label: 'Más de 300 usuarios', value: 'large',  icon: 'fa-city' }
        ]
      },
      {
        id: 'q2_desktop',
        text: '¿Los usuarios necesitan Office instalado en su PC o Mac?',
        options: [
          { label: 'Sí, todos necesitan Office instalado',  value: 'yes',      icon: 'fa-laptop' },
          { label: 'No, solo usan la versión web y móvil', value: 'web_only', icon: 'fa-globe' },
          { label: 'Algunos sí, otros no',                  value: 'mixed',    icon: 'fa-random' }
        ]
      },
      {
        id: 'q3_mdm',
        text: '¿Necesitas gestión centralizada de dispositivos (Intune / MDM)?',
        options: [
          { label: 'Sí, quiero controlar los equipos corporativos', value: 'yes',     icon: 'fa-lock' },
          { label: 'No es necesario por ahora',                      value: 'no',      icon: 'fa-unlock' },
          { label: 'No lo sé todavía',                               value: 'unknown', icon: 'fa-question' }
        ]
      },
      {
        id: 'q4_regulated',
        text: '¿El sector maneja datos sensibles o está regulado?',
        options: [
          { label: 'Sí — finanzas, salud, legal u otro sector regulado', value: 'yes', icon: 'fa-balance-scale' },
          { label: 'No, es una empresa estándar',                         value: 'no',  icon: 'fa-building' }
        ]
      },
      {
        id: 'q5_frontline',
        text: '¿Hay usuarios sin PC fija (campo, almacén, tienda)?',
        options: [
          { label: 'Sí, hay trabajadores de primera línea', value: 'yes', icon: 'fa-hard-hat' },
          { label: 'No, todos trabajan desde PC o Mac',      value: 'no',  icon: 'fa-desktop' }
        ]
      },
      {
        id: 'q6_compliance',
        text: '¿Necesitas cumplimiento avanzado, eDiscovery o retención legal?',
        options: [
          { label: 'Sí, para toda la organización',                     value: 'all',  icon: 'fa-shield-alt' },
          { label: 'Solo para algunos roles (legal, RRHH, dirección)',  value: 'some', icon: 'fa-user-tie' },
          { label: 'No tenemos esos requisitos',                         value: 'no',   icon: 'fa-times-circle' }
        ]
      }
    ];

    var PLANS_DATA = {
      F1:               { label: 'M365 F1',           color: '#38bdf8', tag: 'Primera línea' },
      F3:               { label: 'M365 F3',           color: '#34d399', tag: 'Primera línea' },
      BusinessBasic:    { label: 'Business Basic',    color: '#94a3b8', tag: 'PYME · hasta 300 usuarios' },
      BusinessStandard: { label: 'Business Standard', color: '#60a5fa', tag: 'PYME · hasta 300 usuarios' },
      BusinessPremium:  { label: 'Business Premium',  color: '#c084fc', tag: 'PYME · hasta 300 usuarios' },
      E3:               { label: 'M365 E3',           color: '#fb923c', tag: 'Enterprise' },
      E5:               { label: 'M365 E5',           color: '#f472b6', tag: 'Enterprise' }
    };

    var RECOMMENDATIONS = {
      E5: {
        subtitle: 'Cumplimiento avanzado y seguridad de nivel enterprise para toda la organización',
        why: 'E5 es el plan más completo de Microsoft 365. Incluye Defender for Office 365 Plan 2, Microsoft Entra ID P2 (PIM, Identity Protection), eDiscovery Premium y Microsoft Purview completo. Es el plan indicado cuando la organización requiere cumplimiento avanzado en toda su estructura.',
        whyNot: 'E3 no incluye Defender Plan 2 ni Entra ID P2 de forma nativa. Los planes Business están limitados a 300 usuarios y no incluyen las herramientas de cumplimiento avanzado que E5 provee.'
      },
      E3: {
        subtitle: 'Enterprise sin límite de usuarios, con Intune y Entra ID P1 incluidos',
        why: 'E3 es el plan Enterprise de referencia. Incluye Office instalado en 5 dispositivos, Exchange Online con buzón de 100 GB y archivo ilimitado, Intune para gestión de dispositivos, Entra ID P1 (acceso condicional) y eDiscovery estándar.',
        whyNot: 'Los planes Business tienen un tope de 300 licencias. E5 agrega Defender Plan 2 y Entra ID P2, pero solo se justifica cuando se requieren sus capacidades específicas de cumplimiento avanzado.',
        addon: { label: 'Defender for Office 365 Plan 1', icon: 'fa-shield-alt', why: 'E3 no incluye Defender for Office 365 de forma nativa — requiere add-on. Para sectores regulados es prácticamente obligatorio: cubre Safe Links, Safe Attachments y protección avanzada contra phishing.' }
      },
      BusinessPremium: {
        subtitle: 'El plan más completo para PYMEs: Intune + Defender P1 + Entra ID P1 incluidos',
        why: 'Business Premium incluye todo lo de Business Standard más Microsoft Intune, Entra ID P1 (acceso condicional, MFA avanzado) y Defender for Office 365 Plan 1. Es el plan más elegido para sectores regulados dentro del límite de 300 usuarios.',
        whyNot: 'Business Standard no incluye Intune ni Defender for Office 365 Plan 1, lo que lo hace insuficiente para sectores regulados. E3 ofrece capacidades similares pero sin el tope de 300 usuarios y con Exchange Plan 2 incluido.'
      },
      BusinessStandard: {
        subtitle: 'Office instalado + colaboración completa sin necesidad de MDM',
        why: 'Business Standard incluye Office instalado en hasta 5 dispositivos por usuario, Teams, SharePoint, Exchange Online con 50 GB de buzón y OneDrive con 1 TB. Es el equilibrio entre funcionalidad y costo para organizaciones sin requisitos de MDM.',
        whyNot: 'Business Basic no incluye Office instalado. Business Premium agrega Intune y Defender P1 con un costo adicional que solo se justifica si hay requisitos de MDM o sector regulado.'
      },
      BusinessBasic: {
        subtitle: 'Colaboración cloud completa sin Office instalado',
        why: 'Business Basic cubre Teams, SharePoint, Exchange Online con 50 GB y OneDrive con 1 TB. Incluye las versiones web de Office, suficientes para la mayoría de tareas de oficina.',
        whyNot: 'Business Standard agrega Office instalado, necesario para archivos complejos o macros. Business Premium añade Intune y Defender P1 para organizaciones con requisitos de seguridad más estrictos.'
      },
      BusinessBasic_F1: {
        subtitle: 'Modelo mixto: M365 F1 para primera línea + Business Basic para trabajadores del conocimiento',
        why: 'Tu organización tiene dos perfiles de usuario. M365 F1 cubre a los trabajadores de primera línea (sin PC fija) con Teams y acceso móvil a un costo menor. Business Basic cubre al resto con colaboración cloud completa.',
        whyNot: 'Asignar Business Basic a toda la organización sobrelicenciaría a los trabajadores de primera línea. F3 es alternativa a F1 si esos usuarios necesitan crear documentos con Office web.'
      },
      BusinessStandard_F3: {
        subtitle: 'Modelo mixto: M365 F3 para primera línea + Business Standard para trabajadores del conocimiento',
        why: 'M365 F3 cubre a los trabajadores de primera línea con Office Web Apps completo y 1 TB en OneDrive. Business Standard cubre al resto con Office instalado y colaboración completa.',
        whyNot: 'F1 no incluye Office Web Apps completo. Asignar Business Standard a todos sería sobrelicenciar a usuarios sin PC fija.'
      }
    };

    var cmpState = {
      currentStep:    0,
      answers:        {},
      recommendation: null
    };

    var questionEl   = cmpQuestion;
    var progressFill = document.getElementById('cmpProgressFill');
    var progressBar  = document.getElementById('cmpProgressBar');
    var stepsEl      = document.getElementById('cmpSteps');
    var resultEl     = document.getElementById('cmpResult');
    var planBadgeEl  = document.getElementById('cmpPlanBadge');
    var planSubtitle = document.getElementById('cmpPlanSubtitle');
    var justifEl     = document.getElementById('cmpJustification');
    var addonsEl     = document.getElementById('cmpAddons');

    function buildStepDots() {
      stepsEl.innerHTML = QUESTIONS.map(function (_, i) {
        return '<div class="cmp-step-dot" id="cmpDot' + i + '" aria-label="Paso ' + (i + 1) + '">' + (i + 1) + '</div>';
      }).join('');
    }

    function updateStepDots(active) {
      QUESTIONS.forEach(function (_, i) {
        var dot = document.getElementById('cmpDot' + i);
        dot.className = 'cmp-step-dot';
        if (i < active)   dot.classList.add('cmp-step-dot--done');
        if (i === active) dot.classList.add('cmp-step-dot--active');
      });
    }

    function updateProgress(step) {
      progressFill.style.width = (step / QUESTIONS.length * 100) + '%';
      progressBar.setAttribute('aria-valuenow', step);
    }

    function renderStep(stepIndex, direction) {
      direction = direction || 'forward';
      cmpState.currentStep = stepIndex;
      var q          = QUESTIONS[stepIndex];
      var exitClass  = direction === 'forward' ? 'cmp-question--exit-left'  : 'cmp-question--exit-right';
      var enterClass = direction === 'forward' ? 'cmp-question--enter-right' : 'cmp-question--enter-left';

      questionEl.classList.remove('cmp-question--visible');
      questionEl.classList.add(exitClass);

      setTimeout(function () {
        questionEl.innerHTML = buildQuestionHTML(q, stepIndex);
        questionEl.classList.remove(exitClass);
        questionEl.classList.add(enterClass);
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            questionEl.classList.remove(enterClass);
            questionEl.classList.add('cmp-question--visible');
          });
        });
        questionEl.querySelectorAll('.cmp-option').forEach(function (btn) {
          btn.addEventListener('click', function () { handleOptionClick(q.id, this.dataset.value); });
        });
        var backBtn = questionEl.querySelector('#cmpBack');
        if (backBtn) backBtn.addEventListener('click', function () { renderStep(stepIndex - 1, 'back'); });
        updateStepDots(stepIndex);
        updateProgress(stepIndex);
      }, 220);
    }

    function buildQuestionHTML(q, stepIndex) {
      var options = q.options.map(function (opt) {
        return '<button class="cmp-option" data-value="' + opt.value + '" type="button">' +
          '<span class="cmp-option-icon"><i class="fas ' + opt.icon + '"></i></span>' +
          '<span class="cmp-option-label">' + opt.label + '</span>' +
          '</button>';
      }).join('');
      var backBtn = stepIndex > 0
        ? '<button class="cmp-back-btn" id="cmpBack" type="button"><i class="fas fa-arrow-left"></i> Anterior</button>'
        : '';
      return '<p class="cmp-question-num">Pregunta ' + (stepIndex + 1) + ' de ' + QUESTIONS.length + '</p>' +
        '<h2 class="cmp-question-text">' + q.text + '</h2>' +
        '<div class="cmp-options" role="group" aria-label="' + q.text + '">' + options + '</div>' +
        '<div class="cmp-nav-row">' + backBtn + '</div>';
    }

    function handleOptionClick(questionId, value) {
      cmpState.answers[questionId] = value;
      if (cmpState.currentStep < QUESTIONS.length - 1) {
        renderStep(cmpState.currentStep + 1, 'forward');
      } else {
        updateProgress(QUESTIONS.length);
        updateStepDots(QUESTIONS.length);
        computeAndShowResult();
      }
    }

    function computeRecommendation(a) {
      if (a.q1_size === 'large' || a.q6_compliance === 'all') {
        return a.q6_compliance === 'all' ? 'E5' : 'E3';
      }
      if (a.q4_regulated === 'yes' || a.q3_mdm === 'yes') {
        return a.q6_compliance === 'some' ? 'E3' : 'BusinessPremium';
      }
      if (a.q6_compliance === 'some') return 'BusinessPremium';
      if (a.q2_desktop === 'yes' || a.q2_desktop === 'mixed') {
        return a.q5_frontline === 'yes' ? 'BusinessStandard_F3' : 'BusinessStandard';
      }
      return a.q5_frontline === 'yes' ? 'BusinessBasic_F1' : 'BusinessBasic';
    }

    function computeAndShowResult() {
      var recKey = computeRecommendation(cmpState.answers);
      cmpState.recommendation = recKey;
      var rec   = RECOMMENDATIONS[recKey];
      var parts = recKey.split('_');
      var plan  = PLANS_DATA[parts[0]];

      var badgeHTML = '<span style="background:linear-gradient(135deg,' + plan.color + '22,' + plan.color + '44);color:' + plan.color + ';border:1px solid ' + plan.color + '55">' + plan.label + '</span>';
      if (parts[1]) {
        var plan2 = PLANS_DATA[parts[1]];
        badgeHTML += '<span class="cmp-plus">+</span><span style="background:linear-gradient(135deg,' + plan2.color + '22,' + plan2.color + '44);color:' + plan2.color + ';border:1px solid ' + plan2.color + '55">' + plan2.label + '</span>';
      }
      planBadgeEl.innerHTML = badgeHTML;
      planSubtitle.textContent = rec.subtitle;

      justifEl.innerHTML =
        '<div class="cmp-just-block"><p class="cmp-just-title"><i class="fas fa-check-circle" style="color:var(--accent)"></i> Por qué este plan</p><p>' + rec.why + '</p></div>' +
        '<div class="cmp-just-block"><p class="cmp-just-title"><i class="fas fa-times-circle" style="color:#f472b6"></i> Por qué no los otros</p><p>' + rec.whyNot + '</p></div>';

      if (rec.addon) {
        addonsEl.innerHTML =
          '<p class="cmp-addons-title"><i class="fas fa-puzzle-piece"></i> Add-on recomendado</p>' +
          '<div class="cmp-addon-card"><div class="cmp-addon-icon"><i class="fas ' + rec.addon.icon + '"></i></div><div><p class="cmp-addon-name">' + rec.addon.label + '</p><p class="cmp-addon-why">' + rec.addon.why + '</p></div></div>';
        addonsEl.style.display = 'block';
      } else {
        addonsEl.style.display = 'none';
      }

      resultEl.removeAttribute('hidden');
    }

    function restart() {
      cmpState.currentStep = 0;
      cmpState.answers = {};
      cmpState.recommendation = null;
      resultEl.setAttribute('hidden', '');
      renderStep(0);
      updateProgress(0);
      updateStepDots(0);
    }

    buildStepDots();
    renderStep(0);
    document.getElementById('cmpRestart').addEventListener('click', restart);
    document.getElementById('cmpGoToTable').addEventListener('click', function () {
      switchDoc('m365-guide');
    });
  })();

})();
