"use client"

import { createContext, useContext, useState, type ReactNode, useCallback } from "react"

/**
 * Language options available in the application
 * Each language has a code and display name
 */
export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
]

/**
 * UI text translations for all supported languages
 * Organized by language code and then by text key
 */
export const uiText: Record<string, Record<string, string>> = {
  en: {
    newChat: "New chat",
    howCanIHelp: "How can I help you today?",
    askAboutDocs:
      "Ask me anything about the pre-loaded documents. I'll only respond based on information in my knowledge base.",
    messagePlaceholder: "Message Gemini...",
    disclaimer: "Gemini may display inaccurate info, including about people, so double-check its responses.",
    loading: "Loading...",
    demoTitle: "Gemini RAG Demo",
    usingPreloadedContext: "Using pre-loaded context",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
    changeLanguage: "Change language",
    enterFullscreen: "Enter fullscreen",
    exitFullscreen: "Exit fullscreen",
    minimizeChatbot: "Minimize chatbot",
  },
  es: {
    newChat: "Nueva conversación",
    howCanIHelp: "¿Cómo puedo ayudarte hoy?",
    askAboutDocs:
      "Pregúntame cualquier cosa sobre los documentos precargados. Solo responderé basándome en la información de mi base de conocimientos.",
    messagePlaceholder: "Mensaje a Gemini...",
    disclaimer: "Gemini puede mostrar información inexacta, incluso sobre personas, así que verifica sus respuestas.",
    loading: "Cargando...",
    demoTitle: "Demo de RAG con Gemini",
    usingPreloadedContext: "Usando contexto precargado",
    collapseSidebar: "Colapsar barra lateral",
    expandSidebar: "Expandir barra lateral",
    changeLanguage: "Cambiar idioma",
    enterFullscreen: "Pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    minimizeChatbot: "Minimizar chatbot",
  },
  fr: {
    newChat: "Nouvelle conversation",
    howCanIHelp: "Comment puis-je vous aider aujourd'hui ?",
    askAboutDocs:
      "Posez-moi n'importe quelle question sur les documents préchargés. Je ne répondrai qu'en fonction des informations de ma base de connaissances.",
    messagePlaceholder: "Message à Gemini...",
    disclaimer:
      "Gemini peut afficher des informations inexactes, y compris sur des personnes, alors vérifiez ses réponses.",
    loading: "Chargement...",
    demoTitle: "Démo RAG de Gemini",
    usingPreloadedContext: "Utilisant un contexte préchargé",
    collapseSidebar: "Réduire la barre latérale",
    expandSidebar: "Développer la barre latérale",
    changeLanguage: "Changer de langue",
    enterFullscreen: "Plein écran",
    exitFullscreen: "Quitter le plein écran",
    minimizeChatbot: "Minimiser le chatbot",
  },
  de: {
    newChat: "Neuer Chat",
    howCanIHelp: "Wie kann ich Ihnen heute helfen?",
    askAboutDocs:
      "Fragen Sie mich alles über die vorgeladenen Dokumente. Ich antworte nur basierend auf Informationen in meiner Wissensdatenbank.",
    messagePlaceholder: "Nachricht an Gemini...",
    disclaimer: "Gemini kann ungenaue Informationen anzeigen, auch über Personen, also überprüfen Sie die Antworten.",
    loading: "Wird geladen...",
    demoTitle: "Gemini RAG Demo",
    usingPreloadedContext: "Mit vorgeladenem Kontext",
    collapseSidebar: "Seitenleiste einklappen",
    expandSidebar: "Seitenleiste ausklappen",
    changeLanguage: "Sprache ändern",
    enterFullscreen: "Vollbildmodus",
    exitFullscreen: "Vollbildmodus beenden",
    minimizeChatbot: "Chatbot minimieren",
  },
  it: {
    newChat: "Nuova chat",
    howCanIHelp: "Come posso aiutarti oggi?",
    askAboutDocs:
      "Chiedimi qualsiasi cosa sui documenti precaricati. Risponderò solo in base alle informazioni nella mia base di conoscenza.",
    messagePlaceholder: "Messaggio a Gemini...",
    disclaimer:
      "Gemini potrebbe mostrare informazioni imprecise, anche sulle persone, quindi verifica le sue risposte.",
    loading: "Caricamento...",
    demoTitle: "Demo RAG di Gemini",
    usingPreloadedContext: "Utilizzando contesto precaricato",
    collapseSidebar: "Comprimi barra laterale",
    expandSidebar: "Espandi barra laterale",
    changeLanguage: "Cambia lingua",
    enterFullscreen: "Schermo intero",
    exitFullscreen: "Esci da schermo intero",
    minimizeChatbot: "Minimizza chatbot",
  },
  pt: {
    newChat: "Nova conversa",
    howCanIHelp: "Como posso ajudar você hoje?",
    askAboutDocs:
      "Pergunte-me qualquer coisa sobre os documentos pré-carregados. Responderei apenas com base nas informações da minha base de conhecimento.",
    messagePlaceholder: "Mensagem para Gemini...",
    disclaimer: "Gemini pode exibir informações imprecisas, inclusive sobre pessoas, então verifique suas respostas.",
    loading: "Carregando...",
    demoTitle: "Demo RAG do Gemini",
    usingPreloadedContext: "Usando contexto pré-carregado",
    collapseSidebar: "Recolher barra lateral",
    expandSidebar: "Expandir barra lateral",
    changeLanguage: "Mudar idioma",
    enterFullscreen: "Tela cheia",
    exitFullscreen: "Sair da tela cheia",
    minimizeChatbot: "Minimizar chatbot",
  },
  zh: {
    newChat: "新对话",
    howCanIHelp: "今天我能帮您什么忙？",
    askAboutDocs: "问我任何关于预加载文档的问题。我只会根据我知识库中的信息回答。",
    messagePlaceholder: "发送消息给Gemini...",
    disclaimer: "Gemini可能会显示不准确的信息，包括关于人的信息，所以请仔细核对其回答。",
    loading: "加载中...",
    demoTitle: "Gemini RAG 演示",
    usingPreloadedContext: "使用预加载的上下文",
    collapseSidebar: "收起侧边栏",
    expandSidebar: "展开侧边栏",
    changeLanguage: "更改语言",
    enterFullscreen: "进入全屏",
    exitFullscreen: "退出全屏",
    minimizeChatbot: "最小化聊天机器人",
  },
  ja: {
    newChat: "新しいチャット",
    howCanIHelp: "今日はどのようにお手伝いできますか？",
    askAboutDocs: "プリロードされた文書について何でも質問してください。私は知識ベースの情報に基づいてのみ回答します。",
    messagePlaceholder: "Geminiにメッセージ...",
    disclaimer: "Geminiは人に関するものを含め、不正確な情報を表示する可能性があるため、回答を再確認してください。",
    loading: "読み込み中...",
    demoTitle: "Gemini RAG デモ",
    usingPreloadedContext: "プリロードされたコンテキストを使用",
    collapseSidebar: "サイドバーを折りたたむ",
    expandSidebar: "サイドバーを展開する",
    changeLanguage: "言語を変更",
    enterFullscreen: "全画面表示",
    exitFullscreen: "全画面表示を終了",
    minimizeChatbot: "チャットボットを最小化",
  },
  ko: {
    newChat: "새 채팅",
    howCanIHelp: "오늘 어떻게 도와드릴까요?",
    askAboutDocs: "미리 로드된 문서에 대해 무엇이든 물어보세요. 저는 제 지식 기반의 정보만을 바탕으로 답변합니다.",
    messagePlaceholder: "Gemini에게 메시지...",
    disclaimer: "Gemini는 사람에 관한 것을 포함하여 부정확한 정보를 표시할 수 있으므로 응답을 다시 확인하세요.",
    loading: "로딩 중...",
    demoTitle: "Gemini RAG 데모",
    usingPreloadedContext: "미리 로드된 컨텍스트 사용",
    collapseSidebar: "사이드바 접기",
    expandSidebar: "사이드바 펼치기",
    changeLanguage: "언어 변경",
    enterFullscreen: "전체 화면",
    exitFullscreen: "전체 화면 종료",
    minimizeChatbot: "챗봇 최소화",
  },
  ru: {
    newChat: "Новый чат",
    howCanIHelp: "Чем я могу помочь вам сегодня?",
    askAboutDocs:
      "Спрашивайте меня о чем угодно из предзагруженных документов. Я буду отвечать только на основе информации из моей базы знаний.",
    messagePlaceholder: "Сообщение для Gemini...",
    disclaimer: "Gemini может отображать неточную информацию, в том числе о людях, поэтому перепроверяйте ответы.",
    loading: "Загрузка...",
    demoTitle: "Демо Gemini RAG",
    usingPreloadedContext: "Использование предзагруженного контекста",
    collapseSidebar: "Свернуть боковую панель",
    expandSidebar: "Развернуть боковую панель",
    changeLanguage: "Изменить язык",
    enterFullscreen: "Полноэкранный режим",
    exitFullscreen: "Выйти из полноэкранного режима",
    minimizeChatbot: "Свернуть чат-бота",
  },
}

/**
 * Language-specific "no information" responses for the API
 * Used when the chatbot doesn't have information about a query
 */
export const noInfoResponses: Record<string, string> = {
  en: "I don't have information about that in my knowledge base.",
  es: "No tengo información sobre eso en mi base de conocimientos.",
  fr: "Je n'ai pas d'informations à ce sujet dans ma base de connaissances.",
  de: "Ich habe keine Informationen darüber in meiner Wissensdatenbank.",
  it: "Non ho informazioni su questo nella mia base di conoscenza.",
  pt: "Não tenho informações sobre isso na minha base de conhecimento.",
  zh: "我的知识库中没有关于这方面的信息。",
  ja: "知識ベースにその情報はありません。",
  ko: "제 지식 기반에는 그에 대한 정보가 없습니다.",
  ru: "У меня нет информации об этом в моей базе знаний.",
}

/**
 * Helper function to get UI text based on language
 * Falls back to English if the requested text is not available in the selected language
 *
 * @param language - The language code
 * @param key - The text key to retrieve
 * @returns The translated text
 */
export function getText(language: string, key: string): string {
  return uiText[language]?.[key] || uiText.en[key]
}

/**
 * Type definition for the Language Context
 */
type LanguageContextType = {
  language: string
  setLanguage: (code: string) => void
  getText: (key: string) => string
}

/**
 * React Context for language settings
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// /**
//  * Language Provider Component
//  *
//  * Provides language state and translation functions to the application
//  *
//  * @param children - Child components
//  */
// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [language, setLanguage] = useState("en")

//   // Use useCallback to memoize the getText function to prevent unnecessary re-renders
//   const getTextForCurrentLanguage = useCallback(
//     (key: string) => {
//       return getText(language, key)
//     },
//     [language],
//   )

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, getText: getTextForCurrentLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   )
// }

/**
 * Custom hook to access the language context
 *
 * @returns The language context containing language state and functions
 * @throws Error if used outside of a LanguageProvider
 */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
