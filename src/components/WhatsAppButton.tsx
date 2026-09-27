export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/59899000000?text=Hola%2C%20quiero%20hacer%20una%20consulta"
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-600"
    >
      <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.697 4.61 1.902 6.487L4 29l7.71-1.869A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm0 21.6a9.55 9.55 0 0 1-4.87-1.34l-.35-.21-4.58 1.11 1.13-4.46-.23-.36A9.55 9.55 0 1 1 25.55 15a9.56 9.56 0 0 1-9.55 9.6Zm5.24-7.15c-.29-.15-1.71-.84-1.97-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.21-.45-2.3-1.43-.85-.76-1.42-1.7-1.59-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.51h-.56c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.42 0 1.42 1.03 2.8 1.17 3 .15.19 2.03 3.1 4.92 4.35.69.3 1.22.48 1.64.61.69.22 1.31.19 1.81.11.55-.08 1.71-.7 1.95-1.37.24-.67.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
      </svg>
      WhatsApp
    </a>
  )
}
