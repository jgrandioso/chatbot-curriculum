import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import { noInfoResponses } from "@/lib/languages"


dotenv.config();

const api_key = process.env.GEMINI_API_KEY
const knowledgeBase = [
  "Soy Jorge Grande Nadal, desarrollador especializado en backend y ciberseguridad, con formación en Desarrollo de Aplicaciones Multiplataforma por la Universidad Europea de Madrid (2019–2021), donde trabajé con tecnologías como Spring, Java, Swift, Python y Android. Durante este curso, adquirí habilidades en el desarrollo de aplicaciones multiplataforma utilizando lenguajes como Java, Python, JavaScript, HTML y CSS. Además, me especialicé en la implementación de metodologías ágiles como Scrum y en el desarrollo de aplicaciones en entornos de computación en la nube e Internet de las Cosas (IoT). La formación también incluyó contenidos avanzados en ciberseguridad, cloud computing y herramientas de gestión de proyectos, lo que me permitió tener una visión integral de los procesos de desarrollo de software. Me apasiona la informática desde los 14 años y siempre he estado motivado por aprender, crecer profesionalmente y convertir ideas en proyectos funcionales. Trabajé en BOTECH Fraud Prevention & Intelligence S.L. entre 2022 y 2023. Empecé en el área de prevención de fraude con tarjetas y, gracias a mi rendimiento, me integré en el equipo de I+D bajo la supervisión directa del CTO. Durante ese tiempo, administré, mantuve y desarrollé varios servidores para la búsqueda y notificación en tiempo real de vulnerabilidades críticas de seguridad. También desarrollé y mantuve una aplicación Android para la detección y alerta de software malicioso, y diseñé un sistema automático de búsqueda de vulnerabilidades a partir de fuentes agregadas. Las tecnologías que utilicé incluían Python, Android, Linux y SQL. En 2024, me incorporé a LIVEMED Iberia como desarrollador backend, continuando mi trabajo con Python, Android y Linux. Hablo español (nativo), inglés (avanzado) y tengo nociones básicas de chino. Soy miembro de la ONG CISV España, con la que participé en programas educativos internacionales en Copenhague (2015) y Bucarest (2019). Mis intereses personales incluyen viajar (he visitado más de diez países), la lectura de autores como Glukhovsky, Sanderson o Lovecraft, tocar la guitarra española y el cine de autores como Tarantino, Nolan o Kubrick. Recibí una carta de recomendación firmada por Marta Cazorla Ming, responsable de RRHH en BOTECH, quien destacó mi iniciativa, adaptabilidad, responsabilidad y capacidad para aprender como cualidades clave para el éxito del departamento. Afirmó que fui una pieza esencial del equipo y recomendó plenamente mi incorporación a cualquier proyecto profesional. Mi número de teléfono es el 673610075. Mi correo electrócnico es jorgegrandenadal@gmail.com. Tengo 24 años. Tengo vehículo propio. Prefiero el trabajo presencial al teletrabajo, pero no descarto este último ni una modalidad híbrida. Mis expectativas salariales rondan los 24000 euros brutos anuales. Me gustaría enfocar mi carrera al desarrollo de Inteligencia Artificial y al desarrollo de aplicaciones en Android e IOS. Este chatbot ha sido creado con la ayuda de la IA de Vercel. Mi url de linkedin es www.linkedin.com/in/jorge-grande-nadal-b649a4200"
]

export async function createAPIsession(language:string){

  const ai = new GoogleGenAI({ apiKey: api_key });

  // Get language-specific "no information" response for the system prompt
  const noInfoResponse = noInfoResponses[language] || noInfoResponses.en

  const resp = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents:"Hola",
    config:{
      systemInstruction: `You are a helpful assistant that ONLY answers questions based on the provided context. 
        If the information cannot be found in the context, respond with "${noInfoResponse}"
        The context is: $(knowledgeBase)
        Do not use any prior knowledge or make assumptions beyond what is explicitly stated in the context.
        IMPORTANT: Always respond in ${language} language regardless of the language of the query or context.
        Answer based ONLY on the above context in ${language} language:`,
    }
  })

return resp.text

}
