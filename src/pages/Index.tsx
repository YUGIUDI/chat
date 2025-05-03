
import WhatsAppMessenger from "@/components/WhatsAppMessenger";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl w-full mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-whatsapp-dark">WhatsApp Messenger</h1>
          <p className="text-gray-600 mt-2">Send WhatsApp messages to your contacts</p>
        </header>
        
        <WhatsAppMessenger />
        
        <footer className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} WhatsApp Messenger App
        </footer>
      </div>
    </div>
  );
};

export default Index;
